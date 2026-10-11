export interface SchoolSettings {
  school_name?: string;
  school_subtitle?: string;
  affiliation_details?: string;
  school_motto?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  principal_name?: string;
  principal_quote?: string;
  office_hours?: string;
  admissions_status?: string;
  hero_image_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  [key: string]: string | undefined;
}

export interface Notice {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  isImportant: boolean;
  isPublished: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  eventType: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  isPublished: boolean;
}

export interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface FeeStructure {
  id: number;
  gradeLevel: string;
  tuitionFeeMonthly: number;
  admissionFeeOnetime: number;
  annualCharges: number;
  notes?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface Facility {
  id: number;
  title: string;
  category: string;
  description: string;
  features?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  recipient?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string | null;
  date?: string | null;
  isPublished: boolean;
}

export interface TransportRoute {
  id: number;
  routeNumber: string;
  routeName: string;
  coverageAreas: string;
  morningTime: string;
  eveningTime: string;
  vehicleType: string;
  driverIncharge?: string | null;
  contactNumber?: string | null;
  isPublished: boolean;
}

export interface AdmissionEnquiry {
  id: number;
  studentName: string;
  parentName: string;
  phone: string;
  email?: string | null;
  classSeeking: string;
  currentSchool?: string | null;
  address: string;
  message?: string | null;
  status: 'new' | 'contacted' | 'admitted' | 'archived';
  notes?: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  createdAt: string;
}

export interface PublicSchoolData {
  settings: SchoolSettings;
  notices: Notice[];
  calendar: CalendarEvent[];
  faculty: FacultyMember[];
  feeStructures: FeeStructure[];
  facilities: Facility[];
  achievements: Achievement[];
  gallery: GalleryItem[];
  transportRoutes: TransportRoute[];
}
