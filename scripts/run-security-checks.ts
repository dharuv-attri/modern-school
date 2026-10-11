import app from '../src/server/api.ts';
import { db } from '../src/db/index.ts';
import { admins, sessions, loginAttempts, auditLogs, admissionEnquiries } from '../src/db/schema.ts';
import { hashPassword } from '../src/server/auth.ts';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  ✓ PASS: ${name} (${details})`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ✗ FAIL: ${name} (${details})`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING SECURITY AND PERMISSION VALIDATION CHECKS');
  console.log('Modern Public Sr. Sec. School, Swarghat');
  console.log('====================================================\n');

  // Start test server on dynamic port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Clean test state for login attempts
    await db.delete(loginAttempts);

    // 1. Unauthenticated Admin/API Denial
    console.log('--- Test Suite 1: Unauthenticated Admin API Denial ---');
    const resEnquiries = await fetch(`${baseUrl}/api/admin/enquiries`);
    assert(
      resEnquiries.status === 401,
      'Deny unauthenticated GET /api/admin/enquiries',
      `HTTP status was ${resEnquiries.status}`
    );

    const resStats = await fetch(`${baseUrl}/api/admin/stats`);
    assert(
      resStats.status === 401,
      'Deny unauthenticated GET /api/admin/stats',
      `HTTP status was ${resStats.status}`
    );

    const resMe = await fetch(`${baseUrl}/api/auth/me`);
    assert(
      resMe.status === 401,
      'Deny unauthenticated GET /api/auth/me',
      `HTTP status was ${resMe.status}`
    );

    // 2. Non-Admin Write Denial
    console.log('\n--- Test Suite 2: Non-Admin Write Denial ---');
    const resWriteNotice = await fetch(`${baseUrl}/api/admin/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Notice', category: 'General', content: 'Exploit', date: '2026-10-11' }),
    });
    assert(
      resWriteNotice.status === 401,
      'Deny unauthenticated POST /api/admin/notices',
      `HTTP status was ${resWriteNotice.status}`
    );

    const resSettings = await fetch(`${baseUrl}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ school_name: 'Defaced School' }),
    });
    assert(
      resSettings.status === 401,
      'Deny unauthenticated PUT /api/admin/settings',
      `HTTP status was ${resSettings.status}`
    );

    // 3. Admission Enquiry Privacy
    console.log('\n--- Test Suite 3: Admission Enquiry Privacy & Public Submission ---');
    const uniqueTestName = `Test Student ${Date.now()}`;
    const resSubmit = await fetch(`${baseUrl}/api/admissions/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: uniqueTestName,
        parentName: 'Parent Verification',
        phone: '+91 98160-12345',
        classSeeking: 'Class XI (Science)',
        address: 'Swarghat Village, Bilaspur',
        message: 'Requesting syllabus details',
      }),
    });
    assert(
      resSubmit.status === 201,
      'Allow public submission POST /api/admissions/enquiry',
      `HTTP status was ${resSubmit.status}`
    );

    const resPublicList = await fetch(`${baseUrl}/api/admissions/enquiries`);
    assert(
      resPublicList.status === 401,
      'Deny public listing GET /api/admissions/enquiries (Privacy Protection)',
      `HTTP status was ${resPublicList.status}`
    );

    // 4. Image Mutation Authorization
    console.log('\n--- Test Suite 4: Image Mutation Authorization ---');
    const resUpload = await fetch(`${baseUrl}/api/admin/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
      }),
    });
    assert(
      resUpload.status === 401,
      'Deny unauthenticated POST /api/admin/upload',
      `HTTP status was ${resUpload.status}`
    );

    const resDeleteGallery = await fetch(`${baseUrl}/api/admin/gallery/9999`, {
      method: 'DELETE',
    });
    assert(
      resDeleteGallery.status === 401,
      'Deny unauthenticated DELETE /api/admin/gallery/:id',
      `HTTP status was ${resDeleteGallery.status}`
    );

    // 5. Secure Invalid Login Behavior
    console.log('\n--- Test Suite 5: Secure Invalid Login Behavior ---');
    const resBadLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent-user@example.com',
        password: 'incorrectPassword123',
      }),
    });
    const badLoginData = await resBadLogin.json();
    assert(
      resBadLogin.status === 401 && badLoginData.error === 'Invalid email or password.',
      'Generic invalid credentials error (no user enumeration)',
      `HTTP ${resBadLogin.status}: ${badLoginData.error}`
    );

    // 6. Rate Limiting on Consecutive Failed Logins
    console.log('\n--- Test Suite 6: Login Rate Limiting ---');
    const attackEmail = `brute_test_${Date.now()}@example.com`;
    const attackerIp = '198.51.100.42';
    let gotRateLimited = false;
    for (let i = 0; i < 6; i++) {
      const resAttempt = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': attackerIp,
        },
        body: JSON.stringify({ email: attackEmail, password: 'wrongPassword' }),
      });
      if (resAttempt.status === 429) {
        gotRateLimited = true;
        break;
      }
    }
    assert(
      gotRateLimited,
      'Trigger 429 Rate Limit on repeated failed attempts',
      'Rate limiter successfully intercepted repeated failures'
    );

    // 7. Seed/Bootstrap Test Admin & Authenticated Flow
    console.log('\n--- Test Suite 7: Authenticated Admin Session Flow & Audit Trail ---');
    const testAdminEmail = `security-check-${randomBytes(8).toString('hex')}@example.test`;
    const testAdminPassword = randomBytes(32).toString('base64url');
    const adminIp = '203.0.113.10';

    const { hash, salt } = hashPassword(testAdminPassword);
    const existingAdmin = await db.select().from(admins).where(eq(admins.email, testAdminEmail));
    if (existingAdmin.length > 0) {
      throw new Error('Generated security-check email already exists.');
    }
    await db.insert(admins).values({
      email: testAdminEmail,
      passwordHash: hash,
      salt,
      role: 'superadmin',
      fullName: 'Security Check Administrator',
    });

    // Now test repeat bootstrap denial!
    const resRepeatBootstrap = await fetch(`${baseUrl}/api/auth/bootstrap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setupToken: randomBytes(32).toString('hex'),
        email: 'attacker@evil.com',
        password: 'Password123!',
      }),
    });
    assert(
      resRepeatBootstrap.status === 403,
      'Reject repeat bootstrap when admin already exists',
      `HTTP status was ${resRepeatBootstrap.status}`
    );

    // Perform legitimate login
    const resValidLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': adminIp,
      },
      body: JSON.stringify({
        email: testAdminEmail,
        password: testAdminPassword,
      }),
    });

    const loginData = await resValidLogin.json();
    const cookieHeader = resValidLogin.headers.get('set-cookie');
    const sessionToken = loginData.sessionToken;

    assert(
      resValidLogin.status === 200 && Boolean(sessionToken),
      'Authenticate legitimate admin and issue session token',
      `User ${testAdminEmail} signed in`
    );

    // Access protected enquiries with session token / cookie
    const resAuthedEnquiries = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: {
        'x-session-token': sessionToken,
        'x-forwarded-for': adminIp,
        Cookie: cookieHeader || `admin_session=${sessionToken}`,
      },
    });

    const enquiriesList = await resAuthedEnquiries.json();
    assert(
      resAuthedEnquiries.status === 200 && Array.isArray(enquiriesList),
      'Allow authenticated admin access to private admission enquiries',
      `Retrieved ${enquiriesList.length} private enquiry records`
    );

    // Test logout and session invalidation
    const resLogout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'x-session-token': sessionToken,
        'x-forwarded-for': adminIp,
        Cookie: cookieHeader || `admin_session=${sessionToken}`,
      },
    });
    assert(
      resLogout.status === 200,
      'Admin logout and session termination',
      'Session destroyed'
    );

    // Test old token after logout -> must be 401
    const resPostLogout = await fetch(`${baseUrl}/api/admin/enquiries`, {
      headers: {
        'x-session-token': sessionToken,
        'x-forwarded-for': adminIp,
      },
    });
    assert(
      resPostLogout.status === 401,
      'Reject revoked session token after logout',
      `HTTP status was ${resPostLogout.status}`
    );

  } finally {
    server.close();
  }

  console.log('\n====================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.passed).length} | FAILED: ${results.filter(r => !r.passed).length}`);
  console.log(`STATUS: ${allPassed ? 'ALL SECURITY CHECKS PASSED SUCCESSFULLY' : 'SECURITY CHECKS ENCOUNTERED FAILURES'}`);
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
