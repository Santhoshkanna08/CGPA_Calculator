import React, { useState } from 'react';
import { Percent, HelpCircle, Sparkles, RotateCcw, AlertCircle, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateCGPA } from '../utils/cgpaCalculator';
import { saveCalculation } from '../services/gradeService';

interface SemesterRowState {
  semesterNumber: number;
  semesterName: string;
  isActive: boolean;
  gpa: string; // string for input
  credits: string; // string for input (defaults to 20 for typical weighted credit load)
}

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<SemesterRowState[]>([
    { semesterNumber: 1, semesterName: 'Semester I', isActive: true, gpa: '', credits: '21' },
    { semesterNumber: 2, semesterName: 'Semester II', isActive: true, gpa: '', credits: '22' },
    { semesterNumber: 3, semesterName: 'Semester III', isActive: false, gpa: '', credits: '20' },
    { semesterNumber: 4, semesterName: 'Semester IV', isActive: false, gpa: '', credits: '21' },
    { semesterNumber: 5, semesterName: 'Semester V', isActive: false, gpa: '', credits: '20' },
    { semesterNumber: 6, semesterName: 'Semester VI', isActive: false, gpa: '', credits: '18' },
    { semesterNumber: 7, semesterName: 'Semester VII', isActive: false, gpa: '', credits: '18' },
    { semesterNumber: 8, semesterName: 'Semester VIII', isActive: false, gpa: '', credits: '12' },
  ]);

  const [calcMethod, setCalcMethod] = useState<'SIMPLE_AVERAGE' | 'CREDIT_WEIGHTED'>('CREDIT_WEIGHTED');
  const [cgpaResult, setCgpaResult] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleToggleSemester = (num: number) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.semesterNumber === num ? { ...sem, isActive: !sem.isActive } : sem))
    );
  };

  const handleInputChange = (num: number, field: 'gpa' | 'credits', value: string) => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.semesterNumber !== num) return sem;
        return {
          ...sem,
          [field]: value,
        };
      })
    );
  };

  const handleCalculateCGPA = async () => {
    setValidationError(null);
    setCgpaResult(null);

    const activeSemesters = semesters.filter((s) => s.isActive);
    const validSemesters = [];

    for (const sem of activeSemesters) {
      if (sem.gpa.trim() === '') {
        continue; // skip empty inputs or trigger warning
      }

      const gpaNum = Number(sem.gpa);
      const creditsNum = Number(sem.credits);

      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
        setValidationError(`Invalid GPA entered for ${sem.semesterName}. Must be between 0 and 10.`);
        return;
      }

      if (calcMethod === 'CREDIT_WEIGHTED' && (isNaN(creditsNum) || creditsNum <= 0)) {
        setValidationError(`Please enter a valid credit weight for ${sem.semesterName} (e.g. 20).`);
        return;
      }

      validSemesters.push({
        semesterNumber: sem.semesterNumber,
        gpa: gpaNum,
        credits: creditsNum,
      });
    }

    if (validSemesters.length === 0) {
      setValidationError('Please enter at least one Semester GPA to calculate CGPA.');
      return;
    }

    const calculatedCgpa = calculateCGPA(validSemesters, calcMethod);
    setCgpaResult(calculatedCgpa);

    // Persist to database calculation log
    try {
      await saveCalculation({
        calculation_type: 'CGPA',
        department_id: 'GENERAL', // General calculation page
        cgpa: calculatedCgpa,
        calculation_data: {
          method: calcMethod,
          semesters: validSemesters,
          calculated_cgpa: calculatedCgpa,
        },
      });
    } catch (err) {
      console.warn('Failed to log calculation history:', err);
    }
  };

  const handleReset = () => {
    setSemesters((prev) =>
      prev.map((sem) => ({
        ...sem,
        gpa: '',
      }))
    );
    setCgpaResult(null);
    setValidationError(null);
  };

  return (
    <div id="cgpa-calculator-page" className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* Page Hero Branding */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-amber-500 rounded-2xl text-[#0f2d59] shadow-md">
          <Percent className="h-10 w-10" />
        </div>
        <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
          Cumulative CGPA Calculator
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-500 font-sans leading-normal">
          Select your completed semesters, enter your GPA and corresponding credit loads, and compute your Cumulative Grade Point Average.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Settings / Config Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center space-x-2 border-b border-slate-150 pb-2.5 mb-4">
              <Settings className="h-4 w-4 text-[#0f2d59]" />
              <h3 className="font-sans font-bold text-slate-800 text-sm">
                Calculation Settings
              </h3>
            </div>
            
            <div className="space-y-3">
              <span className="block text-xs font-mono font-bold text-slate-500 uppercase">Calculation Method</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-method-weighted"
                  onClick={() => setCalcMethod('CREDIT_WEIGHTED')}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all text-center cursor-pointer ${
                    calcMethod === 'CREDIT_WEIGHTED'
                      ? 'border-[#0f2d59] bg-[#0f2d59]/5 text-[#0f2d59]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  Credit-Weighted Cumulative (AU standard)
                </button>
                <button
                  id="btn-method-average"
                  onClick={() => setCalcMethod('SIMPLE_AVERAGE')}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all text-center cursor-pointer ${
                    calcMethod === 'SIMPLE_AVERAGE'
                      ? 'border-[#0f2d59] bg-[#0f2d59]/5 text-[#0f2d59]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  Simple GPA Average
                </button>
              </div>
            </div>
          </div>

          {/* Semesters Input Grid */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-black text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-3">
              Completed Semesters
            </h3>

            <div className="space-y-3.5">
              {semesters.map((sem) => (
                <div
                  key={sem.semesterNumber}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl border-2 transition-all ${
                    sem.isActive
                      ? 'border-slate-200 bg-white'
                      : 'border-slate-100 bg-slate-50/50 opacity-60'
                  }`}
                >
                  {/* Toggle Checkbox */}
                  <div className="flex items-center space-x-3 mb-2.5 sm:mb-0">
                    <input
                      id={`checkbox-sem-${sem.semesterNumber}`}
                      type="checkbox"
                      checked={sem.isActive}
                      onChange={() => handleToggleSemester(sem.semesterNumber)}
                      className="h-5 w-5 rounded border-slate-300 text-[#0f2d59] focus:ring-amber-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`checkbox-sem-${sem.semesterNumber}`}
                      className="font-sans font-bold text-slate-800 text-sm cursor-pointer"
                    >
                      {sem.semesterName}
                    </label>
                  </div>

                  {/* Input Fields */}
                  {sem.isActive && (
                    <div className="flex items-center space-x-3">
                      {/* GPA Input */}
                      <div className="relative">
                        <label className="absolute -top-2 left-2 px-1 bg-white text-[9px] font-bold text-slate-400 font-mono">GPA</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          placeholder="0.00"
                          value={sem.gpa}
                          onChange={(e) => handleInputChange(sem.semesterNumber, 'gpa', e.target.value)}
                          className="w-20 px-2 py-2 text-center text-sm font-mono font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-[#0f2d59]"
                        />
                      </div>

                      {/* Credits (Visible only if Credit-Weighted) */}
                      {calcMethod === 'CREDIT_WEIGHTED' && (
                        <div className="relative">
                          <label className="absolute -top-2 left-2 px-1 bg-white text-[9px] font-bold text-slate-400 font-mono">CREDITS</label>
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={sem.credits}
                            onChange={(e) => handleInputChange(sem.semesterNumber, 'credits', e.target.value)}
                            className="w-16 px-2 py-2 text-center text-sm font-mono font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-[#0f2d59]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center space-x-1.5 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Calculate Button */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                id="btn-calculate-cgpa"
                onClick={handleCalculateCGPA}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] font-black text-sm rounded-xl cursor-pointer"
              >
                Calculate CGPA
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Displays */}
        <div className="space-y-6">
          {cgpaResult !== null ? (
            <motion.div
              id="cgpa-result-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0f2d59] to-[#143e75] text-white shadow-xl text-center border-b-4 border-amber-500"
            >
              <Sparkles className="h-10 w-10 text-amber-400 mx-auto mb-3 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 tracking-wider uppercase font-semibold">
                Your Cumulative CGPA
              </span>
              <div className="my-3">
                <span className="text-5xl sm:text-6xl font-sans font-black text-amber-400 tracking-tight">
                  {cgpaResult.toFixed(2)}
                </span>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-900/40 border border-white/10 text-xs text-left font-mono leading-relaxed mt-4">
                <strong className="text-slate-200 block mb-1 uppercase text-[10px]">Methodology Applied:</strong>
                {calcMethod === 'CREDIT_WEIGHTED' 
                  ? 'Credit-Weighted Cumulative CGPA. Computes CGPA by multiplying each semester GPA by its academic credit count, then dividing by cumulative credits.'
                  : 'Simple GPA Average. Computes CGPA as the direct arithmetic average of active semester GPA scores.'}
              </div>

              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-xs font-bold rounded-lg cursor-pointer transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Calculate Again</span>
              </button>
            </motion.div>
          ) : (
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-slate-300" />
              <h4 className="font-sans font-bold text-slate-600 text-sm">Awaiting Entry</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                Check your active semesters, enter their GPA scores and credits, and click <strong>Calculate CGPA</strong> to inspect your cumulative performance card.
              </p>
            </div>
          )}

          {/* Guidelines info card */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-3">
            <span className="block text-xs font-mono font-bold text-[#0f2d59] uppercase tracking-wider">CGPA Rules Reference</span>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Under Anna University Regulations (R2021) followed by KCET Autonomous curriculum, the official method for graduation classification is the <strong>Credit-Weighted Cumulative GPA</strong>.
            </p>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              This weights heavier semesters higher, ensuring perfect mathematical accuracy matching your official transcripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
