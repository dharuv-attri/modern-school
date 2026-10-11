import React, { useState } from 'react';
import { School, Menu, X, ShieldCheck, Download } from 'lucide-react';
import { SchoolSettings } from '../../types.ts';

interface HeaderProps {
  settings: SchoolSettings;
  onNavigateToAdmin: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onNavigateToAdmin,
  activeSection,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const schoolName = settings.school_name || 'Modern Public Sr. Sec. School';

  const navLinks = [
    { id: 'about', label: 'About School' },
    { id: 'academics', label: 'Academics' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'notices', label: 'Notices & Calendar' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Utility Bar with Affiliation & Emergency Contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Swarghat, Distt. Bilaspur (H.P.)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-medium">Session 2026-27 Admissions Open</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-400">Office: {settings.contact_phone?.split(',')[0] || '+91 1978-284120'}</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <a
              href="/modern-public-school-swarghat.zip"
              download="modern-public-school-swarghat.zip"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold transition-colors"
              title="Download Full Project Source Code (ZIP)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              title="Secure School Management Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary CTA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean line) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
              {schoolName}
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Swarghat, Himachal Pradesh · Senior Secondary
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeSection === link.id
                  ? 'text-indigo-900 font-semibold border-b-2 border-indigo-900'
                  : 'hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA Button + Download ZIP */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href="/modern-public-school-swarghat.zip"
            download="modern-public-school-swarghat.zip"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download full project archive for VS Code"
          >
            <Download className="w-3.5 h-3.5 text-indigo-900" />
            <span>Download ZIP</span>
          </a>
          <button
            onClick={() => handleNavClick('admissions')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors whitespace-nowrap shadow-sm"
          >
            Admissions Enquiry
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left py-2 text-sm font-medium ${
                activeSection === link.id ? 'text-indigo-900 font-bold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="/modern-public-school-swarghat.zip"
              download="modern-public-school-swarghat.zip"
              className="w-full text-center py-2.5 text-xs font-semibold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-indigo-900" />
              <span>Download Project ZIP (VS Code)</span>
            </a>
            <button
              onClick={() => handleNavClick('admissions')}
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-indigo-900 rounded-lg shadow-sm"
            >
              Admissions Enquiry 2026-27
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="w-full text-center py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
