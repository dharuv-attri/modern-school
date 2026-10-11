import React from 'react';
import { Target, Compass, Award, Quote, CheckCircle2 } from 'lucide-react';
import { SchoolSettings } from '../../types.ts';

interface AboutProps {
  settings: SchoolSettings;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const principalName = settings.principal_name || 'Dr. R. K. Sharma';
  const principalQuote = settings.principal_quote || 'Education at Modern Public Sr. Sec. School Swarghat is an inspiring voyage where mountain values of grit, humility, and determination blend seamlessly with modern scientific inquiry.';
  const affiliationDetails = settings.affiliation_details || 'Recognized by H.P. Directorate of Education & Affiliated to HPBOSE / Senior Secondary Board (Setup Placeholder: Registration details editable in admin)';

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            About Our Institution
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Fostering Academic Brilliance in the Heart of Swarghat
          </h2>
          <p className="text-base text-slate-600">
            Situated amidst the tranquil pine ridges along the Chandigarh-Manali National Highway in Bilaspur district, Modern Public Sr. Sec. School stands as a beacon of scholastic integrity and character formation.
          </p>
        </div>

        {/* 2-Column Institutional Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              A Legacy of Holistic Hill Education
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Established to provide rural and semi-urban scholars of the Naina Devi and Bilaspur border region with high-caliber schooling, our institution blends high academic expectations with wholesome personality cultivation. Our students consistently excel in state board examinations, scientific fairs, and sports meets.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong className="text-slate-900">Affiliation & Board Standards:</strong> {affiliationDetails}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong className="text-slate-900">Spacious Mountain Campus:</strong> Dedicated academic wings, open quadrangle, separate laboratories for senior sciences, and green surroundings.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong className="text-slate-900">Individual Student Mentorship:</strong> Average section size capped at 35 pupils ensures customized academic coaching and moral guidance.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Our Vision</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To inspire inquisitive, resilient, and morally grounded leaders ready to embrace contemporary scientific and professional opportunities.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Our Mission</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To deliver accessible, benchmarked senior secondary schooling while nurturing cultural heritage, physical fitness, and civic responsibility.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Principal's Desk Message Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-indigo-900 flex items-center justify-center text-indigo-900 font-bold text-xl shrink-0">
                MP
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{principalName}</h3>
                <div className="text-xs text-indigo-900 font-medium">Head of Institution · Principal's Desk</div>
                <div className="text-xs text-slate-500">Modern Public Sr. Sec. School, Swarghat</div>
              </div>
            </div>

            <div className="relative pl-6 italic text-slate-700 text-sm sm:text-base leading-relaxed border-l-2 border-amber-400">
              <Quote className="w-6 h-6 text-amber-300 absolute -top-3 -left-3 fill-amber-300 opacity-60" />
              "{principalQuote}"
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We look forward to welcoming aspiring students and engaged parents into our school family for the upcoming academic session. You are welcome to visit our administrative office during working hours for campus interaction.
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Office Timings: 8:30 AM – 3:30 PM</span>
              <span className="font-semibold text-slate-700">Sub-Tehsil Naina Devi Ji</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
