import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { CalculatedSubjectResult } from '../types/subject';

interface CalculationBreakdownProps {
  results: CalculatedSubjectResult[];
  gpa: number;
}

export default function CalculationBreakdown({ results, gpa }: CalculationBreakdownProps) {
  const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
  const totalCreditPoints = results.reduce((sum, r) => sum + r.credits * r.gradePoint, 0);

  return (
    <div id="calculation-breakdown-panel" className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
        <Sparkles className="h-5 w-5 text-[#0f2d59]" />
        <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg">
          Detailed Calculation Breakdown
        </h3>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm font-mono">
          <thead className="bg-slate-50 text-slate-500 font-sans font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3.5">Subject / Code</th>
              <th scope="col" className="px-4 py-3.5 text-center">Grade</th>
              <th scope="col" className="px-4 py-3.5 text-center">Credits (C)</th>
              <th scope="col" className="px-4 py-3.5 text-center">Grade Pt (GP)</th>
              <th scope="col" className="px-4 py-3.5 text-right">Points (C × GP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-slate-700 bg-white">
            {results.map((res, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-4 py-4 max-w-[220px]">
                  <div className="font-bold text-slate-800">{res.subjectCode}</div>
                  <div className="text-slate-500 text-xs truncate font-sans">{res.subjectName}</div>
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-sans rounded-md">
                    {res.subjectType}
                  </span>
                </td>
                <td className="px-4 py-4 text-center font-bold text-slate-900">
                  <span className={res.grade === 'RA' ? 'text-rose-600' : 'text-emerald-700'}>
                    {res.grade}
                  </span>
                </td>
                <td className="px-4 py-4 text-center font-bold text-slate-800">{res.credits}</td>
                <td className="px-4 py-4 text-center text-slate-600">{res.gradePoint}</td>
                <td className="px-4 py-4 text-right font-bold text-[#0f2d59]">{res.credits * res.gradePoint}</td>
              </tr>
            ))}
            
            {/* Summary Row */}
            <tr className="bg-slate-50/80 font-sans font-bold">
              <td colSpan={2} className="px-4 py-4 text-slate-600">Total Sums</td>
              <td className="px-4 py-4 text-center text-slate-800 font-mono">{totalCredits}</td>
              <td className="px-4 py-4 text-center text-slate-400 font-mono">--</td>
              <td className="px-4 py-4 text-right text-[#0f2d59] font-mono">{totalCreditPoints}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Step by Step Explanation */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-150 space-y-3">
        <div className="flex items-center space-x-2 text-[#0f2d59] font-bold text-sm">
          <HelpCircle className="h-4 w-4" />
          <span>How was your GPA calculated?</span>
        </div>
        <p className="text-xs text-slate-600 font-sans leading-relaxed">
          The calculation formula is specified in the college curriculum instructions as:
        </p>
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-800 font-bold overflow-x-auto shadow-inner">
          {"GPA = Sum of (Credit × Grade Point) / Sum of Credits"}
        </div>
        <div className="space-y-1.5 text-xs text-slate-600 font-mono pl-1">
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
            <span>1. Sum of Credit Points:</span>
            <span className="font-bold text-slate-900">{totalCreditPoints}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
            <span>2. Sum of Credits considered:</span>
            <span className="font-bold text-slate-900">{totalCredits}</span>
          </div>
          <div className="flex justify-between font-bold text-[#0f2d59] pt-1">
            <span>3. Final Division:</span>
            <span>{totalCreditPoints} / {totalCredits} = {gpa.toFixed(4)}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-sans leading-normal italic bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
          * Note: Rounded to <strong>{gpa.toFixed(2)}</strong> (using standard decimal rounding limit of 2 places). Any courses with incomplete or fail (RA) status are still factored in with 0 grade points as per official KCET specifications.
        </div>
      </div>
    </div>
  );
}
