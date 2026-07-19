import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Department, GradeRule, Regulation, Semester, Subject, SavedCalculation } from '../types/database';
import { KCET_DEPARTMENTS, KCET_SEMESTERS, KCET_REGULATIONS, DEFAULT_GRADE_RULES } from '../config/calculationConfig';

// Initialize Supabase if credentials exist
const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseEnabled = 
  supabaseUrl.length > 0 && 
  supabaseKey.length > 0 && 
  !supabaseUrl.includes('YOUR_') && 
  !supabaseKey.includes('YOUR_');

let supabaseServer: SupabaseClient | null = null;
if (isSupabaseEnabled) {
  try {
    supabaseServer = createClient(supabaseUrl, supabaseKey);
    console.log('[Server DB] Supabase Client Initialized Successfully.');
  } catch (err) {
    console.error('[Server DB] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[Server DB] Supabase variables missing or placeholder. Operating in local JSON fallback mode.');
}

const LOCAL_DB_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_PATH = path.join(LOCAL_DB_DIR, 'local_db.json');

// Real, verified KCET syllabus seeds for fallback / local mode
const SAMPLE_SUBJECTS: Subject[] = [
  // Semester 1 (Common Syllabus under R21)
  { id: 'sub-1', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'HS3151', subject_name: 'Professional English I', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-2', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'MA3151', subject_name: 'Matrices and Calculus', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-3', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'PH3151', subject_name: 'Engineering Physics', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-4', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'CY3151', subject_name: 'Engineering Chemistry', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-5', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'GE3151', subject_name: 'Problem Solving and Python Programming', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-6', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'GE3171', subject_name: 'Problem Solving and Python Programming Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-7', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'BS3171', subject_name: 'Physics and Chemistry Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },

  // ECE Sem 1
  { id: 'sub-ece-1', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'HS3151', subject_name: 'Professional English I', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-2', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'MA3151', subject_name: 'Matrices and Calculus', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-3', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'PH3151', subject_name: 'Engineering Physics', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-4', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'GE3151', subject_name: 'Problem Solving and Python Programming', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-5', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'GE3171', subject_name: 'Problem Solving and Python Programming Lab', credits: 2, subject_type: 'PRACTICAL', is_active: true },

  // CSE Semester 2
  { id: 'sub-8', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'HS3251', subject_name: 'Professional English II', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-9', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'MA3251', subject_name: 'Statistics and Numerical Methods', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-10', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'PH3256', subject_name: 'Physics for Information Science', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-11', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'BE3251', subject_name: 'Basic Electrical and Electronics Engineering', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-12', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'GE3251', subject_name: 'Engineering Graphics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-13', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'CS3251', subject_name: 'Programming in C', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-14', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'CS3271', subject_name: 'Programming in C Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-15', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'GE3271', subject_name: 'Engineering Practices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },

  // ECE Semester 2
  { id: 'sub-16', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'HS3251', subject_name: 'Professional English II', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-17', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'MA3251', subject_name: 'Statistics and Numerical Methods', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-18', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3251', subject_name: 'Circuits and Networks', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-19', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3252', subject_name: 'Electronic Devices', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-20', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'GE3251', subject_name: 'Engineering Graphics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-21', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3271', subject_name: 'Circuits and Devices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-22', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'GE3271', subject_name: 'Engineering Practices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },

  // IT Semester 3
  { id: 'sub-23', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'MA3354', subject_name: 'Discrete Mathematics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-24', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3351', subject_name: 'Digital Principles and Computer Organization', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-25', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3352', subject_name: 'Foundations of Data Science', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-26', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3301', subject_name: 'Data Structures', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-27', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3311', subject_name: 'Data Structures Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },

  // AIDS Semester 4
  { id: 'sub-28', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'MA3391', subject_name: 'Probability and Statistics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-29', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AL3452', subject_name: 'Introduction to Operating Systems', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-30', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3401', subject_name: 'Database Design and Management', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-31', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3451', subject_name: 'Machine Learning', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-32', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3411', subject_name: 'Database Design and Management Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-33', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3412', subject_name: 'Machine Learning Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },
];

// Helper interface for JSON schema
interface LocalSchema {
  regulations: Regulation[];
  departments: Department[];
  semesters: Semester[];
  subjects: Subject[];
  grade_rules: GradeRule[];
  saved_calculations: SavedCalculation[];
}

// In-memory cache + file sync helper
function readLocalDB(): LocalSchema {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    // Generate fresh local seed structures
    const initialRules: GradeRule[] = DEFAULT_GRADE_RULES.map((rule, idx) => ({
      id: `rule-${idx}`,
      ...rule,
    })) as GradeRule[];

    const freshDB: LocalSchema = {
      regulations: KCET_REGULATIONS,
      departments: KCET_DEPARTMENTS,
      semesters: KCET_SEMESTERS,
      subjects: SAMPLE_SUBJECTS,
      grade_rules: initialRules,
      saved_calculations: [],
    };

    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(freshDB, null, 2), 'utf-8');
    return freshDB;
  }

  try {
    const dataStr = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(dataStr) as LocalSchema;
  } catch (err) {
    console.error('Error reading local JSON database:', err);
    return {
      regulations: KCET_REGULATIONS,
      departments: KCET_DEPARTMENTS,
      semesters: KCET_SEMESTERS,
      subjects: SAMPLE_SUBJECTS,
      grade_rules: [],
      saved_calculations: [],
    };
  }
}

function writeLocalDB(data: LocalSchema) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON database:', err);
  }
}

// ==========================================
// DB SERVICE METHODS (Supabase OR Local File)
// ==========================================

export async function getRegulations(): Promise<Regulation[]> {
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('regulations').select('*');
    if (!error && data) return data as Regulation[];
    console.error('[Supabase Error] regulations:', error);
  }
  return readLocalDB().regulations;
}

export async function getDepartments(): Promise<Department[]> {
  let depts: Department[] = [];
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('departments').select('*');
    if (!error && data) {
      depts = data as Department[];
    } else {
      console.error('[Supabase Error] departments:', error);
      depts = readLocalDB().departments;
    }
  } else {
    depts = readLocalDB().departments;
  }

  const ece = depts.find(d => d.id === 'ECE');
  const cse = depts.find(d => d.id === 'CSE');
  const rest = depts.filter(d => d.id !== 'ECE' && d.id !== 'CSE');
  const result: Department[] = [];
  if (ece) result.push(ece);
  if (cse) result.push(cse);
  result.push(...rest);
  return result;
}

export async function getSemesters(): Promise<Semester[]> {
  if (supabaseServer) {
    const { data, error } = await supabaseServer.from('semesters').select('*').order('semester_number', { ascending: true });
    if (!error && data) return data as Semester[];
    console.error('[Supabase Error] semesters:', error);
  }
  return readLocalDB().semesters;
}

export async function getSubjects(
  regulation_id?: string,
  department_id?: string,
  semester_id?: string
): Promise<Subject[]> {
  if (supabaseServer) {
    let query = supabaseServer.from('subjects').select('*').eq('is_active', true);
    if (regulation_id) query = query.eq('regulation_id', regulation_id);
    if (department_id) query = query.eq('department_id', department_id);
    if (semester_id) query = query.eq('semester_id', semester_id);
    
    const { data, error } = await query;
    if (!error && data) return data as Subject[];
    console.error('[Supabase Error] subjects:', error);
  }

  // Local Filter
  const db = readLocalDB();
  let results = db.subjects.filter((s) => s.is_active);
  if (regulation_id) results = results.filter((s) => s.regulation_id === regulation_id);
  if (department_id) results = results.filter((s) => s.department_id === department_id);
  if (semester_id) results = results.filter((s) => s.semester_id === semester_id);
  return results;
}

export async function getGradeRules(regulation_id?: string): Promise<GradeRule[]> {
  if (supabaseServer) {
    let query = supabaseServer.from('grade_rules').select('*');
    if (regulation_id) query = query.eq('regulation_id', regulation_id);
    const { data, error } = await query;
    if (!error && data) return data as GradeRule[];
    console.error('[Supabase Error] grade_rules:', error);
  }
  
  const db = readLocalDB();
  if (regulation_id) {
    return db.grade_rules.filter((r) => r.regulation_id === regulation_id);
  }
  return db.grade_rules;
}

export async function saveSubject(subject: Partial<Subject>): Promise<Subject> {
  const finalSubject = {
    ...subject,
    id: subject.id || `sub-${Date.now()}`,
    is_active: subject.is_active !== false,
  } as Subject;

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('subjects')
      .upsert(finalSubject)
      .select()
      .single();
    if (!error && data) return data as Subject;
    console.error('[Supabase Error] saveSubject:', error);
  }

  // Local Save
  const db = readLocalDB();
  const existingIdx = db.subjects.findIndex((s) => s.id === finalSubject.id);
  if (existingIdx >= 0) {
    db.subjects[existingIdx] = { ...db.subjects[existingIdx], ...finalSubject };
  } else {
    db.subjects.push(finalSubject);
  }
  writeLocalDB(db);
  return finalSubject;
}

export async function deleteSubject(subjectId: string): Promise<void> {
  if (supabaseServer) {
    const { error } = await supabaseServer.from('subjects').delete().eq('id', subjectId);
    if (!error) return;
    console.error('[Supabase Error] deleteSubject:', error);
  }

  // Local Delete
  const db = readLocalDB();
  db.subjects = db.subjects.filter((s) => s.id !== subjectId);
  writeLocalDB(db);
}

export async function saveGradeRules(rules: GradeRule[]): Promise<void> {
  if (supabaseServer) {
    // Upsert individual rules or replace
    for (const rule of rules) {
      const { error } = await supabaseServer.from('grade_rules').upsert(rule);
      if (error) console.error('[Supabase Error] saveGradeRule individual:', error);
    }
    return;
  }

  // Local Save
  const db = readLocalDB();
  db.grade_rules = rules;
  writeLocalDB(db);
}

export async function saveCalculation(calc: Partial<SavedCalculation>): Promise<SavedCalculation> {
  const finalCalc = {
    ...calc,
    id: calc.id || `calc-${Date.now()}`,
    created_at: new Date().toISOString(),
  } as SavedCalculation;

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('saved_calculations')
      .insert(finalCalc)
      .select()
      .single();
    if (!error && data) return data as SavedCalculation;
    console.error('[Supabase Error] saveCalculation:', error);
  }

  const db = readLocalDB();
  db.saved_calculations.unshift(finalCalc);
  writeLocalDB(db);
  return finalCalc;
}

export async function getSavedCalculations(): Promise<SavedCalculation[]> {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('saved_calculations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data as SavedCalculation[];
    console.error('[Supabase Error] getSavedCalculations:', error);
  }

  return readLocalDB().saved_calculations;
}

export async function bulkImportSubjects(subjects: Omit<Subject, 'id'>[]): Promise<number> {
  const formattedSubjects: Subject[] = subjects.map((sub, idx) => ({
    ...sub,
    id: `imported-${Date.now()}-${idx}`,
    is_active: true,
  }));

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from('subjects')
      .upsert(formattedSubjects, { onConflict: 'regulation_id,department_id,semester_id,subject_code' })
      .select();
    if (!error && data) return data.length;
    console.error('[Supabase Error] bulkImportSubjects:', error);
  }

  // Local Save
  const db = readLocalDB();
  let count = 0;
  for (const sub of formattedSubjects) {
    const existingIdx = db.subjects.findIndex(
      (s) =>
        s.regulation_id === sub.regulation_id &&
        s.department_id === sub.department_id &&
        s.semester_id === sub.semester_id &&
        s.subject_code === sub.subject_code
    );
    if (existingIdx >= 0) {
      db.subjects[existingIdx] = sub;
    } else {
      db.subjects.push(sub);
    }
    count++;
  }
  writeLocalDB(db);
  return count;
}
