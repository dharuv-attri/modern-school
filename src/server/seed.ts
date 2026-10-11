import { db } from '../db/index.ts';
import {
  schoolSettings,
  notices,
  calendarEvents,
  faculty,
  feeStructures,
  facilities,
  achievements,
  gallery,
  transportRoutes,
} from '../db/schema.ts';

export async function seedInitialSchoolData() {
  try {
    // 1. Settings
    const existingSettings = await db.select().from(schoolSettings);
    if (existingSettings.length === 0) {
      await db.insert(schoolSettings).values([
        { key: 'school_name', value: 'Modern Public Sr. Sec. School' },
        { key: 'school_subtitle', value: 'Swarghat, District Bilaspur, Himachal Pradesh' },
        { key: 'affiliation_details', value: 'Recognized by H.P. Directorate of Education & Affiliated to HPBOSE / Senior Secondary Board (Setup Placeholder: Registration details editable in admin)' },
        { key: 'school_motto', value: 'Knowledge, Character, Excellence' },
        { key: 'address', value: 'NH-205 (Chandigarh-Manali Highway), Swarghat, Tehsil Sri Naina Devi Ji, District Bilaspur, Himachal Pradesh - 174011' },
        { key: 'contact_phone', value: '+91 1978-284120, +91 98160-54321' },
        { key: 'contact_email', value: 'info@modernschoolswarghat.in' },
        { key: 'principal_name', value: 'Dr. R. K. Sharma (Principal)' },
        { key: 'principal_quote', value: 'Education at Modern Public Sr. Sec. School Swarghat is an inspiring voyage where mountain values of grit, humility, and determination blend seamlessly with modern scientific inquiry. We nurture every child to excel academically and stand tall as compassionate citizens.' },
        { key: 'office_hours', value: 'Monday - Saturday: 8:30 AM to 3:30 PM (Office closes on 2nd Saturdays and Gazetted Holidays)' },
        { key: 'admissions_status', value: 'Open for Session 2026-27 (Nursery to Class XII)' },
        { key: 'hero_image_url', value: '/src/assets/images/hero_school_campus_1791729865203.jpg' },
        { key: 'facebook_url', value: 'https://facebook.com/modernschoolswarghat' },
        { key: 'youtube_url', value: 'https://youtube.com/@modernschoolswarghat' },
        { key: 'instagram_url', value: 'https://instagram.com/modernschoolswarghat' },
      ]);
    }

    // 2. Facilities
    const existingFacilities = await db.select().from(facilities);
    if (existingFacilities.length === 0) {
      await db.insert(facilities).values([
        {
          title: 'Composite Science Laboratories',
          category: 'Laboratories',
          description: 'Fully equipped Physics, Chemistry, and Biology laboratories adhering strictly to senior secondary curriculum safety standards with advanced optical instruments, chemical reagents, and botanical specimens.',
          features: 'Digital Balances, High-Resolution Compound Microscopes, Fume Hoods, Individual Student Workstations',
          imageUrl: '/src/assets/images/facility_science_lab_1791729877090.jpg',
          sortOrder: 1,
          isPublished: true,
        },
        {
          title: 'Central Knowledge Library',
          category: 'Library',
          description: 'A serene reading sanctuary featuring over 8,500 curriculum books, competitive exam guides (JEE, NEET, NDA), Hindi & English literary classics, and leading educational periodicals.',
          features: 'Quiet Study Bays, Reference Section, Reading Desks with Natural Mountain Daylight, Automated Cataloging',
          imageUrl: '/src/assets/images/facility_library_1791729891335.jpg',
          sortOrder: 2,
          isPublished: true,
        },
        {
          title: 'Outdoor Sports & Athletic Arena',
          category: 'Sports',
          description: 'Surrounded by pine-clad hills, our sports arena includes basketball and volleyball courts, 200m track, badminton courts, and dedicated facilities for traditional sports including Kho-Kho and Kabaddi.',
          features: 'All-Weather Basketball Court, Football Ground, Kho-Kho Arena, Annual Sports Conditioning',
          imageUrl: '/src/assets/images/facility_sports_ground_1791729905277.jpg',
          sortOrder: 3,
          isPublished: true,
        },
        {
          title: 'Modern Computer & Digital Literacy Lab',
          category: 'Technology',
          description: 'High-speed networked computer laboratory providing individual computing access for Python programming, web literacy, AI fundamentals, and multimedia projects.',
          features: 'Core i5 Workstations, Gigabit LAN, UPS Power Backup, Teacher Interactive Console',
          imageUrl: '/src/assets/images/facility_science_lab_1791729877090.jpg',
          sortOrder: 4,
          isPublished: true,
        },
        {
          title: 'Safe Fleet of Mountain Transport Buses',
          category: 'Transport',
          description: 'Well-maintained yellow school buses and GPS-tracked vans driven by experienced hill-terrain drivers covering Swarghat, Naina Devi, Jamli, and peripheral foothill hamlets.',
          features: 'Speed Governors, First-Aid Kits, Experienced Mountain Chauffeurs, Female Bus Conductors',
          imageUrl: '/src/assets/images/hero_school_campus_1791729865203.jpg',
          sortOrder: 5,
          isPublished: true,
        },
      ]);
    }

    // 3. Fee Structures
    const existingFees = await db.select().from(feeStructures);
    if (existingFees.length === 0) {
      await db.insert(feeStructures).values([
        {
          gradeLevel: 'Pre-Primary (Nursery, LKG, UKG)',
          tuitionFeeMonthly: 1400,
          admissionFeeOnetime: 3500,
          annualCharges: 2500,
          notes: 'Includes activity workbooks, montessori apparatus access, and smart audiovisual sessions.',
          sortOrder: 1,
          isPublished: true,
        },
        {
          gradeLevel: 'Primary (Class I to V)',
          tuitionFeeMonthly: 1750,
          admissionFeeOnetime: 4000,
          annualCharges: 3000,
          notes: 'Includes environmental science activities, library privileges, and physical education coaching.',
          sortOrder: 2,
          isPublished: true,
        },
        {
          gradeLevel: 'Middle School (Class VI to VIII)',
          tuitionFeeMonthly: 2100,
          admissionFeeOnetime: 4500,
          annualCharges: 3500,
          notes: 'Includes science laboratory orientation, computer practicals, and co-curricular club memberships.',
          sortOrder: 3,
          isPublished: true,
        },
        {
          gradeLevel: 'Secondary (Class IX & X)',
          tuitionFeeMonthly: 2600,
          admissionFeeOnetime: 5000,
          annualCharges: 4000,
          notes: 'Includes board practical preparations, monthly diagnostic tests, and career counseling sessions.',
          sortOrder: 4,
          isPublished: true,
        },
        {
          gradeLevel: 'Sr. Secondary - Science (XI & XII)',
          tuitionFeeMonthly: 3400,
          admissionFeeOnetime: 6500,
          annualCharges: 5000,
          notes: 'Includes Physics, Chemistry, Biology/Math lab chemicals, apparatus, and JEE/NEET baseline guidance.',
          sortOrder: 5,
          isPublished: true,
        },
        {
          gradeLevel: 'Sr. Secondary - Commerce & Arts (XI & XII)',
          tuitionFeeMonthly: 3000,
          admissionFeeOnetime: 6000,
          annualCharges: 4500,
          notes: 'Includes Accountancy & Economics practical modules, project evaluation, and library reference journals.',
          sortOrder: 6,
          isPublished: true,
        },
      ]);
    }

    // 4. Faculty & Leadership
    const existingFaculty = await db.select().from(faculty);
    if (existingFaculty.length === 0) {
      await db.insert(faculty).values([
        {
          name: 'Dr. R. K. Sharma',
          designation: 'Principal',
          department: 'Administration & Sciences',
          qualification: 'M.Sc. (Physics), M.Ed., Ph.D.',
          experience: '24 Years of Academic Leadership',
          imageUrl: '',
          sortOrder: 1,
          isPublished: true,
        },
        {
          name: 'Mrs. Sunita Verma',
          designation: 'Vice-Principal & Senior Coordinator',
          department: 'Humanities & Languages',
          qualification: 'M.A. (English), B.Ed., NET Qualified',
          experience: '18 Years of Teaching',
          imageUrl: '',
          sortOrder: 2,
          isPublished: true,
        },
        {
          name: 'Mr. Manoj Thakur',
          designation: 'Post Graduate Teacher (PGT)',
          department: 'Physics',
          qualification: 'M.Sc. (Physics), B.Ed.',
          experience: '12 Years',
          imageUrl: '',
          sortOrder: 3,
          isPublished: true,
        },
        {
          name: 'Dr. Meenakshi Chauhan',
          designation: 'Post Graduate Teacher (PGT)',
          department: 'Chemistry',
          qualification: 'M.Sc. (Organic Chemistry), Ph.D., B.Ed.',
          experience: '10 Years',
          imageUrl: '',
          sortOrder: 4,
          isPublished: true,
        },
        {
          name: 'Mr. Suresh Kumar',
          designation: 'Post Graduate Teacher (PGT)',
          department: 'Mathematics',
          qualification: 'M.Sc. (Mathematics), B.Ed.',
          experience: '14 Years',
          imageUrl: '',
          sortOrder: 5,
          isPublished: true,
        },
        {
          name: 'Mrs. Pooja Sharma',
          designation: 'Post Graduate Teacher (PGT)',
          department: 'Biology',
          qualification: 'M.Sc. (Botany), B.Ed.',
          experience: '9 Years',
          imageUrl: '',
          sortOrder: 6,
          isPublished: true,
        },
        {
          name: 'Mr. Anil Chandel',
          designation: 'Post Graduate Teacher (PGT)',
          department: 'Commerce & Accountancy',
          qualification: 'M.Com, M.Phil, B.Ed.',
          experience: '11 Years',
          imageUrl: '',
          sortOrder: 7,
          isPublished: true,
        },
        {
          name: 'Mr. Rajesh Patial',
          designation: 'Director of Physical Education (PET)',
          department: 'Sports & Physical Health',
          qualification: 'M.P.Ed., NIS Certified Coach',
          experience: '15 Years',
          imageUrl: '',
          sortOrder: 8,
          isPublished: true,
        },
      ]);
    }

    // 5. Notices
    const existingNotices = await db.select().from(notices);
    if (existingNotices.length === 0) {
      await db.insert(notices).values([
        {
          title: 'Admissions Open for Academic Session 2026-27 (Nursery to Class XI)',
          category: 'Admission',
          content: 'Registration forms for admission into Nursery, Primary, Middle, Secondary, and Senior Secondary (Science, Commerce, Arts) are now available in the school office and online. Limited seats in Science stream.',
          date: '2026-10-01',
          isImportant: true,
          isPublished: true,
        },
        {
          title: 'Second Term Unit Assessment Datesheet Announced',
          category: 'Examination',
          content: 'The date-sheet for the 2nd Term Unit Assessments for Classes I to XII has been finalized. Assessments commence from Monday, 19th October. All students must report in full uniform by 8:40 AM.',
          date: '2026-10-05',
          isImportant: true,
          isPublished: true,
        },
        {
          title: 'Annual Parent-Teacher Association (PTA) General House Meeting',
          category: 'Academic',
          content: 'The PTA General Body meeting is scheduled for Saturday at 10:00 AM in the school auditorium to review academic progress, student discipline, and sports preparations. Parents are cordially invited.',
          date: '2026-10-08',
          isImportant: false,
          isPublished: true,
        },
        {
          title: 'Advisory: Transition to Winter School Uniform & Bus Timing Update',
          category: 'General',
          content: 'With the arrival of autumn chill in Swarghat hills, students may commence wearing school navy-blue blazers and sweaters from 1st November. Bus routes will continue on current standard morning timing.',
          date: '2026-10-10',
          isImportant: false,
          isPublished: true,
        },
      ]);
    }

    // 6. Calendar Events
    const existingEvents = await db.select().from(calendarEvents);
    if (existingEvents.length === 0) {
      await db.insert(calendarEvents).values([
        {
          title: 'Term-1 Result Declaration & PTM',
          eventType: 'PTM',
          startDate: '2026-10-17',
          endDate: '2026-10-17',
          description: 'Comprehensive report cards distribution and one-on-one parent discussions with subject teachers.',
          isPublished: true,
        },
        {
          title: 'Diwali & Autumn Festival Break',
          eventType: 'Holiday',
          startDate: '2026-11-01',
          endDate: '2026-11-05',
          description: 'School campus closed for Diwali and Bhai Dooj holidays. Office opens on 6th November.',
          isPublished: true,
        },
        {
          title: 'Annual Inter-House Athletic & Sports Meet',
          eventType: 'Sports',
          startDate: '2026-11-18',
          endDate: '2026-11-20',
          description: 'Track and field competitions, relay races, Kho-Kho, basketball, and march-past display.',
          isPublished: true,
        },
        {
          title: 'District Science & Robotics Exhibition',
          eventType: 'Event',
          startDate: '2026-12-04',
          endDate: '2026-12-05',
          description: 'Display of working science models, renewable energy prototypes, and digital software projects by Senior School students.',
          isPublished: true,
        },
        {
          title: 'Senior Secondary Pre-Board Examinations (X & XII)',
          eventType: 'Exam',
          startDate: '2026-12-15',
          endDate: '2026-12-28',
          description: 'Strict board-pattern preparatory examinations for board examinees.',
          isPublished: true,
        },
      ]);
    }

    // 7. Achievements
    const existingAchievements = await db.select().from(achievements);
    if (existingAchievements.length === 0) {
      await db.insert(achievements).values([
        {
          title: '100% Pass Percentage in Senior Secondary Board Exams',
          category: 'Board Exams',
          year: '2025-26',
          description: 'All 84 students of Class XII passed with flying colors; 32 students secured above 90% distinction marks in Science and Commerce streams.',
          recipient: 'Class XII Batch 2025-26',
          imageUrl: '/src/assets/images/hero_school_campus_1791729865203.jpg',
          isPublished: true,
        },
        {
          title: 'Gold Medal at District Bilaspur Inter-School Athletics',
          category: 'Sports',
          year: '2025',
          description: 'School athletic squad won 1st position in 4x100m relay and Under-17 Boys 800m sprint at District Stadium Bilaspur.',
          recipient: 'School Athletics Contingent',
          imageUrl: '/src/assets/images/facility_sports_ground_1791729905277.jpg',
          isPublished: true,
        },
        {
          title: 'State Science Fair Eco-Innovation Award',
          category: 'Olympiad & Innovation',
          year: '2025',
          description: 'Awarded 2nd Prize across Himachal Pradesh for a low-cost rainwater harvesting and pine-needle bio-brick filtration model.',
          recipient: 'Senior Science Club (Class XI)',
          imageUrl: '/src/assets/images/facility_science_lab_1791729877090.jpg',
          isPublished: true,
        },
      ]);
    }

    // 8. Transport Routes
    const existingRoutes = await db.select().from(transportRoutes);
    if (existingRoutes.length === 0) {
      await db.insert(transportRoutes).values([
        {
          routeNumber: 'Route 01',
          routeName: 'Swarghat - Naina Devi Ji Hill Corridor',
          coverageAreas: 'Swarghat Chowk, Kainchi Mor, Toba, Ghamroor, Sri Naina Devi Ji Temple Approach',
          morningTime: '7:40 AM - 8:30 AM',
          eveningTime: '3:30 PM - 4:25 PM',
          vehicleType: '32-Seater Tata Starbus (HP-24-XXXX)',
          driverIncharge: 'Sh. Baldev Singh',
          contactNumber: '+91 94180-11223',
          isPublished: true,
        },
        {
          routeNumber: 'Route 02',
          routeName: 'Swarghat - Bilaspur National Highway',
          coverageAreas: 'Swarghat, Jamli, Phattepur, Barmana Link, Gagal Turn',
          morningTime: '7:30 AM - 8:30 AM',
          eveningTime: '3:30 PM - 4:40 PM',
          vehicleType: '40-Seater SML Isuzu (HP-24-YYYY)',
          driverIncharge: 'Sh. Ram Lal',
          contactNumber: '+91 94181-44556',
          isPublished: true,
        },
        {
          routeNumber: 'Route 03',
          routeName: 'Swarghat - Anandpur Sahib Border Link',
          coverageAreas: 'Swarghat, Bhakra Turn, Kiratpur Border Point, Anandpur Road Hamlets',
          morningTime: '7:45 AM - 8:35 AM',
          eveningTime: '3:30 PM - 4:20 PM',
          vehicleType: '28-Seater Force Traveller (HP-24-ZZZZ)',
          driverIncharge: 'Sh. Gurmeet Singh',
          contactNumber: '+91 98165-77889',
          isPublished: true,
        },
      ]);
    }

    // 9. Gallery
    const existingGallery = await db.select().from(gallery);
    if (existingGallery.length === 0) {
      await db.insert(gallery).values([
        {
          title: 'Campus Panorama in Morning Mist',
          category: 'Campus',
          imageUrl: '/src/assets/images/hero_school_campus_1791729865203.jpg',
          caption: 'The majestic main academic quadrangle surrounded by the Shivalik pine forests of Swarghat.',
          date: 'October 2026',
          isPublished: true,
        },
        {
          title: 'Hands-on Chemistry Experimentation',
          category: 'Labs',
          imageUrl: '/src/assets/images/facility_science_lab_1791729877090.jpg',
          caption: 'Senior Secondary Science scholars performing titration and catalyst observation in the modern chemistry lab.',
          date: 'September 2026',
          isPublished: true,
        },
        {
          title: 'Afternoon Scholarly Research at Library',
          category: 'Campus',
          imageUrl: '/src/assets/images/facility_library_1791729891335.jpg',
          caption: 'Students engaged in silent reading and reference study in the central school library.',
          date: 'August 2026',
          isPublished: true,
        },
        {
          title: 'Inter-House Basketball Championship',
          category: 'Sports',
          imageUrl: '/src/assets/images/facility_sports_ground_1791729905277.jpg',
          caption: 'Energetic basketball semi-final match between Tagore House and Raman House on the outdoor court.',
          date: 'October 2026',
          isPublished: true,
        },
      ]);
    }

    console.log('Initial school data verified and seeded.');
  } catch (err) {
    console.error('Error seeding initial school data:', err);
  }
}
