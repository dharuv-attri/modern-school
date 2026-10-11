import { pgTable, serial, text, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 128 }).primaryKey(),
  adminId: integer('admin_id').references(() => admins.id).notNull(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 64 }),
});

export const loginAttempts = pgTable('login_attempts', {
  id: serial('id').primaryKey(),
  ipAddress: varchar('ip_address', { length: 64 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  attemptedAt: timestamp('attempted_at').defaultNow(),
  success: boolean('success').notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: varchar('entity_id', { length: 100 }),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const schoolSettings = pgTable('school_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  content: text('content').notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  isImportant: boolean('is_important').default(false),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const calendarEvents = pgTable('calendar_events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  startDate: varchar('start_date', { length: 50 }).notNull(),
  endDate: varchar('end_date', { length: 50 }),
  description: text('description'),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const faculty = pgTable('faculty', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  designation: varchar('designation', { length: 100 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  qualification: varchar('qualification', { length: 255 }).notNull(),
  experience: varchar('experience', { length: 100 }),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').default(true),
});

export const feeStructures = pgTable('fee_structures', {
  id: serial('id').primaryKey(),
  gradeLevel: varchar('grade_level', { length: 100 }).notNull(),
  tuitionFeeMonthly: integer('tuition_fee_monthly').notNull(),
  admissionFeeOnetime: integer('admission_fee_onetime').notNull(),
  annualCharges: integer('annual_charges').notNull(),
  notes: text('notes'),
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').default(true),
});

export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  features: text('features'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').default(true),
});

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  year: varchar('year', { length: 50 }).notNull(),
  description: text('description').notNull(),
  recipient: varchar('recipient', { length: 255 }),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').default(true),
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  date: varchar('date', { length: 50 }),
  isPublished: boolean('is_published').default(true),
});

export const transportRoutes = pgTable('transport_routes', {
  id: serial('id').primaryKey(),
  routeNumber: varchar('route_number', { length: 50 }).notNull(),
  routeName: varchar('route_name', { length: 255 }).notNull(),
  coverageAreas: text('coverage_areas').notNull(),
  morningTime: varchar('morning_time', { length: 50 }).notNull(),
  eveningTime: varchar('evening_time', { length: 50 }).notNull(),
  vehicleType: varchar('vehicle_type', { length: 100 }).notNull(),
  driverIncharge: varchar('driver_incharge', { length: 100 }),
  contactNumber: varchar('contact_number', { length: 50 }),
  isPublished: boolean('is_published').default(true),
});

export const admissionEnquiries = pgTable('admission_enquiries', {
  id: serial('id').primaryKey(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  classSeeking: varchar('class_seeking', { length: 50 }).notNull(),
  currentSchool: varchar('current_school', { length: 255 }),
  address: text('address').notNull(),
  message: text('message'),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const uploadedMedia = pgTable('uploaded_media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  storagePath: text('storage_path').notNull(),
  publicUrl: text('public_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
