import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db/index.ts';
import {
  admins,
  schoolSettings,
  notices,
  calendarEvents,
  faculty,
  feeStructures,
  facilities,
  achievements,
  gallery,
  transportRoutes,
  admissionEnquiries,
  uploadedMedia,
  auditLogs,
} from '../db/schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  requireAdminAuth,
  AuthenticatedRequest,
  createSession,
  destroySession,
  verifyPassword,
  hashPassword,
  isRateLimited,
  recordLoginAttempt,
  getClientIp,
  logAuditEvent,
  getAdminCount,
  bootstrapInitialAdmin,
} from './auth.ts';
import { seedInitialSchoolData } from './seed.ts';

const app = express();

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Download complete project archive zip
app.get('/api/download-zip', (_req: Request, res: Response) => {
  const zipPath = path.resolve(process.cwd(), 'public', 'modern-public-school-swarghat.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'modern-public-school-swarghat.zip');
  } else {
    res.status(404).json({ error: 'Zip file not generated yet' });
  }
});

// Initialize DB seeding on server startup
let isInitialized = false;
async function initializeServer() {
  if (isInitialized) return;
  try {
    await bootstrapInitialAdmin();
    await seedInitialSchoolData();
    isInitialized = true;
  } catch (err) {
    console.error('Initialization error:', err);
  }
}
initializeServer();

/* =========================================================================
   PUBLIC ENDPOINTS
   ========================================================================= */

// Consolidated public school information
app.get('/api/public/data', async (_req: Request, res: Response) => {
  try {
    const [
      settingsRows,
      noticesRows,
      eventsRows,
      facultyRows,
      feeRows,
      facilityRows,
      achievementRows,
      galleryRows,
      routeRows,
    ] = await Promise.all([
      db.select().from(schoolSettings),
      db.select().from(notices).where(eq(notices.isPublished, true)).orderBy(desc(notices.isImportant), desc(notices.id)),
      db.select().from(calendarEvents).where(eq(calendarEvents.isPublished, true)).orderBy(asc(calendarEvents.startDate)),
      db.select().from(faculty).where(eq(faculty.isPublished, true)).orderBy(asc(faculty.sortOrder)),
      db.select().from(feeStructures).where(eq(feeStructures.isPublished, true)).orderBy(asc(feeStructures.sortOrder)),
      db.select().from(facilities).where(eq(facilities.isPublished, true)).orderBy(asc(facilities.sortOrder)),
      db.select().from(achievements).where(eq(achievements.isPublished, true)).orderBy(desc(achievements.year)),
      db.select().from(gallery).where(eq(gallery.isPublished, true)).orderBy(desc(gallery.id)),
      db.select().from(transportRoutes).where(eq(transportRoutes.isPublished, true)).orderBy(asc(transportRoutes.routeNumber)),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const row of settingsRows) {
      settingsMap[row.key] = row.value;
    }

    res.json({
      settings: settingsMap,
      notices: noticesRows,
      calendar: eventsRows,
      faculty: facultyRows,
      feeStructures: feeRows,
      facilities: facilityRows,
      achievements: achievementRows,
      gallery: galleryRows,
      transportRoutes: routeRows,
    });
  } catch (err) {
    console.error('Failed to load public data:', err);
    res.status(500).json({ error: 'Failed to retrieve school information' });
  }
});

// Public Admissions Enquiry submission
app.post('/api/admissions/enquiry', async (req: Request, res: Response) => {
  const { studentName, parentName, phone, email, classSeeking, currentSchool, address, message } = req.body;

  if (!studentName || !parentName || !phone || !classSeeking || !address) {
    res.status(400).json({
      error: 'Missing required admission enquiry fields: studentName, parentName, phone, classSeeking, address',
    });
    return;
  }

  // Basic phone sanitization / validation
  const cleanPhone = String(phone).replace(/[^\d+ -]/g, '').trim();
  if (cleanPhone.length < 8) {
    res.status(400).json({ error: 'Please provide a valid contact telephone or mobile number.' });
    return;
  }

  try {
    const result = await db.insert(admissionEnquiries).values({
      studentName: String(studentName).trim().slice(0, 255),
      parentName: String(parentName).trim().slice(0, 255),
      phone: cleanPhone.slice(0, 50),
      email: email ? String(email).trim().slice(0, 255) : null,
      classSeeking: String(classSeeking).trim().slice(0, 50),
      currentSchool: currentSchool ? String(currentSchool).trim().slice(0, 255) : null,
      address: String(address).trim(),
      message: message ? String(message).trim() : null,
      status: 'new',
    }).returning();

    res.status(201).json({
      success: true,
      id: result[0]?.id,
      message: 'Admission enquiry received successfully! The school admissions office will contact you shortly.',
    });
  } catch (err) {
    console.error('Failed to save admission enquiry:', err);
    res.status(500).json({ error: 'Failed to record admission enquiry. Please call school office directly.' });
  }
});

// Public enquiry list check - MUST BE REJECTED!
app.get('/api/admissions/enquiries', (_req: Request, res: Response) => {
  res.status(401).json({
    error: 'Unauthorized access. Student admission enquiries are private and accessible only to authorized administrators.',
  });
});

/* =========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================= */

// Check bootstrap status
app.get('/api/auth/status', async (_req: Request, res: Response) => {
  try {
    const count = await getAdminCount();
    res.json({
      isBootstrapped: count > 0,
      adminCount: count,
      targetInitialEmail: 'dharuvattri@gmail.com',
    });
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

// One-time Admin Bootstrap
app.post('/api/auth/bootstrap', async (req: Request, res: Response) => {
  try {
    const adminCount = await getAdminCount();
    if (adminCount > 0) {
      res.status(403).json({
        error: 'Admin already bootstrapped. Initial setup is permanently locked and disabled.',
      });
      return;
    }

    const { setupToken, email, password, fullName } = req.body;
    const requiredToken = process.env.ADMIN_BOOTSTRAP_TOKEN;

    if (!requiredToken || !setupToken || setupToken !== requiredToken) {
      res.status(403).json({ error: 'Invalid or missing bootstrap authorization token.' });
      return;
    }

    const adminEmail = (email || 'dharuvattri@gmail.com').toLowerCase().trim();
    if (!password || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const newAdmin = await db.insert(admins).values({
      email: adminEmail,
      passwordHash: hash,
      salt,
      role: 'superadmin',
      fullName: fullName ? String(fullName).trim() : 'School Administrator',
    }).returning();

    await logAuditEvent(adminEmail, 'BOOTSTRAP_COMPLETE', 'ADMIN', adminEmail, 'Initial admin created via bootstrap flow');

    // Auto-login after bootstrap
    const adminUser = {
      id: newAdmin[0].id,
      email: newAdmin[0].email,
      role: newAdmin[0].role,
      fullName: newAdmin[0].fullName,
    };
    const sessionToken = await createSession(adminUser, req, res);

    res.json({
      success: true,
      message: 'Initial administrator successfully initialized!',
      admin: adminUser,
      sessionToken,
    });
  } catch (err) {
    console.error('Bootstrap error:', err);
    res.status(500).json({ error: 'Bootstrap execution failed' });
  }
});

// Admin Login with Rate Limiting & Generic Failure Message
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = getClientIp(req);

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const cleanEmail = String(email).toLowerCase().trim();

  try {
    // Rate limit check
    const rateLimited = await isRateLimited(ip, cleanEmail);
    if (rateLimited) {
      res.status(429).json({
        error: 'Too many failed login attempts. For security, please wait 15 minutes before trying again.',
      });
      return;
    }

    const matchingAdmins = await db.select().from(admins).where(eq(admins.email, cleanEmail)).limit(1);

    if (matchingAdmins.length === 0) {
      await recordLoginAttempt(ip, cleanEmail, false);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const admin = matchingAdmins[0];
    const isMatch = verifyPassword(String(password), admin.passwordHash, admin.salt);

    if (!isMatch) {
      await recordLoginAttempt(ip, cleanEmail, false);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Success
    await recordLoginAttempt(ip, cleanEmail, true);
    const adminUser = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    };

    const sessionToken = await createSession(adminUser, req, res);
    await logAuditEvent(admin.email, 'LOGIN_SUCCESS', 'AUTH', admin.email, `IP: ${ip}`);

    res.json({
      success: true,
      message: 'Signed in successfully.',
      admin: adminUser,
      sessionToken,
    });
  } catch (err) {
    console.error('Login process error:', err);
    res.status(500).json({ error: 'Internal server authentication error' });
  }
});

// Current Admin Profile
app.get('/api/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    admin: req.admin,
  });
});

// Admin Logout
app.post('/api/auth/logout', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (req.admin) {
    await logAuditEvent(req.admin.email, 'LOGOUT', 'AUTH', req.admin.email);
  }
  await destroySession(req, res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Authenticated Password Change
app.post('/api/admin/change-password', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  try {
    const adminRecords = await db.select().from(admins).where(eq(admins.id, req.admin!.id)).limit(1);
    if (adminRecords.length === 0) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    const admin = adminRecords[0];
    const isCurrentValid = verifyPassword(String(currentPassword), admin.passwordHash, admin.salt);

    if (!isCurrentValid) {
      res.status(400).json({ error: 'Incorrect current password provided.' });
      return;
    }

    const { hash, salt } = hashPassword(String(newPassword));
    await db.update(admins)
      .set({ passwordHash: hash, salt })
      .where(eq(admins.id, admin.id));

    await logAuditEvent(admin.email, 'PASSWORD_CHANGE', 'ADMIN', admin.email, 'Password successfully updated');

    res.json({ success: true, message: 'Password successfully updated.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

/* =========================================================================
   PROTECTED ADMIN DASHBOARD & CMS OPERATIONS
   ========================================================================= */

// Admin overview stats
app.get('/api/admin/stats', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      enquiriesCount,
      noticesCount,
      eventsCount,
      facultyCount,
      galleryCount,
      routesCount,
      recentEnquiries,
      recentLogs,
    ] = await Promise.all([
      db.select().from(admissionEnquiries),
      db.select().from(notices),
      db.select().from(calendarEvents),
      db.select().from(faculty),
      db.select().from(gallery),
      db.select().from(transportRoutes),
      db.select().from(admissionEnquiries).orderBy(desc(admissionEnquiries.id)).limit(5),
      db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(10),
    ]);

    const newEnquiries = enquiriesCount.filter(e => e.status === 'new').length;

    res.json({
      counts: {
        totalEnquiries: enquiriesCount.length,
        newEnquiries,
        notices: noticesCount.length,
        calendarEvents: eventsCount.length,
        faculty: facultyCount.length,
        galleryImages: galleryCount.length,
        transportRoutes: routesCount.length,
      },
      recentEnquiries,
      recentLogs,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve admin statistics' });
  }
});

// Update School Settings
app.put('/api/admin/settings', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const settingsData: Record<string, string> = req.body;

  try {
    for (const [key, value] of Object.entries(settingsData)) {
      if (typeof key === 'string' && typeof value === 'string') {
        await db.insert(schoolSettings)
          .values({ key, value })
          .onConflictDoUpdate({
            target: schoolSettings.key,
            set: { value, updatedAt: new Date() },
          });
      }
    }

    await logAuditEvent(req.admin!.email, 'UPDATE_SETTINGS', 'SETTINGS', 'global', `Updated keys: ${Object.keys(settingsData).join(', ')}`);

    res.json({ success: true, message: 'School settings updated successfully.' });
  } catch (err) {
    console.error('Failed to update settings:', err);
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

// Admissions Enquiries - Admin View & Manage
app.get('/api/admin/enquiries', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const records = await db.select().from(admissionEnquiries).orderBy(desc(admissionEnquiries.id));
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
});

app.patch('/api/admin/enquiries/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const enquiryId = parseInt(req.params.id, 10);
  const { status, notes } = req.body;

  if (isNaN(enquiryId)) {
    res.status(400).json({ error: 'Invalid enquiry ID.' });
    return;
  }

  try {
    const updatePayload: Record<string, any> = {};
    if (status !== undefined) updatePayload.status = String(status);
    if (notes !== undefined) updatePayload.notes = String(notes);

    const updated = await db.update(admissionEnquiries)
      .set(updatePayload)
      .where(eq(admissionEnquiries.id, enquiryId))
      .returning();

    await logAuditEvent(req.admin!.email, 'UPDATE_ENQUIRY', 'ENQUIRY', String(enquiryId), `Status: ${status}`);

    res.json({ success: true, enquiry: updated[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

app.delete('/api/admin/enquiries/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const enquiryId = parseInt(req.params.id, 10);
  if (isNaN(enquiryId)) {
    res.status(400).json({ error: 'Invalid enquiry ID.' });
    return;
  }

  try {
    await db.delete(admissionEnquiries).where(eq(admissionEnquiries.id, enquiryId));
    await logAuditEvent(req.admin!.email, 'DELETE_ENQUIRY', 'ENQUIRY', String(enquiryId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// Notices Management
app.post('/api/admin/notices', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, category, content, date, isImportant, isPublished } = req.body;
  if (!title || !category || !content || !date) {
    res.status(400).json({ error: 'Title, category, content, and date are required.' });
    return;
  }

  try {
    const item = await db.insert(notices).values({
      title: String(title).trim(),
      category: String(category).trim(),
      content: String(content).trim(),
      date: String(date).trim(),
      isImportant: Boolean(isImportant),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }).returning();

    await logAuditEvent(req.admin!.email, 'CREATE_NOTICE', 'NOTICE', String(item[0].id), title);
    res.status(201).json({ success: true, notice: item[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

app.put('/api/admin/notices/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { title, category, content, date, isImportant, isPublished } = req.body;

  try {
    const updated = await db.update(notices)
      .set({
        title: title ? String(title).trim() : undefined,
        category: category ? String(category).trim() : undefined,
        content: content ? String(content).trim() : undefined,
        date: date ? String(date).trim() : undefined,
        isImportant: isImportant !== undefined ? Boolean(isImportant) : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      })
      .where(eq(notices.id, id))
      .returning();

    await logAuditEvent(req.admin!.email, 'UPDATE_NOTICE', 'NOTICE', String(id));
    res.json({ success: true, notice: updated[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

app.delete('/api/admin/notices/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(notices).where(eq(notices.id, id));
    await logAuditEvent(req.admin!.email, 'DELETE_NOTICE', 'NOTICE', String(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// Calendar Events Management
app.post('/api/admin/calendar', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, eventType, startDate, endDate, description, isPublished } = req.body;
  if (!title || !eventType || !startDate) {
    res.status(400).json({ error: 'Title, eventType, and startDate are required.' });
    return;
  }

  try {
    const item = await db.insert(calendarEvents).values({
      title: String(title).trim(),
      eventType: String(eventType).trim(),
      startDate: String(startDate).trim(),
      endDate: endDate ? String(endDate).trim() : null,
      description: description ? String(description).trim() : null,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }).returning();

    await logAuditEvent(req.admin!.email, 'CREATE_CALENDAR_EVENT', 'CALENDAR', String(item[0].id), title);
    res.status(201).json({ success: true, event: item[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add calendar event' });
  }
});

app.delete('/api/admin/calendar/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    await logAuditEvent(req.admin!.email, 'DELETE_CALENDAR_EVENT', 'CALENDAR', String(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

// Faculty Profiles Management
app.post('/api/admin/faculty', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, designation, department, qualification, experience, imageUrl, sortOrder, isPublished } = req.body;
  if (!name || !designation || !department || !qualification) {
    res.status(400).json({ error: 'Name, designation, department, and qualification are required.' });
    return;
  }

  try {
    const item = await db.insert(faculty).values({
      name: String(name).trim(),
      designation: String(designation).trim(),
      department: String(department).trim(),
      qualification: String(qualification).trim(),
      experience: experience ? String(experience).trim() : null,
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      sortOrder: Number(sortOrder) || 0,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }).returning();

    await logAuditEvent(req.admin!.email, 'CREATE_FACULTY', 'FACULTY', String(item[0].id), name);
    res.status(201).json({ success: true, faculty: item[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save faculty record' });
  }
});

app.delete('/api/admin/faculty/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(faculty).where(eq(faculty.id, id));
    await logAuditEvent(req.admin!.email, 'DELETE_FACULTY', 'FACULTY', String(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete faculty member' });
  }
});

// Fee Structures Management
app.put('/api/admin/fees/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { tuitionFeeMonthly, admissionFeeOnetime, annualCharges, notes } = req.body;

  try {
    const updated = await db.update(feeStructures)
      .set({
        tuitionFeeMonthly: tuitionFeeMonthly !== undefined ? Number(tuitionFeeMonthly) : undefined,
        admissionFeeOnetime: admissionFeeOnetime !== undefined ? Number(admissionFeeOnetime) : undefined,
        annualCharges: annualCharges !== undefined ? Number(annualCharges) : undefined,
        notes: notes !== undefined ? String(notes) : undefined,
      })
      .where(eq(feeStructures.id, id))
      .returning();

    await logAuditEvent(req.admin!.email, 'UPDATE_FEE', 'FEE_STRUCTURE', String(id));
    res.json({ success: true, fee: updated[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update fee record' });
  }
});

// Gallery Management
app.post('/api/admin/gallery', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, category, imageUrl, caption, date, isPublished } = req.body;
  if (!title || !category || !imageUrl) {
    res.status(400).json({ error: 'Title, category, and imageUrl are required.' });
    return;
  }

  try {
    const item = await db.insert(gallery).values({
      title: String(title).trim(),
      category: String(category).trim(),
      imageUrl: String(imageUrl).trim(),
      caption: caption ? String(caption).trim() : null,
      date: date ? String(date).trim() : null,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }).returning();

    await logAuditEvent(req.admin!.email, 'ADD_GALLERY_IMAGE', 'GALLERY', String(item[0].id), title);
    res.status(201).json({ success: true, item: item[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

app.delete('/api/admin/gallery/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(gallery).where(eq(gallery.id, id));
    await logAuditEvent(req.admin!.email, 'DELETE_GALLERY_IMAGE', 'GALLERY', String(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// Transport Routes Management
app.post('/api/admin/transport', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { routeNumber, routeName, coverageAreas, morningTime, eveningTime, vehicleType, driverIncharge, contactNumber } = req.body;
  if (!routeNumber || !routeName || !coverageAreas || !morningTime || !eveningTime || !vehicleType) {
    res.status(400).json({ error: 'Route number, name, areas, timings, and vehicle type are required.' });
    return;
  }

  try {
    const item = await db.insert(transportRoutes).values({
      routeNumber: String(routeNumber).trim(),
      routeName: String(routeName).trim(),
      coverageAreas: String(coverageAreas).trim(),
      morningTime: String(morningTime).trim(),
      eveningTime: String(eveningTime).trim(),
      vehicleType: String(vehicleType).trim(),
      driverIncharge: driverIncharge ? String(driverIncharge).trim() : null,
      contactNumber: contactNumber ? String(contactNumber).trim() : null,
      isPublished: true,
    }).returning();

    await logAuditEvent(req.admin!.email, 'ADD_TRANSPORT_ROUTE', 'TRANSPORT', String(item[0].id), routeNumber);
    res.status(201).json({ success: true, route: item[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transport route' });
  }
});

app.delete('/api/admin/transport/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await db.delete(transportRoutes).where(eq(transportRoutes.id, id));
    await logAuditEvent(req.admin!.email, 'DELETE_TRANSPORT_ROUTE', 'TRANSPORT', String(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transport route' });
  }
});

// Secure Image Upload with Mime/Magic Byte & Size Validation
app.post('/api/admin/upload', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { dataBase64, originalName, mimeType } = req.body;

  if (!dataBase64 || !originalName || !mimeType) {
    res.status(400).json({ error: 'dataBase64, originalName, and mimeType are required.' });
    return;
  }

  // Allowed MIME types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(mimeType)) {
    res.status(400).json({ error: 'Invalid file type. Allowed formats: JPEG, PNG, WebP, SVG.' });
    return;
  }

  try {
    const base64Clean = dataBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Size limit: 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'File size exceeds 5MB limit.' });
      return;
    }

    // Verify magic bytes for common image types
    if (mimeType === 'image/jpeg' && (buffer[0] !== 0xff || buffer[1] !== 0xd8)) {
      res.status(400).json({ error: 'File signature does not match JPEG image.' });
      return;
    }
    if (mimeType === 'image/png' && (buffer[0] !== 0x89 || buffer[1] !== 0x50)) {
      res.status(400).json({ error: 'File signature does not match PNG image.' });
      return;
    }

    const ext = mimeType === 'image/jpeg' ? '.jpg' :
                mimeType === 'image/png' ? '.png' :
                mimeType === 'image/webp' ? '.webp' : '.svg';

    const safeFilename = `upload_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, safeFilename);

    await fs.promises.writeFile(targetFilePath, buffer);
    const publicUrl = `/uploads/${safeFilename}`;

    const record = await db.insert(uploadedMedia).values({
      filename: safeFilename,
      originalName: String(originalName).slice(0, 255),
      mimeType,
      sizeBytes: buffer.length,
      storagePath: targetFilePath,
      publicUrl,
    }).returning();

    await logAuditEvent(req.admin!.email, 'UPLOAD_IMAGE', 'MEDIA', String(record[0].id), safeFilename);

    res.status(201).json({
      success: true,
      url: publicUrl,
      mediaId: record[0].id,
      filename: safeFilename,
    });
  } catch (err) {
    console.error('Upload processing error:', err);
    res.status(500).json({ error: 'Failed to process file upload.' });
  }
});

// Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.id)).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit trail' });
  }
});

export default app;
