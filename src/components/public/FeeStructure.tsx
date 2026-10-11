import React from 'react';
import { FeeStructure as FeeType } from '../../types.ts';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeeStructureProps {
  feeStructures: FeeType[];
}

export const FeeStructure: React.FC<FeeStructureProps> = ({ feeStructures }) => {
  return (
    <section id="fees" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
            Fee Structure & Financial Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Transparent, Value-Focused Academic Investment
          </h2>
          <p className="text-base text-slate-600">
            We maintain an equitable, non-commercialized fee structure approved by school management for the academic session 2026-27. No hidden donation or capitation fees.
          </p>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Class Wing / Level</th>
                <th className="py-4 px-6 text-right">Monthly Tuition Fee</th>
                <th className="py-4 px-6 text-right">One-Time Admission Fee</th>
                <th className="py-4 px-6 text-right">Annual Development Charges</th>
                <th className="py-4 px-6">Wing Inclusions & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {feeStructures.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                    {fee.gradeLevel}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-indigo-950 tabular-nums">
                    ₹{fee.tuitionFeeMonthly.toLocaleString('en-IN')}
                    <span className="text-[11px] text-slate-500 font-normal"> / mo</span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-slate-700 tabular-nums">
                    ₹{fee.admissionFeeOnetime.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-slate-700 tabular-nums">
                    ₹{fee.annualCharges.toLocaleString('en-IN')}
                    <span className="text-[11px] text-slate-500 font-normal"> / yr</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 max-w-xs text-xs">
                    {fee.notes || 'Curriculum activities and library access.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Policy & Concessions Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>Modes of Payment</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fees can be remitted via Direct Bank Transfer (NEFT/RTGS), UPI, or at the school accounts desk by demand draft / cheque payable to "Modern Public Sr. Sec. School".
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sibling Concession</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 20% tuition fee waiver is granted on the younger sibling when two or more real children are concurrently enrolled in the school.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Quarterly Schedule</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tuition fees are payable on a quarterly cycle by the 10th of April, July, October, and January to streamline operational planning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
