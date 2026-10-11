import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.ts';
import { admins, sessions, loginAttempts, auditLogs } from '../db/schema.ts';
import { eq, and, gt, desc } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser;
  sessionToken?: string;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  const bufA = Buffer.from(computedHash, 'hex');
  const bufB = Buffer.from(hash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export async function isRateLimited(ip: string, email: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentAttempts = await db.select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipAddress, ip),
        eq(loginAttempts.success, false),
        gt(loginAttempts.attemptedAt, windowStart)
      )
    );

  return recentAttempts.length >= MAX_FAILED_ATTEMPTS;
}

export async function recordLoginAttempt(ip: string, email: string, success: boolean): Promise<void> {
  await db.insert(loginAttempts).values({
    ipAddress: ip,
    email: email.toLowerCase().trim(),
    success,
  });
}

export async function createSession(admin: AdminUser, req: Request, res: Response): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  await db.insert(sessions).values({
    id: sessionToken,
    adminId: admin.id,
    adminEmail: admin.email,
    role: admin.role,
    expiresAt,
    ipAddress: ip,
    userAgent,
  });

  // Update last login timestamp
  await db.update(admins)
    .set({ lastLoginAt: new Date() })
    .where(eq(admins.id, admin.id));

  // Set HTTP-only secure cookie
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  });

  return sessionToken;
}

export async function destroySession(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['x-session-token'];
  if (typeof token === 'string') {
    await db.delete(sessions).where(eq(sessions.id, token));
  }
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['x-session-token'];

  if (!token || typeof token !== 'string') {
    res.status(401).json({ error: 'Unauthorized. Administrator authentication required.' });
    return;
  }

  try {
    const sessionRecords = await db.select()
      .from(sessions)
      .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (sessionRecords.length === 0) {
      res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
      return;
    }

    const session = sessionRecords[0];
    const adminRecords = await db.select()
      .from(admins)
      .where(eq(admins.id, session.adminId))
      .limit(1);

    if (adminRecords.length === 0) {
      res.status(401).json({ error: 'Admin account not found.' });
      return;
    }

    const admin = adminRecords[0];
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    };
    req.sessionToken = token;
    next();
  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ error: 'Internal security authentication check failed.' });
  }
}

export async function logAuditEvent(
  adminEmail: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      adminEmail,
      action,
      entityType,
      entityId: entityId || null,
      details: details || null,
    });
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}

export async function getAdminCount(): Promise<number> {
  const all = await db.select().from(admins);
  return all.length;
}

export async function bootstrapInitialAdmin(): Promise<{ bootstrapped: boolean; email?: string; message: string }> {
  try {
    const count = await getAdminCount();
    const targetEmail = (process.env.INITIAL_ADMIN_EMAIL || 'dharuvattri@gmail.com').toLowerCase().trim();
    const envPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (envPassword && envPassword.trim().length >= 8) {
      const { hash, salt } = hashPassword(envPassword.trim());
      if (count === 0) {
        await db.insert(admins).values({
          email: targetEmail,
          passwordHash: hash,
          salt,
          role: 'superadmin',
          fullName: 'School Administrator',
        });
        await logAuditEvent(targetEmail, 'INITIAL_BOOTSTRAP', 'ADMIN', targetEmail, 'Bootstrapped via server environment secrets');
      } else {
        await db.update(admins)
          .set({ passwordHash: hash, salt })
          .where(eq(admins.email, targetEmail));
        await logAuditEvent(targetEmail, 'ENV_PASSWORD_SYNC', 'ADMIN', targetEmail, 'Synced password via environment secret');
      }

      return {
        bootstrapped: true,
        email: targetEmail,
        message: 'Administrator password successfully synced via environment configuration.',
      };
    }

    if (count > 0) {
      return { bootstrapped: false, message: 'Admins already exist. Bootstrap is permanently locked.' };
    }

    return {
      bootstrapped: false,
      message: 'Initial admin not yet created. Set INITIAL_ADMIN_PASSWORD in environment or use one-time token setup.',
    };
  } catch (error) {
    console.error('Bootstrap check failed:', error);
    return { bootstrapped: false, message: 'Database error during bootstrap check.' };
  }
}
