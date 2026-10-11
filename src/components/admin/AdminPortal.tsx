import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  Bell,
  Calendar,
  Users,
  CreditCard,
  Building,
  Images,
  Bus,
  Upload,
  ShieldAlert,
  KeyRound,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import {
  AdmissionEnquiry,
  Notice,
  CalendarEvent,
  FacultyMember,
  FeeStructure,
  Facility,
  GalleryItem,
  TransportRoute,
  AuditLog,
  SchoolSettings,
} from '../../types.ts';

interface AdminPortalProps {
  adminUser: { id: number; email: string; fullName: string; role: string };
  onLogout: () => void;
  onViewWebsite: () => void;
}

type TabType =
  | 'overview'
  | 'enquiries'
  | 'settings'
  | 'notices'
  | 'calendar'
  | 'faculty'
  | 'fees'
  | 'facilities'
  | 'gallery'
  | 'transport'
  | 'uploads'
  | 'audit'
  | 'security';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminUser,
  onLogout,
  onViewWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>({});
  const [noticesList, setNoticesList] = useState<Notice[]>([]);
  const [calendarList, setCalendarList] = useState<CalendarEvent[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [feesList, setFeesList] = useState<FeeStructure[]>([]);
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [routesList, setRoutesList] = useState<TransportRoute[]>([]);
  const [auditList, setAuditList] = useState<AuditLog[]>([]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, enqRes, pubRes, auditRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/enquiries'),
        fetch('/api/public/data'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (pubRes.ok) {
        const pub = await pubRes.json();
        setSettings(pub.settings || {});
        setNoticesList(pub.notices || []);
        setCalendarList(pub.calendar || []);
        setFacultyList(pub.faculty || []);
        setFeesList(pub.feeStructures || []);
        setFacilitiesList(pub.facilities || []);
        setGalleryList(pub.gallery || []);
        setRoutesList(pub.transportRoutes || []);
      }
      if (auditRes.ok) setAuditList(await auditRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showMessage('error', 'Could not refresh dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEnquiryStatus = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        showMessage('success', 'Enquiry status updated.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to update enquiry status.');
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Enquiry removed.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete enquiry.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showMessage('success', 'School settings successfully saved and published.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to update settings.');
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      category: formData.get('category'),
      date: formData.get('date'),
      content: formData.get('content'),
      isImportant: formData.get('isImportant') === 'on',
    };

    try {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage('success', 'New circular posted successfully.');
        form.reset();
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to post circular.');
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Delete this notice?')) return;
    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Notice deleted.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete notice.');
    }
  };

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      eventType: formData.get('eventType'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || null,
      description: formData.get('description'),
    };

    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage('success', 'Calendar item added.');
        form.reset();
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to add calendar item.');
    }
  };

  const handleDeleteCalendar = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/calendar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Event deleted.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete event.');
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      designation: formData.get('designation'),
      department: formData.get('department'),
      qualification: formData.get('qualification'),
      experience: formData.get('experience'),
      sortOrder: Number(formData.get('sortOrder')) || 0,
    };

    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage('success', 'Faculty profile added.');
        form.reset();
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to add faculty profile.');
    }
  };

  const handleDeleteFaculty = async (id: number) => {
    if (!confirm('Remove this faculty member?')) return;
    try {
      const res = await fetch(`/api/admin/faculty/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Faculty profile removed.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete faculty member.');
    }
  };

  const handleUpdateFee = async (id: number, tuition: number, admission: number, annual: number, notes: string) => {
    try {
      const res = await fetch(`/api/admin/fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tuitionFeeMonthly: tuition,
          admissionFeeOnetime: admission,
          annualCharges: annual,
          notes,
        }),
      });
      if (res.ok) {
        showMessage('success', 'Fee structure updated.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to update fee record.');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      title: formData.get('title'),
      category: formData.get('category'),
      imageUrl: formData.get('imageUrl'),
      caption: formData.get('caption'),
      date: formData.get('date'),
    };

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage('success', 'Photo published to gallery.');
        form.reset();
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to add gallery photo.');
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Photo removed.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to remove photo.');
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      routeNumber: formData.get('routeNumber'),
      routeName: formData.get('routeName'),
      coverageAreas: formData.get('coverageAreas'),
      morningTime: formData.get('morningTime'),
      eveningTime: formData.get('eveningTime'),
      vehicleType: formData.get('vehicleType'),
      driverIncharge: formData.get('driverIncharge'),
      contactNumber: formData.get('contactNumber'),
    };

    try {
      const res = await fetch('/api/admin/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage('success', 'Transport route saved.');
        form.reset();
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to save route.');
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (!confirm('Delete this transport route?')) return;
    try {
      const res = await fetch(`/api/admin/transport/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('success', 'Route removed.');
        loadAllData();
      }
    } catch (err) {
      showMessage('error', 'Failed to delete route.');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataBase64: base64,
            originalName: uploadFile.name,
            mimeType: uploadFile.type,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setUploadedUrl(data.url);
          showMessage('success', 'Image uploaded successfully!');
          loadAllData();
        } else {
          showMessage('error', data.error || 'Upload rejected.');
        }
      };
      reader.readAsDataURL(uploadFile);
    } catch (err) {
      showMessage('error', 'Error reading upload file.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      showMessage('error', 'New password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showMessage('error', data.error || 'Failed to change password.');
      }
    } catch (err) {
      showMessage('error', 'Password update error.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-700 text-amber-300 flex items-center justify-center font-bold text-sm">
            MP
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Modern Public Sr. Sec. School</div>
            <div className="text-[11px] text-slate-400">Admin Control Center · Swarghat (HP)</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{adminUser.fullName}</span>
            <span className="text-slate-500">({adminUser.email})</span>
          </div>

          <button
            onClick={onViewWebsite}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live School Site</span>
          </button>

          <a
            href="/modern-public-school-swarghat.zip"
            download="modern-public-school-swarghat.zip"
            className="px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download full project source code archive as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Project ZIP</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-950 text-slate-300 p-4 space-y-1 overflow-y-auto shrink-0 border-r border-slate-800">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            School Management
          </div>

          {[
            { id: 'overview' as const, label: 'Overview & Metrics', icon: LayoutDashboard },
            { id: 'enquiries' as const, label: `Admissions Enquiries (${enquiries.length})`, icon: Inbox },
            { id: 'settings' as const, label: 'School Settings & Info', icon: Settings },
            { id: 'notices' as const, label: 'Notices & Circulars', icon: Bell },
            { id: 'calendar' as const, label: 'Academic Calendar', icon: Calendar },
            { id: 'faculty' as const, label: 'Faculty & Staff', icon: Users },
            { id: 'fees' as const, label: 'Fee Structures', icon: CreditCard },
            { id: 'facilities' as const, label: 'Campus Facilities', icon: Building },
            { id: 'gallery' as const, label: 'Photo Gallery', icon: Images },
            { id: 'transport' as const, label: 'Transport Routes', icon: Bus },
            { id: 'uploads' as const, label: 'Upload Images & Media', icon: Upload },
            { id: 'audit' as const, label: 'Security Audit Logs', icon: ShieldAlert },
            { id: 'security' as const, label: 'Account Security', icon: KeyRound },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-indigo-900 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-6">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-xs font-semibold underline">
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-xs text-slate-500">Live operational data from PostgreSQL database</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">New Enquiries</div>
                  <div className="text-2xl font-bold text-indigo-950 tabular-nums">
                    {enquiries.filter((e) => e.status === 'new').length}
                  </div>
                  <div className="text-[11px] text-slate-400">Total: {enquiries.length} received</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Active Notices</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{noticesList.length}</div>
                  <div className="text-[11px] text-slate-400">Published on site</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Teaching Faculty</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{facultyList.length}</div>
                  <div className="text-[11px] text-slate-400">Recorded educators</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Transport Fleet</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{routesList.length}</div>
                  <div className="text-[11px] text-slate-400">Active bus corridors</div>
                </div>
              </div>

              {/* Recent Admissions Enquiries Strip */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Admission Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-indigo-900 hover:underline font-semibold"
                  >
                    View All Inquiries →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 pb-2">
                        <th className="py-2">Student Name</th>
                        <th className="py-2">Class Seeking</th>
                        <th className="py-2">Phone</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-semibold text-slate-900">{enq.studentName}</td>
                          <td className="py-2.5 text-slate-600">{enq.classSeeking}</td>
                          <td className="py-2.5 text-slate-600 font-mono">{enq.phone}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              enq.status === 'new' ? 'bg-amber-100 text-amber-900' :
                              enq.status === 'contacted' ? 'bg-indigo-100 text-indigo-900' :
                              enq.status === 'admitted' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400">{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSION ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Admission Enquiries (Private)</h2>
                  <p className="text-xs text-slate-500">
                    Confidential submissions from students and parents. Only authorized administrators can view this list.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-100">
                  {enquiries.length} Records Total
                </span>
              </div>

              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {enq.studentName}
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            (Parent: {enq.parentName})
                          </span>
                        </h3>
                        <div className="text-xs text-indigo-950 font-medium">
                          Applying for: {enq.classSeeking}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                          className="text-xs px-2.5 py-1 rounded border border-slate-300 bg-white font-medium"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="admitted">Admitted</option>
                          <option value="archived">Archived</option>
                        </select>

                        <button
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Phone Contact:</span>
                        <strong className="text-slate-900 font-mono">{enq.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Email Address:</span>
                        <span>{enq.email || 'None provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Previous School:</span>
                        <span>{enq.currentSchool || 'None specified'}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-900">Address:</strong> {enq.address}
                      {enq.message && (
                        <div className="mt-1">
                          <strong className="text-slate-900">Message / Questions:</strong> {enq.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {enquiries.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                    No admission inquiries submitted yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SCHOOL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">School Information & Setup</h2>
                <p className="text-xs text-slate-500">
                  Update school identity, principal's message, affiliation details, and contact coordinates. All modifications reflect immediately on the public website.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School Official Name
                    </label>
                    <input
                      type="text"
                      value={settings.school_name || ''}
                      onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sub-title / Region
                    </label>
                    <input
                      type="text"
                      value={settings.school_subtitle || ''}
                      onChange={(e) => setSettings({ ...settings, school_subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Affiliation Details & Registration (Setup Placeholder)
                  </label>
                  <input
                    type="text"
                    value={settings.affiliation_details || ''}
                    onChange={(e) => setSettings({ ...settings, affiliation_details: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                  />
                  <span className="text-[11px] text-slate-400">
                    Explicitly editable placeholder for official affiliation number once verified by school management.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School Motto
                  </label>
                  <input
                    type="text"
                    value={settings.school_motto || ''}
                    onChange={(e) => setSettings({ ...settings, school_motto: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Principal Name
                    </label>
                    <input
                      type="text"
                      value={settings.principal_name || ''}
                      onChange={(e) => setSettings({ ...settings, principal_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Office Timings
                    </label>
                    <input
                      type="text"
                      value={settings.office_hours || ''}
                      onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Principal's Desk Message / Quote
                  </label>
                  <textarea
                    rows={4}
                    value={settings.principal_quote || ''}
                    onChange={(e) => setSettings({ ...settings, principal_quote: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Telephones
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Homepage Hero Background Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.hero_image_url || ''}
                    onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-900 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Save & Publish School Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Notices & Circulars</h2>
                  <p className="text-xs text-slate-500">Publish school circulars, examination alerts, and PTM reminders</p>
                </div>
              </div>

              {/* Add Notice Form */}
              <form onSubmit={handleAddNotice} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Post New Circular</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
                    <input
                      name="title"
                      required
                      placeholder="e.g. Schedule for Board Practical Examinations"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select name="category" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white">
                      <option value="Academic">Academic</option>
                      <option value="Admission">Admission</option>
                      <option value="Examination">Examination</option>
                      <option value="Holiday">Holiday</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Date</label>
                    <input
                      name="date"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="isImportant" name="isImportant" className="w-4 h-4 text-indigo-900" />
                    <label htmlFor="isImportant" className="text-xs font-semibold text-slate-700">
                      Mark as Urgent / Priority Banner
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Content</label>
                  <textarea
                    name="content"
                    required
                    rows={3}
                    placeholder="Provide full description of the notice..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Publish Notice
                </button>
              </form>

              {/* List */}
              <div className="space-y-3">
                {noticesList.map((notice) => (
                  <div key={notice.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-indigo-900">{notice.category}</span>
                        <span>·</span>
                        <span>{notice.date}</span>
                        {notice.isImportant && (
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            Priority
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Academic Calendar & Events</h2>

              <form onSubmit={handleAddCalendarEvent} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Add Academic Event / Holiday</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
                    <input name="title" required placeholder="e.g. Mid-Term Assessments" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
                    <select name="eventType" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white">
                      <option value="Holiday">Holiday</option>
                      <option value="Exam">Exam</option>
                      <option value="PTM">PTM</option>
                      <option value="Sports">Sports</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                    <input name="startDate" type="date" required className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Date (Optional)</label>
                    <input name="endDate" type="date" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input name="description" placeholder="Brief event details..." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                </div>

                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-semibold">
                  Add Event
                </button>
              </form>

              <div className="space-y-2">
                {calendarList.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-mono">
                        {item.startDate} {item.endDate ? `to ${item.endDate}` : ''} · <span className="font-semibold text-slate-700">{item.eventType}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      {item.description && <div className="text-xs text-slate-600">{item.description}</div>}
                    </div>
                    <button onClick={() => handleDeleteCalendar(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FACULTY */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Faculty & Educators</h2>

              <form onSubmit={handleAddFaculty} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Add Faculty Member</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher Full Name</label>
                    <input name="name" required placeholder="e.g. Mrs. Anjali Sharma" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                    <input name="designation" required placeholder="e.g. PGT Physics" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <input name="department" required placeholder="e.g. Science" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                    <input name="qualification" required placeholder="e.g. M.Sc., B.Ed." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Experience</label>
                    <input name="experience" placeholder="e.g. 8 Years" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-semibold">
                  Add Faculty
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facultyList.map((f) => (
                  <div key={f.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{f.name}</h4>
                      <div className="text-xs text-indigo-900 font-medium">{f.designation} ({f.department})</div>
                      <div className="text-[11px] text-slate-500">{f.qualification} · {f.experience}</div>
                    </div>
                    <button onClick={() => handleDeleteFaculty(f.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FEE STRUCTURE */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Fee Schedules Management</h2>
              <p className="text-xs text-slate-500">Edit tuition, admission, and development charges per class wing</p>

              <div className="space-y-4">
                {feesList.map((fee) => (
                  <div key={fee.id} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
                    <h3 className="text-base font-bold text-slate-900">{fee.gradeLevel}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Monthly Tuition (₹)</label>
                        <input
                          type="number"
                          defaultValue={fee.tuitionFeeMonthly}
                          id={`t_${fee.id}`}
                          className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Admission Fee (₹)</label>
                        <input
                          type="number"
                          defaultValue={fee.admissionFeeOnetime}
                          id={`a_${fee.id}`}
                          className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Annual Charges (₹)</label>
                        <input
                          type="number"
                          defaultValue={fee.annualCharges}
                          id={`an_${fee.id}`}
                          className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Inclusions / Notes</label>
                      <input
                        type="text"
                        defaultValue={fee.notes || ''}
                        id={`n_${fee.id}`}
                        className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const t = Number((document.getElementById(`t_${fee.id}`) as HTMLInputElement).value);
                        const a = Number((document.getElementById(`a_${fee.id}`) as HTMLInputElement).value);
                        const an = Number((document.getElementById(`an_${fee.id}`) as HTMLInputElement).value);
                        const n = (document.getElementById(`n_${fee.id}`) as HTMLInputElement).value;
                        handleUpdateFee(fee.id, t, a, an, n);
                      }}
                      className="px-4 py-1.5 bg-indigo-900 text-white rounded text-xs font-semibold"
                    >
                      Update Fee for {fee.gradeLevel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Photo Gallery Management</h2>

              <form onSubmit={handleAddGallery} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Add Photo to Campus Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Title</label>
                    <input name="title" required placeholder="e.g. Science Exhibition Prototype" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select name="category" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white">
                      <option value="Campus">Campus</option>
                      <option value="Labs">Labs</option>
                      <option value="Sports">Sports</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                  <input name="imageUrl" required placeholder="/uploads/..." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Caption / Description</label>
                    <input name="caption" placeholder="Short description..." className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                    <input name="date" placeholder="October 2026" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-semibold">
                  Save Photo
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {galleryList.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="aspect-4/3 bg-slate-100">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="truncate text-xs font-bold text-slate-900">{item.title}</div>
                      <button onClick={() => handleDeleteGallery(item.id)} className="p-1 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: TRANSPORT */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Transport Fleet & Routes</h2>

              <form onSubmit={handleAddRoute} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Add New Bus Route</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Route Identifier</label>
                    <input name="routeNumber" required placeholder="Route 04" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Route Name</label>
                    <input name="routeName" required placeholder="Swarghat - Bilaspur Sadar" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Coverage Areas & Stops</label>
                  <input name="coverageAreas" required placeholder="Swarghat, Jamli, Brahmpukhar, Sadar" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Morning Pickup</label>
                    <input name="morningTime" required placeholder="7:30 AM" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Evening Return</label>
                    <input name="eveningTime" required placeholder="3:30 PM" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
                    <input name="vehicleType" required placeholder="32-Seater Starbus" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Incharge</label>
                    <input name="driverIncharge" placeholder="Sh. Mohan Singh" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300" />
                  </div>
                </div>

                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-semibold">
                  Add Route
                </button>
              </form>

              <div className="space-y-3">
                {routesList.map((route) => (
                  <div key={route.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-indigo-900">{route.routeNumber}: {route.routeName}</div>
                      <div className="text-xs text-slate-600">{route.coverageAreas}</div>
                      <div className="text-[11px] text-slate-500">
                        {route.morningTime} / {route.eveningTime} · {route.vehicleType}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteRoute(route.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: UPLOADS */}
          {activeTab === 'uploads' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Secure Media & Photo Uploads</h2>
                <p className="text-xs text-slate-500">
                  Upload high-resolution logos, facility photos, and circulars directly to persistent server storage with automatic magic-byte verification.
                </p>
              </div>

              <form onSubmit={handleFileUpload} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Image File (JPEG, PNG, WebP, SVG - Max 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-900 hover:file:bg-indigo-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold"
                >
                  Upload to Cloud Storage
                </button>
              </form>

              {uploadedUrl && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-emerald-700">Upload Ready! Copy this URL into settings or gallery:</div>
                  <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 select-all break-all">
                    {uploadedUrl}
                  </div>
                  <div className="aspect-16/9 max-w-sm rounded-lg overflow-hidden border border-slate-200">
                    <img src={uploadedUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Immutable record of administrative actions, logins, updates, and permission checks.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Admin Email</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{log.adminEmail}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-semibold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{log.entityType}</td>
                        <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">{log.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: ACCOUNT SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account Security & Credentials</h2>
                <p className="text-xs text-slate-500">Update your administrator password with cryptographic salt derivation</p>
              </div>

              <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (Min 8 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-indigo-900 text-white rounded-lg text-xs font-semibold shadow-xs">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
