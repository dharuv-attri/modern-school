import React, { useState } from 'react';
import { Microscope, BarChart3, Palette, BookOpen, Clock, CalendarCheck } from 'lucide-react';

export const Academics: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<'science' | 'commerce' | 'arts'>('science');

  const streams = [
    {
      id: 'science' as const,
      name: 'Science Stream (Medical & Non-Medical)',
      badge: 'STEM Focused',
      icon: Microscope,
      subjects: ['Physics', 'Chemistry', 'Biology / Mathematics', 'General English', 'Physical Education / Informatics Practices'],
      description: 'Rigorous analytical foundation with daily practical laboratory sessions, preparing students for engineering (JEE), medical (NEET), NDA, and central university admissions.',
      features: ['Dedicated Physics, Chemistry & Biology Labs', 'Continuous Practical Record Assessment', 'Competitive Exam Foundation Classes'],
    },
    {
      id: 'commerce' as const,
      name: 'Commerce Stream',
      badge: 'Finance & Enterprise',
      icon: BarChart3,
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'General English', 'Mathematics / Informatics Practices'],
      description: 'Comprehensive business literacy, bookkeeping principles, and macro/micro-economic analysis structured for aspiring Chartered Accountants, corporate managers, and entrepreneurs.',
      features: ['Practical Case Studies in Business', 'Computerized Accounting Modules', 'Financial Literacy Workshops'],
    },
    {
      id: 'arts' as const,
      name: 'Humanities & Arts Stream',
      badge: 'Civics & Society',
      icon: Palette,
      subjects: ['Political Science', 'History / Geography', 'Economics / Sociology', 'English Core', 'Hindi Elective / Physical Education'],
      description: 'Deep exploration of governance, historical movements, civic policy, and literature preparing future civil servants, legal practitioners, and educators.',
      features: ['Debate & Model Youth Parliament', 'Extensive Social Science Library', 'Civil Services Foundation Seminars'],
    },
  ];

  const classWings = [
    {
      wing: 'Pre-Primary Wing',
      grades: 'Nursery, LKG, UKG',
      focus: 'Play-way methodology, alphabet phonetics, motor skill games, and foundational numeracy in a safe caring mountain environment.',
    },
    {
      wing: 'Primary Wing',
      grades: 'Class I to Class V',
      focus: 'Core literacy, environmental awareness, conceptual mathematics, spoken English, and creative drawing & arts.',
    },
    {
      wing: 'Middle Wing',
      grades: 'Class VI to Class VIII',
      focus: 'Introduction to experimental sciences, social geography, computer coding fundamentals, and physical sports.',
    },
    {
      wing: 'Secondary Wing',
      grades: 'Class IX & Class X',
      focus: 'Rigorous state board preparation, diagnostic assessments, science practical demonstration, and career guidance.',
    },
  ];

  return (
    <section id="academics" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Academic Curriculum & Pathways
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Comprehensive Education from Kindergarten to Class XII
          </h2>
          <p className="text-base text-slate-600">
            Affiliated to state and national board standards, Modern Public Sr. Sec. School delivers an intellectually stimulating curriculum supported by active teacher mentorship.
          </p>
        </div>

        {/* 4-Wing Academic Ladder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classWings.map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                {item.grades}
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.wing}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.focus}</p>
            </div>
          ))}
        </div>

        {/* Senior Secondary Streams Spotlight */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Senior Secondary Specialized Streams (Classes XI & XII)
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Choose Your Professional Trajectory
              </h3>
            </div>

            {/* Interactive Stream Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg">
              {streams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => setSelectedStream(stream.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    selectedStream === stream.id
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {stream.id === 'science' ? 'Science' : stream.id === 'commerce' ? 'Commerce' : 'Arts / Humanities'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Stream Content */}
          {(() => {
            const current = streams.find((s) => s.id === selectedStream)!;
            const Icon = current.icon;
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{current.name}</h4>
                      <span className="text-xs text-amber-300">{current.badge}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Program Highlights:
                    </div>
                    {current.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Core Subject Combination
                  </div>
                  <ul className="space-y-2.5">
                    {current.subjects.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 border-b border-white/5 pb-2">
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-400 italic">
                    * Elective combinations subject to student eligibility criteria and seat capacity.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Academic Schedule & Routine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Daily School Schedule</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Morning Assembly & Prayer</span>
                <span className="font-semibold text-slate-800">8:40 AM – 9:00 AM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Periods 1 to 4</span>
                <span className="font-semibold text-slate-800">9:00 AM – 11:40 AM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Nutritious Recess / Lunch</span>
                <span className="font-semibold text-slate-800">11:40 AM – 12:10 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Periods 5 to 8 (Lab & Sports)</span>
                <span className="font-semibold text-slate-800">12:10 PM – 3:10 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Dispersal & Mountain Bus Departure</span>
                <span className="font-semibold text-slate-800">3:20 PM</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
              <CalendarCheck className="w-4 h-4" />
              <span>Assessment & Evaluation Paradigm</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Diagnostic Unit Tests</span>
                <span className="font-semibold text-slate-800">Bi-Monthly Assessments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Mid-Term Examinations</span>
                <span className="font-semibold text-slate-800">September / October</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Pre-Board Examination Cycle</span>
                <span className="font-semibold text-slate-800">December & January</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Practical Project Portfolios</span>
                <span className="font-semibold text-slate-800">Continuous Assessment</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Annual Board Examinations</span>
                <span className="font-semibold text-slate-800">February / March</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
