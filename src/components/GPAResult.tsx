import React from 'react';
import { Award, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface GPAResultProps {
  gpa: number;
  totalCredits: number;
  totalCreditPoints: number;
  onReset: () => void;
}

export default function GPAResult({ gpa, totalCredits, totalCreditPoints, onReset }: GPAResultProps) {
  // Determine honors based on GPA rules
  let honorText = 'Pass';
  let honorColor = 'text-slate-600 bg-slate-100 border-slate-200';

  if (gpa >= 9.0) {
    honorText = 'First Class with Exemplary 🌟';
    honorColor = 'text-amber-800 bg-amber-50 border-amber-200';
  } else if (gpa >= 8.5) {
    honorText = 'First Class with Distinction ✨';
    honorColor = 'text-indigo-800 bg-indigo-50 border-indigo-200';
  } else if (gpa >= 6.5) {
    honorText = 'First Class 🎓';
    honorColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
  } else if (gpa > 0) {
    honorText = 'Second Class 👍';
    honorColor = 'text-blue-800 bg-blue-50 border-blue-200';
  }

  return (
    <motion.div
      id="gpa-result-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0f2d59] to-[#1e4e8c] text-white shadow-xl text-center border-b-4 border-amber-500"
    >
      <Award className="h-12 w-12 text-amber-400 mx-auto mb-3" />
      <h3 className="text-sm font-mono tracking-wider text-slate-300 uppercase font-semibold">
        Your Calculated GPA
      </h3>
      
      <div className="my-4">
        <span className="text-5xl sm:text-6xl font-sans font-black tracking-tight text-amber-400">
          {gpa.toFixed(2)}
        </span>
      </div>

      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${honorColor} mb-6`}>
        {honorText}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 rounded-xl bg-slate-900/40 border border-white/10 text-left mb-6 font-mono text-xs sm:text-sm">
        <div>
          <span className="block text-slate-400">Total Credits:</span>
          <span className="font-bold text-slate-100">{totalCredits}</span>
        </div>
        <div>
          <span className="block text-slate-400">Grade Points Sum:</span>
          <span className="font-bold text-slate-100">{totalCreditPoints}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          id="btn-reset-gpa-calculator"
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] font-bold rounded-xl transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-amber-200 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Calculator</span>
        </button>
      </div>
    </motion.div>
  );
}
