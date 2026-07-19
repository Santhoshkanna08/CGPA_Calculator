import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { GradeRule } from '../types/database';

interface GradeDisplayProps {
  rules: GradeRule[];
}

export default function GradeDisplay({ rules }: GradeDisplayProps) {
  // Sort rules descending by grade point
  const sortedRules = [...rules].sort((a, b) => b.grade_point - a.grade_point);

  return (
    <div id="grade-rules-reference-panel" className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <ShieldCheck className="h-5 w-5 text-amber-500" />
        <h3 className="font-sans font-bold text-slate-900 text-sm sm:text-base">
          Active Grading Configuration
        </h3>
      </div>
      
      <p className="text-xs text-slate-500 font-sans">
        These grading rules and their respective grade points are fetched dynamically from the college regulations database.
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
        {sortedRules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`flex items-center justify-between p-2.5 rounded-lg border ${
                rule.grade === 'RA'
                  ? 'bg-rose-50 border-rose-100 text-rose-800'
                  : 'bg-slate-50 border-slate-150 text-slate-800'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-base">{rule.grade}</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {rule.is_pass ? 'Pass Grade' : 'Re-Appearance'}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-base text-[#0f2d59]">GP: {rule.grade_point}</div>
                <div className="text-[10px] text-slate-400 font-sans">
                  {rule.grade_point >= 9 ? 'Excellent' : rule.grade_point >= 7 ? 'Very Good' : rule.grade_point >= 6 ? 'Average' : rule.grade_point > 0 ? 'Pass' : 'Fail'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-800 font-sans leading-normal">
          <strong>GP Reference:</strong> Grade Points (GP) are used directly for GPA calculations. The final score is computed as: <code>Σ(C × GP) / ΣC</code>.
        </div>
      </div>
    </div>
  );
}
