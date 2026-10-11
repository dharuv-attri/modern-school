import { db } from './src/db/index.ts';
import { admins } from './src/db/schema.ts';
import { hashPassword, logAuditEvent } from './src/server/auth.ts';
import { eq } from 'drizzle-orm';

async function main() {
  const newPassword = process.argv[2] || process.env.INITIAL_ADMIN_PASSWORD;
  const targetEmail = (process.argv[3] || process.env.INITIAL_ADMIN_EMAIL || 'dharuvattri@gmail.com').toLowerCase().trim();

  if (!newPassword || newPassword.trim().length < 8) {
    console.error('Usage: npx tsx scripts/set-admin-password.ts <new-password> [email]');
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const { hash, salt } = hashPassword(newPassword.trim());

  const existing = await db.select().from(admins).where(eq(admins.email, targetEmail));

  if (existing.length === 0) {
    await db.insert(admins).values({
      email: targetEmail,
      passwordHash: hash,
      salt,
      role: 'superadmin',
      fullName: 'School Administrator',
    });
    console.log(`✓ Admin created successfully for ${targetEmail}`);
  } else {
    await db.update(admins)
      .set({ passwordHash: hash, salt })
      .where(eq(admins.email, targetEmail));
    console.log(`✓ Password updated successfully for existing admin: ${targetEmail}`);
  }

  await logAuditEvent(targetEmail, 'PASSWORD_ROTATED_CLI', 'ADMIN', targetEmail, 'Password reset via CLI script');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to set admin password:', err);
  process.exit(1);
});
