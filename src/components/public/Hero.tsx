import React from 'react';
import { Award, BookOpen, Users, Building, ArrowRight, BellRing } from 'lucide-react';
import { SchoolSettings, Notice } from '../../types.ts';

interface HeroProps {
  settings: SchoolSettings;
  latestNotice?: Notice;
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, latestNotice, onNavigateSection }) => {
  const schoolName = settings.school_name || 'Modern Public Sr. Sec. School';
  const subtitle = settings.school_subtitle || 'Swarghat, District Bilaspur, Himachal Pradesh';
  const motto = settings.school_motto || 'Knowledge, Character, Excellence';
  const heroImage = settings.hero_image_url || '/src/assets/images/hero_school_campus_1791729865203.jpg';

  const stats = [
    { label: 'Academic Heritage', value: '25+ Years', icon: BookOpen },
    { label: 'Senior Secondary Result', value: '100% Pass', icon: Award },
    { label: 'Student-Teacher Ratio', value: '18 : 1', icon: Users },
    { label: 'Modern Labs & Tech', value: '20+ Units', icon: Building },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Campus Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern Public Sr. Sec. School Campus in Swarghat"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Ticker / Urgent Notice Bar */}
        {latestNotice && (
          <div
            onClick={() => onNavigateSection('notices')}
            className="mb-8 inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15 cursor-pointer transition-all max-w-2xl text-xs sm:text-sm"
          >
            <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-300 shrink-0">Latest Notice:</span>
            <span className="truncate text-slate-200">{latestNotice.title}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wider uppercase">
              <span>HPBOSE & CBSE Curriculum Pathways</span>
              <span aria-hidden="true">·</span>
              <span>Nursery to Class XII</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {schoolName}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl">
              {subtitle}. A premier institution empowering hill youths with scientific temperament, academic discipline, and cultural values.
            </p>

            <div className="flex items-center gap-3 text-sm text-slate-300 pt-1">
              <span className="font-semibold text-white">Motto:</span>
              <span className="italic text-amber-200">"{motto}"</span>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigateSection('admissions')}
                className="px-6 py-3 text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <span>Admission Enquiry 2026-27</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateSection('academics')}
                className="px-6 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
              >
                Explore Academic Streams
              </button>
            </div>
          </div>

          {/* Right Quick Summary Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
            <h3 className="text-base font-semibold text-white border-b border-white/15 pb-2">
              At a Glance
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Location</span>
                <span className="font-medium text-white text-right">NH-205, Swarghat, Bilaspur (HP)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Streams (XI-XII)</span>
                <span className="font-medium text-white">Science, Commerce, Arts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Medium</span>
                <span className="font-medium text-white">English & Hindi</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Campus Transport</span>
                <span className="font-medium text-white">Fleet covering 4 Routes</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">School Timings</span>
                <span className="font-medium text-white">8:40 AM - 3:20 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Key Metrics Full-Width Strip */}
      <div className="relative z-10 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center shrink-0 text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
