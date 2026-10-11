# Modern Public Sr. Sec. School, Swarghat

Official website and secure administration dashboard for **Modern Public Sr. Sec. School, Swarghat (District Bilaspur, Himachal Pradesh)**.

---

## 🌟 Features

### 🏫 Public School Website
- **Institutional Identity**: Affiliation details, school motto, vision and mission, and Principal's message.
- **Academic Pathways**: Pre-Primary to Class XII (Science Medical/Non-Medical, Commerce, and Humanities/Arts).
- **Infrastructure & Facilities**: Composite Science Laboratories, Knowledge Library, Sports Complex, Computer Lab, and Mountain Transport Fleet with high-resolution imagery.
- **Transparent Fee Structure**: Monthly tuition, one-time admission, and annual development fees per class wing.
- **Faculty Directory**: Teaching faculty and academic leadership profiles with qualifications and experience.
- **Notices & Academic Calendar**: Real-time circulars with urgent banner alerts, and month-by-month academic events, examination schedules, and holidays.
- **Photo Gallery**: Categorized image gallery (Campus, Labs, Sports, Events) with full-screen lightbox.
- **Mountain Transport Fleet**: Bus routes, stops, morning/evening timings, and driver incharge details.
- **Admissions Enquiry Form**: Validated online application submissions stored privately in the database.
- **Contact & Location**: Postal address on NH-205, phone numbers, office hours, and Google Maps location guide.

---

### 🛡️ Secure Admin Portal (`/admin`)
- **Authentication**: Strict server-side authentication using PBKDF2 with SHA-512 (100,000 iterations) and per-user cryptographic salt.
- **Session Management**: Secure, HTTP-only `SameSite=Lax` cookies with session expiration and instant rotation.
- **Rate Limiting**: Automatic IP and account rate limiting (5 failed attempts trigger a 15-minute lockout).
- **Anti-Enumeration**: Generic authentication errors (`"Invalid email or password."`).
- **Enquiry Privacy**: Admission enquiries are strictly private to authenticated administrators (`GET /api/admin/enquiries` returns HTTP 401 for unauthenticated users).
- **Safe Uploads**: File MIME and magic-byte signature validation (JPEG, PNG, WebP, SVG) with 5MB size limits.
- **Audit Logging**: Immutable audit logs capturing administrative actions, timestamps, and IP addresses.
- **CMS Control**: Full control over school settings, notices, calendar events, faculty, fee structures, facilities, gallery photos, and transport routes.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Database Configuration (Cloud SQL / PostgreSQL)
SQL_HOST="your-postgres-host-or-socket"
SQL_DB_NAME="your-database-name"
SQL_USER="your-db-user"
SQL_PASSWORD="your-db-password"
SQL_ADMIN_USER="your-db-admin-user"
SQL_ADMIN_PASSWORD="your-db-admin-password"

# Initial Admin Credentials (Optional for automatic bootstrap)
INITIAL_ADMIN_EMAIL="dharuvattri@gmail.com"
INITIAL_ADMIN_PASSWORD="replace-with-a-unique-strong-password"
ADMIN_BOOTSTRAP_TOKEN="replace-with-a-unique-random-token"
```

### 3. Database Schema Setup
Push schema using Drizzle:
```bash
npx drizzle-kit push
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Run Security Verification Suite
```bash
npx tsx scripts/run-security-checks.ts
```

---

## 🔑 Administrator Setup
- **Portal URL**: `/admin`
- Set a unique `INITIAL_ADMIN_PASSWORD` in `.env` before starting the server, or initialize the account using a unique `ADMIN_BOOTSTRAP_TOKEN`.
- No default administrator password or bootstrap token is provided.

To reset or rotate the administrator password via CLI:
```bash
npm run reset-password "YourNewStrongPassword2026!"
```
Or use the **Account Security** tab directly inside the authenticated dashboard at `/admin`.
