import React from 'react';
import { TransportRoute } from '../../types.ts';
import { Bus, MapPin, Clock, Phone, ShieldCheck } from 'lucide-react';

interface TransportProps {
  routes: TransportRoute[];
}

export const Transport: React.FC<TransportProps> = ({ routes }) => {
  return (
    <section id="transport" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Commute & Mountain Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Dedicated School Fleet & Safe Mountain Transport
          </h2>
          <p className="text-base text-slate-600">
            Understanding the unique hilly geography of Bilaspur and Naina Devi sub-tehsil, our fleet operates on strict schedules with experienced mountain drivers and conductor oversight.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded">
                    {route.routeNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {route.vehicleType}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{route.routeName}</h3>
                  <div className="flex items-start gap-2 mt-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-indigo-900 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{route.coverageAreas}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> Morning Pickup
                  </span>
                  <span className="font-semibold tabular-nums">{route.morningTime}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> Evening Return
                  </span>
                  <span className="font-semibold tabular-nums">{route.eveningTime}</span>
                </div>

                {route.driverIncharge && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-800">
                    <span className="text-slate-500">Driver Incharge:</span>
                    <span className="font-medium">{route.driverIncharge}</span>
                  </div>
                )}
                {route.contactNumber && (
                  <div className="flex items-center justify-between text-indigo-950 font-medium">
                    <span className="text-slate-500">Direct Contact:</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-indigo-900" />
                      {route.contactNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Safety standards strip */}
        <div className="p-6 rounded-xl border border-slate-200 bg-indigo-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-900 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-indigo-950">Strict Safety Protocol:</strong> All vehicles undergo quarterly hill-fitness certification, speed governor checks (capped at 40 km/h in hill zones), and carry first-aid kits and fire extinguishers.
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-900 whitespace-nowrap">
            Transport Desk: Extension 104
          </span>
        </div>
      </div>
    </section>
  );
};
