import React, { useEffect, useState } from 'react';
import { Shield, Key, Plus, Edit, Trash2, Database, Upload, Check, AlertTriangle, RefreshCw, Layers, User, Lock } from 'lucide-react';
import { fetchDepartments, fetchSemesters, fetchSubjects, createOrUpdateSubject, deleteSubject, importSubjectsCSV } from '../services/subjectService';
import { fetchGradeRules, updateGradeRules } from '../services/gradeService';
import { Department, Semester, Subject, GradeRule, SubjectType } from '../types/database';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Metadata states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [gradeRules, setGradeRules] = useState<GradeRule[]>([]);
  
  // Workspace states
  const [activeTab, setActiveTab] = useState<'syllabus' | 'grading' | 'import'>('syllabus');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ECE');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('sem-1');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Form states for creating/editing a subject
  const [editingSubject, setEditingSubject] = useState<Partial<Subject> | null>(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  // CSV Importer states
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [importing, setImporting] = useState(false);

  // Load baseline metadata on login
  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadMeta() {
      try {
        const [depts, sems, rules] = await Promise.all([
          fetchDepartments(),
          fetchSemesters(),
          fetchGradeRules('R21'),
        ]);
        setDepartments(depts);
        setSemesters(sems);
        setGradeRules(rules);
      } catch (err) {
        console.error('Error loading metadata in admin:', err);
      }
    }
    loadMeta();
  }, [isAuthenticated]);

  // Load filtered subjects for curriculum editor
  useEffect(() => {
    if (!isAuthenticated || !selectedDeptId || !selectedSemesterId) return;

    async function loadFilteredSubjects() {
      setLoadingSubjects(true);
      try {
        const data = await fetchSubjects('R21', selectedDeptId, selectedSemesterId);
        setSubjects(data);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadFilteredSubjects();
  }, [isAuthenticated, selectedDeptId, selectedSemesterId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Client-side credential check (admin panel for static Cloudflare Pages deployment)
    if (username === 'admin' && password === 'cgpa@987') {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  // Grade rules updating
  const handleGradeRuleChange = (idx: number, field: keyof GradeRule, value: any) => {
    setGradeRules((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveGradeRules = async () => {
    try {
      await updateGradeRules(gradeRules);
      alert('Grade rules saved successfully to the database!');
    } catch (err) {
      alert('Failed to save grade rules.');
    }
  };

  // Subject saving
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      const payload: Partial<Subject> = {
        ...editingSubject,
        regulation_id: 'R21',
        department_id: selectedDeptId,
        semester_id: selectedSemesterId,
      };

      await createOrUpdateSubject(payload);
      setShowSubjectForm(false);
      setEditingSubject(null);
      
      // Reload subjects list
      const data = await fetchSubjects('R21', selectedDeptId, selectedSemesterId);
      setSubjects(data);
    } catch (err: any) {
      alert(err.message || 'Error saving course.');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course from the syllabus?')) return;
    try {
      await deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error deleting course.');
    }
  };

  // CSV Importer
  const handleImportCSV = async () => {
    if (!csvText.trim()) {
      alert('Please paste valid CSV content.');
      return;
    }
    setImporting(true);
    setImportStatus(null);
    try {
      const res = await importSubjectsCSV(csvText);
      setImportStatus({
        success: true,
        message: `Successfully processed CSV! Imported / updated ${res.count} course records.`,
      });
      setCsvText('');
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: err.message || 'Processing failed. Double-check your column ordering.',
      });
    } finally {
      setImporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-auth-card" className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-sans font-black text-xl text-slate-800 tracking-tight">Database Administrator Login</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Unauthorized access is prohibited. Sign in using college coordinator credentials.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Username</label>
            <div className="relative">
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="college_coordinator"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                required
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                required
              />
              <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center space-x-1.5">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] font-bold rounded-xl transition-all shadow-md cursor-pointer text-center"
          >
            Access Control Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none">
            KCET Database Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Official curriculum coordinator controls. Modify active regulation subjects and scale bounds.
          </p>
        </div>

        {/* Console Mode Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
          <Database className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span>Console Session Live</span>
        </div>
      </div>

      {/* Admin Tab Nav */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'syllabus'
              ? 'border-amber-500 text-[#0f2d59] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Syllabus course editor
        </button>
        <button
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'grading'
              ? 'border-amber-500 text-[#0f2d59] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Grade ranges
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'import'
              ? 'border-amber-500 text-[#0f2d59] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Bulk CSV Import
        </button>
      </div>

      {/* Workspace Area */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6 animate-fade-in">
          {/* Editor Filter Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-500">Department</span>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-500">Semester</span>
                <select
                  value={selectedSemesterId}
                  onChange={(e) => setSelectedSemesterId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {semesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.semester_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingSubject({
                  subject_code: '',
                  subject_name: '',
                  credits: 3,
                  subject_type: 'THEORY',
                });
                setShowSubjectForm(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Course Record</span>
            </button>
          </div>

          {/* Create / Edit Form Modal-overlay */}
          {showSubjectForm && editingSubject && (
            <form onSubmit={handleSaveSubject} className="p-5 bg-slate-50 border-2 border-[#0f2d59] rounded-2xl space-y-4 animate-fade-in">
              <h3 className="font-sans font-bold text-[#0f2d59] text-base">
                {editingSubject.id ? 'Edit Curriculum Course' : 'Create Curriculum Course'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Subject Code</label>
                  <input
                    type="text"
                    value={editingSubject.subject_code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subject_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. MA3151"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#0f2d59] text-sm font-mono font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Course Name</label>
                  <input
                    type="text"
                    value={editingSubject.subject_name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subject_name: e.target.value })}
                    placeholder="e.g. Matrices and Calculus"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#0f2d59] text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Subject Credits</label>
                  <select
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg focus:outline-none text-sm font-sans"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((c) => (
                      <option key={c} value={c}>{c} Credits</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Classification Type</label>
                  <select
                    value={editingSubject.subject_type}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subject_type: e.target.value as SubjectType })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg focus:outline-none text-sm font-sans"
                  >
                    <option value="THEORY">THEORY</option>
                    <option value="PRACTICAL">PRACTICAL</option>
                    <option value="ELECTIVE">ELECTIVE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg cursor-pointer"
                  >
                    Save Course
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubjectForm(false);
                      setEditingSubject(null);
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Subjects Table list */}
          {loadingSubjects ? (
            <div className="flex items-center justify-center py-10 space-x-2 font-mono text-sm text-slate-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Updating registry...</span>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-sans text-xs sm:text-sm">
              No subjects currently loaded for this filter. Use the form above to add courses or paste CSV records in the Bulk Import tab.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm font-mono">
                <thead className="bg-slate-50 text-slate-500 font-sans font-semibold">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Name</th>
                    <th className="px-4 py-3 text-center">Credits</th>
                    <th className="px-4 py-3 text-center">Classification</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700 bg-white">
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-[#0f2d59]">{sub.subject_code}</td>
                      <td className="px-4 py-3 text-slate-800 font-sans font-medium">{sub.subject_name}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900">{sub.credits}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-sans font-bold">
                          {sub.subject_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingSubject(sub);
                              setShowSubjectForm(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                            title="Edit Subject"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(sub.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                            title="Delete Subject"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'grading' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base">Configure Active Grading Ranges</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Adjust the mark thresholds and respective grade points for calculations.</p>
            </div>
            <button
              onClick={handleSaveGradeRules}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              Save Grade Rules
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gradeRules.map((rule, idx) => {
              const isVerified = rule.minimum_mark >= 51;
              return (
                <div
                  key={rule.id || idx}
                  className={`p-4 rounded-xl border-2 space-y-3 bg-white ${
                    !isVerified ? 'border-rose-200 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-[#0f2d59]">{rule.grade}</span>
                    <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isVerified ? 'VERIFIED' : 'Requires verification'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Min Mark</label>
                      <input
                        type="number"
                        value={rule.minimum_mark}
                        onChange={(e) => handleGradeRuleChange(idx, 'minimum_mark', parseInt(e.target.value, 10))}
                        className="w-full px-2.5 py-1.5 text-center font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Max Mark</label>
                      <input
                        type="number"
                        value={rule.maximum_mark}
                        onChange={(e) => handleGradeRuleChange(idx, 'maximum_mark', parseInt(e.target.value, 10))}
                        className="w-full px-2.5 py-1.5 text-center font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Grade Pt</label>
                      <input
                        type="number"
                        step="0.1"
                        value={rule.grade_point}
                        onChange={(e) => handleGradeRuleChange(idx, 'grade_point', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-center font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-[#0f2d59]" />
              <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base">
                Curriculum CSV Bulk Importer
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              Coordinates can import entire semester syllabi in seconds. Paste CSV lines formatting exactly as:
            </p>
            
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] select-all shadow-inner border border-slate-800">
              {"regulation,department,semester,subject_code,subject_name,credits,subject_type"}<br />
              {"R21,CSE,1,MA3151,Matrices and Calculus,4,THEORY"}<br />
              {"R21,CSE,1,GE3171,Python Programming Lab,2,PRACTICAL"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase">Paste CSV Text Data</label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="regulation,department,semester,subject_code,subject_name,credits,subject_type&#10;R21,CSE,1,HS3151,Professional English I,3,THEORY&#10;R21,CSE,1,PH3151,Engineering Physics,3,THEORY"
              className="w-full h-64 p-4 font-mono text-xs border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0f2d59]"
            />
          </div>

          {importStatus && (
            <div className={`p-4 rounded-xl text-xs sm:text-sm font-sans flex items-start space-x-2 border ${
              importStatus.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {importStatus.success ? <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleImportCSV}
              disabled={importing}
              className="flex items-center space-x-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f2d59] font-black text-sm rounded-xl cursor-pointer disabled:opacity-50"
            >
              {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
              <span>Process and Import Subjects</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
