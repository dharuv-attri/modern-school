import React from 'react';
import { Facility } from '../../types.ts';
import { Microscope, BookOpen, Trophy, Monitor, Bus, ShieldCheck } from 'lucide-react';

interface FacilitiesProps {
  facilities: Facility[];
}

export const Facilities: React.FC<FacilitiesProps> = ({ facilities }) => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'laboratories':
      case 'labs':
        return Microscope;
      case 'library':
        return BookOpen;
      case 'sports':
        return Trophy;
      case 'technology':
        return Monitor;
      case 'transport':
        return Bus;
      default:
        return ShieldCheck;
    }
  };

  return (
    <section id="facilities" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Campus Infrastructure & Facilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Safe, Stimulating Spaces for 360-Degree Growth
          </h2>
          <p className="text-base text-slate-600">
            Our purpose-built campus in Swarghat offers well-ventilated, daylight-filled infrastructure tailored for academic inquiry, physical fitness, and student well-being.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility) => {
            const Icon = getIcon(facility.category);
            const featureList = facility.features ? facility.features.split(',').map((f) => f.trim()) : [];

            return (
              <div
                key={facility.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Photo Frame or Icon Fallback */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  {facility.imageUrl ? (
                    <img
                      src={facility.imageUrl}
                      alt={facility.title}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <Icon className="w-12 h-12 mb-2 text-indigo-900" />
                      <span className="text-xs font-medium">{facility.category}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded">
                    {facility.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{facility.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>

                  {featureList.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Features:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {featureList.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
