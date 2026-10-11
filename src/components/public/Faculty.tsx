import React from 'react';
import { FacultyMember } from '../../types.ts';
import { GraduationCap, Award, Briefcase } from 'lucide-react';

interface FacultyProps {
  faculty: FacultyMember[];
}

export const Faculty: React.FC<FacultyProps> = ({ faculty }) => {
  return (
    <section id="faculty" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Our Mentors & Educators
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Distinguished Faculty & Academic Leadership
          </h2>
          <p className="text-base text-slate-600">
            Our educators bring academic depth, professional pedagogical credentials, and passionate care to ensure that each student discovers their highest potential.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                {/* Avatar placeholder / image */}
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-lg">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>
                      {member.name
                        .replace(/(Dr\.|Mr\.|Mrs\.|Sh\.)/g, '')
                        .trim()
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                  <div className="text-xs font-medium text-indigo-900 mt-0.5">
                    {member.designation}
                  </div>
                  <div className="text-[11px] text-slate-500">{member.department}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.qualification}</span>
                </div>
                {member.experience && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{member.experience}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
