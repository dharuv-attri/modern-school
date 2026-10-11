import React from 'react';
import { School, ShieldCheck } from 'lucide-react';
import { SchoolSettings } from '../../types.ts';

interface FooterProps {
  settings: SchoolSettings;
  onNavigateToAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateToAdmin, onNavigateSection }) => {
  const schoolName = settings.school_name || 'Modern Public Sr. Sec. School';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-900 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                <School className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {schoolName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering students from Swarghat, Bilaspur, and Naina Devi region with moral integrity, scientific inquiry, and board academic distinction.
            </p>
            <div className="text-xs text-slate-500">
              NH-205, Swarghat, Sub-Tehsil Sri Naina Devi Ji, District Bilaspur, H.P. - 174011
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Institutional Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors">
                  About Institution
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('academics')} className="hover:text-white transition-colors">
                  Academic Streams (XI & XII)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('facilities')} className="hover:text-white transition-colors">
                  Campus Facilities & Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('fees')} className="hover:text-white transition-colors">
                  Fee Structure 2026-27
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faculty')} className="hover:text-white transition-colors">
                  Teaching Faculty Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student & Parent Corner */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Student & Parent Corner
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('notices')} className="hover:text-white transition-colors">
                  Notices & Examination Circulars
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('notices')} className="hover:text-white transition-colors">
                  Academic Calendar & Holidays
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('gallery')} className="hover:text-white transition-colors">
                  Photo & Event Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('transport')} className="hover:text-white transition-colors">
                  Mountain Bus Routes & Timings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('admissions')} className="hover:text-amber-300 text-amber-400 font-semibold transition-colors">
                  Submit Admissions Enquiry Form
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and Admin gateway */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {schoolName}, Swarghat. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Management Gateway (/admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
