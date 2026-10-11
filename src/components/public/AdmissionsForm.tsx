import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export const AdmissionsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    classSeeking: 'Class XI (Science)',
    currentSchool: '',
    address: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admissions/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessMessage(data.message || 'Admissions enquiry submitted successfully!');
      setFormData({
        studentName: '',
        parentName: '',
        phone: '',
        email: '',
        classSeeking: 'Class XI (Science)',
        currentSchool: '',
        address: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please contact the school office directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admissions" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Admissions Desk 2026-27
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Apply or Enquire for Student Admission
          </h2>
          <p className="text-base text-slate-600">
            Submit your student details below. Our admissions counselor will contact you with admission criteria, subject stream eligibility, and prospectus details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-900 text-white rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold">Admission Guidelines</h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Fill and submit the online registration enquiry form.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Admissions team reviews student record and coordinates campus visit / assessment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Document verification (Birth Certificate, Transfer Certificate, Marksheet).</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-indigo-800 text-xs text-indigo-200 space-y-1">
                <div>Direct Admissions Helpline: <strong>+91 1978-284120</strong></div>
                <div>Office Window: Mon-Sat, 9:00 AM – 2:00 PM</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3 text-xs text-slate-600">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Privacy Guaranteed:</strong> Student and guardian contact information is strictly private and accessible solely to authorized school administrators.
              </span>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {successMessage && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Submission Confirmed! </span>
                    {successMessage}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Father / Mother / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Sh. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98160-XXXXX"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Class Seeking Admission <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.classSeeking}
                    onChange={(e) => setFormData({ ...formData, classSeeking: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 bg-white"
                  >
                    <option value="Nursery / Kindergarten">Nursery / Kindergarten</option>
                    <option value="Primary (Classes I - V)">Primary (Classes I - V)</option>
                    <option value="Middle (Classes VI - VIII)">Middle (Classes VI - VIII)</option>
                    <option value="Secondary (Class IX - X)">Secondary (Class IX - X)</option>
                    <option value="Class XI (Science - Medical)">Class XI (Science - Medical)</option>
                    <option value="Class XI (Science - Non Medical)">Class XI (Science - Non Medical)</option>
                    <option value="Class XI (Commerce)">Class XI (Commerce)</option>
                    <option value="Class XI (Humanities / Arts)">Class XI (Humanities / Arts)</option>
                    <option value="Class XII (Transfer)">Class XII (Transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Previous School Attended (If Any)
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool}
                    onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    placeholder="e.g. GSSS Swarghat / Private School"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Residential Village / Town / Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Village Ghamroor, Post Swarghat, Distt. Bilaspur HP"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Any Specific Query or Transportation Requirement
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Need information on bus pickup route or hostel arrangements..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-xs sm:text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 disabled:bg-indigo-400 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Admissions Enquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
