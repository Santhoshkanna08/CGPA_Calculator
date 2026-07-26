import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Library, Sparkles } from 'lucide-react';
import { fetchDepartments } from '../services/subjectService';
import { Department } from '../types/database';

export default function Home() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const deptsData = await fetchDepartments();
        setDepartments(deptsData);
      } catch (err: any) {
        console.error('Error loading home data:', err);
        setError('Could not establish connection with database. Operating in fallback mode.');
      } finally {
        setLoading(false);
      }
    }
    loadMetadata();
  }, []);

  return (
    <div id="home-page-container" className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* College Branding Hero */}
      <div className="text-center space-y-5">
        <div className="relative inline-flex items-center justify-center p-0.5 mb-1">
          {/* Animated glow background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-amber-300 to-[#0f2d59] rounded-full blur-md opacity-45 animate-pulse" />
          
          <div className="relative p-5 bg-gradient-to-br from-[#0f2d59] to-[#1a4a87] rounded-full text-amber-400 shadow-2xl border-2 border-amber-400/80 transform hover:scale-105 transition-all duration-300">
            <GraduationCap className="h-12 w-12 sm:h-14 sm:w-14 filter drop-shadow-[0_2px_5px_rgba(245,158,11,0.4)]" />
            
            {/* Version Badge Layered */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f2d59] text-xs font-mono font-black px-2.5 py-0.5 rounded-full border-2 border-[#0f2d59] shadow-lg">
              v2.0
            </div>
          </div>
        </div>

        <h2 className="font-sans font-black text-3xl sm:text-5xl text-slate-900 tracking-tight leading-none flex items-center justify-center gap-2 flex-wrap">
          <span>KCET CGPA Calculator</span>
          <span className="bg-gradient-to-r from-[#0f2d59] to-[#1c5396] text-amber-400 text-sm font-mono font-black px-2.5 py-1 rounded-xl shadow-md border-2 border-amber-500 tracking-wider">
            2.0
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
          Welcome! Easily calculate your Semester GPA and Cumulative CGPA based on the latest autonomous curriculum guidelines. Simply select your department below to begin.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs sm:text-sm font-sans flex items-center space-x-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono text-slate-500 animate-pulse">Loading departments...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Step 1: Select Department */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#0f2d59] text-white text-xs font-bold font-mono">1</span>
              <h3 className="font-sans font-bold text-slate-800 text-lg sm:text-xl">
                Select Your Department
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  id={`btn-dept-card-${dept.id}`}
                  onClick={() => navigate(`/gpa/${dept.id}`)}
                  className="p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer border-slate-200 hover:border-[#0f2d59] hover:bg-slate-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 font-bold">{dept.degree_type}</span>
                    <Library className="h-4 w-4 text-slate-400 group-hover:text-[#0f2d59]" />
                  </div>
                  <h4 className="font-sans font-black text-slate-800 text-base sm:text-lg mt-1 tracking-tight leading-tight">
                    {dept.department_code}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans mt-1 line-clamp-1 leading-normal">
                    {dept.department_name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer notes */}
      <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-500 font-sans leading-relaxed">
        <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 block mb-1">Authentic Curriculums Loaded</strong>
          For immediate evaluation, the database contains pre-loaded official curriculum data for <strong>Semester I & II of CSE and ECE</strong> and <strong>Semester IV of AI&DS</strong> as defined by the Autonomous syllabus specifications. For other semesters, use the <strong>Admin Panel</strong> to add subjects or click any semester and add custom subjects on-the-fly!
        </div>
      </div>
    </div>
  );
}
