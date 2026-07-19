import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, RefreshCw, Sparkles, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { fetchDepartments, fetchSemesters, fetchSubjects } from '../services/subjectService';
import { fetchGradeRules, saveCalculation } from '../services/gradeService';
import { Department, Semester, Subject, GradeRule, SubjectType } from '../types/database';
import { SubjectInput, CalculatedSubjectResult } from '../types/subject';
import { calculateGPA } from '../utils/gpaCalculator';
import SubjectRow from '../components/SubjectRow';
import GPAResult from '../components/GPAResult';
import CalculationBreakdown from '../components/CalculationBreakdown';
import GradeDisplay from '../components/GradeDisplay';

export default function GPACalculator() {
  const { deptId } = useParams<{ deptId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [gradeRules, setGradeRules] = useState<GradeRule[]>([]);
  
  const [subjectInputs, setSubjectInputs] = useState<SubjectInput[]>([]);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [loadedKey, setLoadedKey] = useState<string>('');
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state directly from URL
  const currentSemesterId = searchParams.get('semester') || '';
  const currentDept = departments.find((d) => d.id === deptId) || null;

  // Determine if subjects are loading or out of sync with URL
  const isSubjectsOutOfSync = currentSemesterId && (loadedKey !== `${deptId}-${currentSemesterId}`);
  const showSubjectsLoading = subjectsLoading || isSubjectsOutOfSync;

  // Result state
  const [gpaResult, setGpaResult] = useState<{
    gpa: number;
    totalCredits: number;
    totalCreditPoints: number;
    results: CalculatedSubjectResult[];
  } | null>(null);

  // Load Metadata (departments, semesters, grade rules) once on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        setMetadataLoading(true);
        const [deptsData, semsData, rulesData] = await Promise.all([
          fetchDepartments(),
          fetchSemesters(),
          fetchGradeRules('R21'), // default regulation
        ]);
        
        setDepartments(deptsData);
        setSemesters(semsData);
        setGradeRules(rulesData);
      } catch (err: any) {
        console.error('Error loading metadata:', err);
        setError('Failed to connect to the KCET server.');
      } finally {
        setMetadataLoading(false);
      }
    }
    loadMetadata();
  }, []);

  // Validate deptId once metadata is loaded
  useEffect(() => {
    if (!metadataLoading && deptId) {
      const matchedDept = departments.find((d) => d.id === deptId);
      if (!matchedDept) {
        setError(`Department '${deptId}' not found.`);
      } else {
        setError(null);
      }
    }
  }, [metadataLoading, deptId, departments]);

  // Load Subjects when department or semester changes
  useEffect(() => {
    if (!deptId) return;
    if (!currentSemesterId) {
      setSubjectInputs([]);
      setLoadedKey('');
      return;
    }

    async function loadSubjects() {
      setSubjectsLoading(true);
      setGpaResult(null); // clear old results
      try {
        const subjectsData = await fetchSubjects('R21', deptId, currentSemesterId);
        
        // Map database subjects to UI state inputs
        const initialInputs: SubjectInput[] = subjectsData.map((sub) => ({
          subjectId: sub.id,
          subjectCode: sub.subject_code,
          subjectName: sub.subject_name,
          credits: sub.credits,
          subjectType: sub.subject_type,
          selectedGrade: '',
          gradePoint: 0,
        }));

        setSubjectInputs(initialInputs);
        setLoadedKey(`${deptId}-${currentSemesterId}`);
      } catch (err: any) {
        console.error('Error loading subjects:', err);
        // Fall back to empty list, let user add custom subjects
        setSubjectInputs([]);
        setLoadedKey(`${deptId}-${currentSemesterId}`);
      } finally {
        setSubjectsLoading(false);
      }
    }

    loadSubjects();
  }, [deptId, currentSemesterId]);

  // Handle Grade Selection Changes
  const handleGradeChange = (subjectId: string, gradeVal: string) => {
    setSubjectInputs((prev) =>
      prev.map((input) => {
        if (input.subjectId !== subjectId) return input;

        const matchedRule = gradeRules.find((rule) => rule.grade === gradeVal);
        const gradePoint = matchedRule ? matchedRule.grade_point : 0;

        return {
          ...input,
          selectedGrade: gradeVal,
          gradePoint,
        };
      })
    );
  };

  // Add Custom Subject on-the-fly (Highly requested helper)
  const handleAddCustomSubject = () => {
    const code = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSubject: SubjectInput = {
      subjectId: `custom-${Date.now()}`,
      subjectCode: code,
      subjectName: 'Custom Subject (Tap to edit name)',
      credits: 3,
      subjectType: 'THEORY',
      selectedGrade: '',
      gradePoint: 0,
    };
    setSubjectInputs((prev) => [...prev, newSubject]);
  };

  const handleUpdateCustomSubjectDetails = (subjectId: string, name: string, credits: number, type: SubjectType) => {
    setSubjectInputs((prev) =>
      prev.map((input) => {
        if (input.subjectId !== subjectId) return input;
        return {
          ...input,
          subjectName: name,
          credits,
          subjectType: type,
        };
      })
    );
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSubjectInputs((prev) => prev.filter((input) => input.subjectId !== subjectId));
  };

  // Perform GPA Calculation
  const handleCalculateGPA = async () => {
    if (subjectInputs.length === 0) {
      alert('Please add at least one subject to calculate GPA.');
      return;
    }

    // Verify all subjects have a selected grade
    const unselected = subjectInputs.filter((input) => !input.selectedGrade);
    if (unselected.length > 0) {
      alert('Please select a grade for all courses before calculating GPA.');
      return;
    }

    // Convert inputs to completed calculated results
    const results: CalculatedSubjectResult[] = subjectInputs.map((input) => {
      return {
        subjectCode: input.subjectCode,
        subjectName: input.subjectName,
        credits: input.credits,
        subjectType: input.subjectType,
        grade: input.selectedGrade || 'RA',
        gradePoint: input.gradePoint || 0,
        creditPoints: input.credits * (input.gradePoint || 0),
      };
    });

    const calculationResult = calculateGPA(results);
    const finalGpaResult = {
      ...calculationResult,
      results,
    };

    setGpaResult(finalGpaResult);

    // Save calculation history asynchronously
    try {
      await saveCalculation({
        calculation_type: 'GPA',
        department_id: deptId,
        semester_id: currentSemesterId,
        gpa: calculationResult.gpa,
        calculation_data: finalGpaResult,
      });
    } catch (saveErr) {
      console.warn('Failed to persist calculation to history:', saveErr);
    }
  };

  const handleReset = () => {
    setSubjectInputs((prev) =>
      prev.map((input) => ({
        ...input,
        selectedGrade: '',
        gradePoint: 0,
      }))
    );
    setGpaResult(null);
  };

  const activeSemesterObj = semesters.find((s) => s.id === currentSemesterId);

  // Group inputs into THEORY and PRACTICALS
  const theorySubjects = subjectInputs.filter((s) => s.subjectType === 'THEORY' || s.subjectType === 'ELECTIVE');
  const practicalSubjects = subjectInputs.filter((s) => s.subjectType === 'PRACTICAL' || s.subjectType === 'OTHER');

  const hasSeededData = (deptCode: string, semNum: number) => {
    const code = deptCode.toUpperCase();
    if (code === 'CSE' && (semNum === 1 || semNum === 2)) return true;
    if (code === 'ECE' && (semNum === 1 || semNum === 2)) return true;
    if (code === 'IT' && (semNum === 3)) return true;
    if (code === 'AI&DS' && (semNum === 2 || semNum === 4)) return true;
    if (code === 'AIDS' && (semNum === 2 || semNum === 4)) return true;
    return false;
  };

  if (metadataLoading) {
    if (currentSemesterId) {
      return (
        <div id="gpa-calculator-loading" className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-pulse">
          {/* Page Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
              <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-80 bg-slate-200 rounded"></div>
            </div>
          </div>
          {/* Semester selection tabs skeleton */}
          <div className="h-14 bg-slate-100 rounded-2xl"></div>
          {/* Subject Rows Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-16 bg-slate-50/50 border border-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      );
    }

    // Otherwise, show the Choose Your Semester skeleton
    return (
      <div id="gpa-calculator-loading" className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-pulse">
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-80 bg-slate-200 rounded"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 pb-2">
            <div className="h-6 w-48 bg-slate-200 rounded"></div>
            <div className="h-4 w-72 bg-slate-200 rounded"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="p-5 h-36 rounded-2xl border-2 border-slate-100 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-slate-200 rounded"></div>
                  <div className="h-4 w-12 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-5 w-24 bg-slate-200 rounded"></div>
                <div className="h-3 w-28 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentSemesterId) {
    return (
      <div id="gpa-calculator-page" className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-500 hover:text-[#0f2d59] mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Department Selection</span>
            </button>
            <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
              {currentDept ? `Department of ${currentDept.department_code}` : 'GPA Calculator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
              Kamaraj College of Engineering and Technology (Autonomous)
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-sans">
            <span>❌ {error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="border-b border-slate-150 pb-2">
            <h3 className="font-sans font-extrabold text-slate-800 text-xl sm:text-2xl tracking-tight leading-none">
              Choose Your Semester
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
              Select a semester below to load official pre-seeded autonomous syllabus courses or compute custom GPA.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {semesters.map((sem) => {
              const hasData = currentDept ? hasSeededData(currentDept.department_code, sem.semester_number) : false;
              return (
                <button
                  key={sem.id}
                  id={`btn-semester-card-${sem.id}`}
                  onClick={() => {
                    setSearchParams({ semester: sem.id });
                  }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                    hasData
                      ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50/60 hover:shadow-lg hover:-translate-y-0.5'
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Background visual emblem */}
                  <div className="absolute right-0 bottom-0 opacity-[0.03] text-[#0f2d59] font-black text-6xl font-sans select-none pointer-events-none transform translate-y-3 translate-x-3 group-hover:scale-110 transition-transform">
                    S{sem.semester_number}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 tracking-wider">
                      SEMESTER {sem.semester_number}
                    </span>
                    {hasData ? (
                      <span className="flex items-center space-x-1 text-[9px] font-sans font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm animate-fade-in">
                        <span>Official</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-sans font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <span>Custom</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-sans font-black text-slate-800 text-base sm:text-lg group-hover:text-[#0f2d59] transition-colors leading-snug">
                    {sem.semester_name}
                  </h4>
                  <div className="flex items-center text-xs text-slate-400 font-bold font-sans mt-4 group-hover:text-amber-500 transition-colors">
                    <span>Open Calculator</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic reference display of academic regulations */}
        <div className="pt-4">
          <GradeDisplay rules={gradeRules} />
        </div>
      </div>
    );
  }

  return (
    <div id="gpa-calculator-page" className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => {
              setSearchParams({});
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-500 hover:text-[#0f2d59] mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Semester Selection</span>
          </button>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
            {currentDept ? `Department of ${currentDept.department_code}` : 'GPA Calculator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Kamaraj College of Engineering and Technology (Autonomous)
          </p>
        </div>
      </div>

      {/* Semester Horizontal Tab Bar (Highly interactive, visual quick tab switcher) */}
      <div id="semester-tabs-selector" className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            setSearchParams({});
          }}
          className="px-3 py-2 text-slate-500 hover:text-[#0f2d59] font-sans font-bold text-xs bg-slate-50 hover:bg-slate-100 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 flex-shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Semesters</span>
        </button>
        <span className="h-6 w-[1px] bg-slate-200 flex-shrink-0" />
        {semesters.map((sem) => {
          const isActive = sem.id === currentSemesterId;
          const isSeeded = currentDept ? hasSeededData(currentDept.department_code, sem.semester_number) : false;
          return (
            <button
              key={sem.id}
              onClick={() => {
                setSearchParams({ semester: sem.id });
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black font-sans transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-[#0f2d59] shadow-inner ring-1 ring-amber-400'
                  : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{sem.semester_name}</span>
              {isSeeded && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#0f2d59]' : 'bg-emerald-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-sans">
          <span>❌ {error}</span>
        </div>
      )}

      {showSubjectsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono text-slate-500 animate-pulse">Loading curriculum subjects...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Middle Column: Subjects Forms */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base">
                  {activeSemesterObj?.semester_name || 'Semester'} Curriculum
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Select the earned grade for each theory and practical course below.
                </p>
              </div>
              <button
                id="btn-add-custom-subject"
                onClick={handleAddCustomSubject}
                className="flex items-center space-x-1 px-3 py-2 bg-[#0f2d59] text-white hover:bg-slate-800 text-xs font-sans font-bold rounded-lg transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Course</span>
              </button>
            </div>

            {subjectInputs.length === 0 ? (
              <div className="text-center py-12 px-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white space-y-4">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
                <div>
                  <h4 className="font-sans font-bold text-slate-800 text-sm sm:text-base">No subjects seeded for this semester</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    You can add subjects manually on-the-fly or use the syllabus import system in the Admin panel to seed official curriculum records.
                  </p>
                </div>
                <button
                  onClick={handleAddCustomSubject}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#0f2d59] font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Custom Course On-The-Fly</span>
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* THEORY & ELECTIVES SECTION */}
                {theorySubjects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-sans font-black text-[#0f2d59] text-base sm:text-lg border-l-4 border-amber-500 pl-3">
                      Theory Courses / Electives
                    </h3>
                    <div className="space-y-3">
                      {theorySubjects.map((input) => (
                        <div key={input.subjectId} className="relative group">
                          <SubjectRow
                            input={input}
                            gradeRules={gradeRules}
                            onChangeGrade={(grade) => handleGradeChange(input.subjectId, grade)}
                          />
                          {input.subjectId.startsWith('custom-') && (
                            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white p-1 rounded-md shadow-sm border border-slate-200">
                              <input
                                type="text"
                                value={input.subjectName}
                                onChange={(e) => handleUpdateCustomSubjectDetails(input.subjectId, e.target.value, input.credits, input.subjectType)}
                                className="text-xs font-sans border-none focus:outline-none focus:ring-0 p-0 w-32"
                                placeholder="Edit Name"
                              />
                              <select
                                value={input.credits}
                                onChange={(e) => handleUpdateCustomSubjectDetails(input.subjectId, input.subjectName, Number(e.target.value), input.subjectType)}
                                className="text-xs font-mono font-bold bg-slate-50 border-none p-0 focus:outline-none"
                              >
                                {[1, 2, 3, 4, 5].map((c) => (
                                  <option key={c} value={c}>{c} Cr</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleRemoveSubject(input.subjectId)}
                                className="text-rose-600 hover:text-rose-800 p-0.5"
                                title="Remove Subject"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRACTICALS & LABORATORY SECTION */}
                {practicalSubjects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-sans font-black text-[#0f2d59] text-base sm:text-lg border-l-4 border-amber-500 pl-3">
                      Practical Courses / Labs
                    </h3>
                    <div className="space-y-3">
                      {practicalSubjects.map((input) => (
                        <div key={input.subjectId} className="relative group">
                          <SubjectRow
                            input={input}
                            gradeRules={gradeRules}
                            onChangeGrade={(grade) => handleGradeChange(input.subjectId, grade)}
                          />
                          {input.subjectId.startsWith('custom-') && (
                            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white p-1 rounded-md shadow-sm border border-slate-200">
                              <input
                                type="text"
                                value={input.subjectName}
                                onChange={(e) => handleUpdateCustomSubjectDetails(input.subjectId, e.target.value, input.credits, input.subjectType)}
                                className="text-xs font-sans border-none focus:outline-none focus:ring-0 p-0 w-32"
                                placeholder="Edit Name"
                              />
                              <select
                                value={input.credits}
                                onChange={(e) => handleUpdateCustomSubjectDetails(input.subjectId, input.subjectName, Number(e.target.value), input.subjectType)}
                                className="text-xs font-mono font-bold bg-slate-50 border-none p-0 focus:outline-none"
                              >
                                {[1, 2, 3, 4, 5].map((c) => (
                                  <option key={c} value={c}>{c} Cr</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleRemoveSubject(input.subjectId)}
                                className="text-rose-600 hover:text-rose-800 p-0.5"
                                title="Remove Subject"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-150">
                  <button
                    id="btn-calculate-gpa"
                    onClick={handleCalculateGPA}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] font-black text-base rounded-xl transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-amber-200 cursor-pointer text-center"
                  >
                    Calculate GPA
                  </button>
                  <button
                    id="btn-clear-marks"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-slate-100 cursor-pointer text-center"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Results & Info Panels */}
          <div className="space-y-6">
            {gpaResult ? (
              <div className="space-y-6">
                <GPAResult
                  gpa={gpaResult.gpa}
                  totalCredits={gpaResult.totalCredits}
                  totalCreditPoints={gpaResult.totalCreditPoints}
                  onReset={handleReset}
                />
                <CalculationBreakdown
                  results={gpaResult.results}
                  gpa={gpaResult.gpa}
                />
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 space-y-2">
                <HelpCircle className="h-8 w-8 mx-auto text-slate-300" />
                <h4 className="font-sans font-bold text-slate-600 text-sm">Awaiting Calculation</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  Select your grade for each course above and click <strong>Calculate GPA</strong> to unlock your GPA score card and calculation breakdown.
                </p>
              </div>
            )}

            {/* Reference Grade Rules Display */}
            <GradeDisplay rules={gradeRules} />
          </div>
        </div>
      )}
    </div>
  );
}
