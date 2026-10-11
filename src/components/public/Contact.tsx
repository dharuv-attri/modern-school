import React from 'react';
import { SchoolSettings } from '../../types.ts';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

interface ContactProps {
  settings: SchoolSettings;
}

export const Contact: React.FC<ContactProps> = ({ settings }) => {
  const address = settings.address || 'NH-205 (Chandigarh-Manali Highway), Swarghat, Tehsil Sri Naina Devi Ji, District Bilaspur, Himachal Pradesh - 174011';
  const phone = settings.contact_phone || '+91 1978-284120, +91 98160-54321';
  const email = settings.contact_email || 'info@modernschoolswarghat.in';
  const hours = settings.office_hours || 'Monday - Saturday: 8:30 AM to 3:30 PM';

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Reach Out to Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Contact Information & Campus Location
          </h2>
          <p className="text-base text-slate-600">
            Located conveniently on the National Highway 205 at Swarghat, our campus is easily accessible from Bilaspur, Naina Devi, and Anandpur Sahib.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>School Postal Address</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {address}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                <span>Telephone Numbers</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold tabular-nums">
                {phone}
              </p>
              <div className="text-[11px] text-slate-500">
                Administrative office, admission desk & transport inquiry.
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                <span>Official Email Communications</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                {email}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Administrative Office Hours</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {hours}
              </p>
            </div>
          </div>

          {/* Interactive Map Visual Representation */}
          <div className="lg:col-span-7 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full min-h-[380px] justify-between p-8 relative">
            <div className="space-y-4">
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Geographical Navigation
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Swarghat Foothills Campus, Himachal Pradesh
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                The school campus is located at Swarghat ridge on the prominent Chandigarh-Manali NH-205 arterial link. Conveniently situated 14 km from Sri Naina Devi Ji and 35 km from Bilaspur district headquarters.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
                  Landmark: Swarghat Forest Rest House / Chowk
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
                  Elevation: 1,220 Meters Above Sea Level
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Coordinates: 31.23° N, 76.57° E · Bilaspur (HP)
              </span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent('Modern Public School Swarghat Himachal Pradesh')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
