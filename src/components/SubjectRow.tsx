import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SubjectInput } from '../types/subject';
import { GradeRule } from '../types/database';

interface SubjectRowProps {
  input: SubjectInput;
  gradeRules: GradeRule[];
  onChangeGrade: (grade: string) => void;
}

export default function SubjectRow({ input, gradeRules, onChangeGrade }: SubjectRowProps) {
  // Sort rules descending by grade point
  const sortedRules = [...gradeRules].sort((a, b) => b.grade_point - a.grade_point);
  const isComplete = !!input.selectedGrade;

  return (
    <div
      id={`subject-row-${input.subjectId}`}
      className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 bg-white ${
        isComplete
          ? 'border-emerald-300 shadow-emerald-50/50 bg-emerald-50/10'
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-xs font-semibold rounded border border-slate-200">
              {input.subjectCode}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Credits: {input.credits}
            </span>
          </div>
          <h4 className="mt-1 font-sans font-semibold text-slate-800 text-sm sm:text-base truncate">
            {input.subjectName}
          </h4>
        </div>

        {/* Input & Output Area */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Grade Dropdown Selector */}
          <div className="relative">
            <label
              htmlFor={`grade-${input.subjectId}`}
              className="absolute -top-2.5 left-2.5 px-1.5 bg-white text-[10px] font-bold text-slate-500 font-mono uppercase"
            >
              Grade
            </label>
            <select
              id={`grade-${input.subjectId}`}
              value={input.selectedGrade || ''}
              onChange={(e) => onChangeGrade(e.target.value)}
              className={`w-32 sm:w-36 px-2.5 py-2.5 font-sans font-bold text-center text-sm rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
                isComplete
                  ? 'border-emerald-400 text-emerald-700 focus:ring-emerald-100 bg-emerald-50/5'
                  : 'border-slate-300 text-slate-500 focus:ring-indigo-100 focus:border-[#0f2d59] bg-white'
              }`}
            >
              <option value="">[Select Grade ▼]</option>
              {sortedRules.map((rule) => (
                <option key={rule.id || rule.grade} value={rule.grade}>
                  {rule.grade} (GP: {rule.grade_point})
                </option>
              ))}
            </select>
          </div>

          {/* Grade Point Pill */}
          <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px]">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Points</span>
            <span
              className={`text-xl sm:text-2xl font-mono font-black ${
                input.selectedGrade === 'RA'
                  ? 'text-rose-600'
                  : isComplete
                  ? 'text-emerald-600'
                  : 'text-slate-300'
              }`}
            >
              {isComplete ? input.gradePoint : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Message */}
      {isComplete && (
        <div className="mt-2.5 flex items-center space-x-1.5 text-emerald-600 text-xs font-sans font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Allocated GP: {input.gradePoint} × Credits: {input.credits} = {input.credits * (input.gradePoint || 0)} credit points</span>
        </div>
      )}
    </div>
  );
}
