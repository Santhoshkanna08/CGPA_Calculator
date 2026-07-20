import { Department, Regulation, Semester, Subject } from '../types/database';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  KCET_DEPARTMENTS,
  KCET_REGULATIONS,
  KCET_SEMESTERS,
} from '../config/calculationConfig';

// Static fallback subject data (in case Supabase is not configured)
const FALLBACK_SUBJECTS: Subject[] = [
  { id: 'sub-1', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'HS3151', subject_name: 'Professional English I', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-2', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'MA3151', subject_name: 'Matrices and Calculus', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-3', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'PH3151', subject_name: 'Engineering Physics', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-4', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'CY3151', subject_name: 'Engineering Chemistry', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-5', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'GE3151', subject_name: 'Problem Solving and Python Programming', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-6', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'GE3171', subject_name: 'Problem Solving and Python Programming Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-7', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-1', subject_code: 'BS3171', subject_name: 'Physics and Chemistry Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-ece-1', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'HS3151', subject_name: 'Professional English I', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-2', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'MA3151', subject_name: 'Matrices and Calculus', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-3', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'PH3151', subject_name: 'Engineering Physics', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-4', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'GE3151', subject_name: 'Problem Solving and Python Programming', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-ece-5', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-1', subject_code: 'GE3171', subject_name: 'Problem Solving and Python Programming Lab', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-8', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'HS3251', subject_name: 'Professional English II', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-9', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'MA3251', subject_name: 'Statistics and Numerical Methods', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-10', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'PH3256', subject_name: 'Physics for Information Science', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-11', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'BE3251', subject_name: 'Basic Electrical and Electronics Engineering', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-12', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'GE3251', subject_name: 'Engineering Graphics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-13', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'CS3251', subject_name: 'Programming in C', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-14', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'CS3271', subject_name: 'Programming in C Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-15', regulation_id: 'R21', department_id: 'CSE', semester_id: 'sem-2', subject_code: 'GE3271', subject_name: 'Engineering Practices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-16', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'HS3251', subject_name: 'Professional English II', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-17', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'MA3251', subject_name: 'Statistics and Numerical Methods', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-18', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3251', subject_name: 'Circuits and Networks', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-19', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3252', subject_name: 'Electronic Devices', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-20', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'GE3251', subject_name: 'Engineering Graphics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-21', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'EC3271', subject_name: 'Circuits and Devices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-22', regulation_id: 'R21', department_id: 'ECE', semester_id: 'sem-2', subject_code: 'GE3271', subject_name: 'Engineering Practices Laboratory', credits: 2, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-23', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'MA3354', subject_name: 'Discrete Mathematics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-24', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3351', subject_name: 'Digital Principles and Computer Organization', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-25', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3352', subject_name: 'Foundations of Data Science', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-26', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3301', subject_name: 'Data Structures', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-27', regulation_id: 'R21', department_id: 'IT', semester_id: 'sem-3', subject_code: 'CS3311', subject_name: 'Data Structures Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-28', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'MA3391', subject_name: 'Probability and Statistics', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-29', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AL3452', subject_name: 'Introduction to Operating Systems', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-30', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3401', subject_name: 'Database Design and Management', credits: 3, subject_type: 'THEORY', is_active: true },
  { id: 'sub-31', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3451', subject_name: 'Machine Learning', credits: 4, subject_type: 'THEORY', is_active: true },
  { id: 'sub-32', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3411', subject_name: 'Database Design and Management Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },
  { id: 'sub-33', regulation_id: 'R21', department_id: 'AIDS', semester_id: 'sem-4', subject_code: 'AD3412', subject_name: 'Machine Learning Laboratory', credits: 1.5, subject_type: 'PRACTICAL', is_active: true },
];

// =============================================
// In-memory caches
// =============================================
let cachedDepartments: Department[] | null = null;
let cachedSemesters: Semester[] | null = null;
let cachedRegulations: Regulation[] | null = null;

export async function fetchRegulations(): Promise<Regulation[]> {
  if (cachedRegulations) return cachedRegulations;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('regulations').select('*');
    if (!error && data) {
      cachedRegulations = data as Regulation[];
      return cachedRegulations;
    }
    console.warn('[subjectService] Supabase error fetching regulations:', error);
  }

  // Static fallback
  cachedRegulations = KCET_REGULATIONS;
  return cachedRegulations;
}

export async function fetchDepartments(): Promise<Department[]> {
  if (cachedDepartments) return cachedDepartments;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('departments').select('*');
    if (!error && data) {
      const depts = data as Department[];
      // Ensure ECE and CSE appear first
      const ece = depts.find(d => d.id === 'ECE');
      const cse = depts.find(d => d.id === 'CSE');
      const rest = depts.filter(d => d.id !== 'ECE' && d.id !== 'CSE');
      cachedDepartments = [...(ece ? [ece] : []), ...(cse ? [cse] : []), ...rest];
      return cachedDepartments;
    }
    console.warn('[subjectService] Supabase error fetching departments:', error);
  }

  // Static fallback
  cachedDepartments = KCET_DEPARTMENTS;
  return cachedDepartments;
}

export async function fetchSemesters(): Promise<Semester[]> {
  if (cachedSemesters) return cachedSemesters;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('semester_number', { ascending: true });
    if (!error && data) {
      cachedSemesters = data as Semester[];
      return cachedSemesters;
    }
    console.warn('[subjectService] Supabase error fetching semesters:', error);
  }

  // Static fallback
  cachedSemesters = KCET_SEMESTERS;
  return cachedSemesters;
}

export async function fetchSubjects(
  regulationId: string,
  departmentId: string,
  semesterId: string
): Promise<Subject[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('is_active', true)
      .eq('regulation_id', regulationId)
      .eq('department_id', departmentId)
      .eq('semester_id', semesterId);

    if (!error && data) return data as Subject[];
    console.warn('[subjectService] Supabase error fetching subjects:', error);
  }

  // Static fallback filter
  return FALLBACK_SUBJECTS.filter(
    s =>
      s.is_active &&
      s.regulation_id === regulationId &&
      s.department_id === departmentId &&
      s.semester_id === semesterId
  );
}

export async function createOrUpdateSubject(subject: Partial<Subject>): Promise<Subject> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Admin features require a live database connection.');
  }

  const { data, error } = await supabase
    .from('subjects')
    .upsert({ ...subject, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    if (error.code === '23505' || error.message?.includes('subjects_regulation_id_department_id_semester_id_subject_co_key')) {
      throw new Error('A course with this subject code already exists for the selected regulation, department, and semester.');
    }
    throw new Error(error.message || 'Failed to save subject');
  }
  return data as Subject;
}

export async function deleteSubject(subjectId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Admin features require a live database connection.');
  }

  const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
  if (error) throw new Error(error.message || 'Failed to delete subject');
}

export async function importSubjectsCSV(csvText: string): Promise<{ count: number }> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Admin features require a live database connection.');
  }

  const lines = csvText.split('\n');
  const parsedSubjects: Omit<Subject, 'id'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 5) continue;

    const regulation = parts[0]?.trim();
    const department = parts[1]?.trim();
    const semesterNum = parts[2]?.trim();
    const subjectCode = parts[3]?.trim();
    const subjectName = parts[4]?.trim();
    const credits = parseInt(parts[5]?.trim(), 10) || 0;
    const rawType = parts[6]?.trim().toUpperCase() || 'THEORY';
    const subject_type = (['THEORY', 'PRACTICAL', 'ELECTIVE', 'OTHER'] as const).includes(rawType as any)
      ? (rawType as Subject['subject_type'])
      : 'THEORY';

    if (!regulation || !department || !semesterNum || !subjectCode || !subjectName) continue;

    parsedSubjects.push({
      regulation_id: regulation,
      department_id: department,
      semester_id: `sem-${semesterNum}`,
      subject_code: subjectCode,
      subject_name: subjectName,
      credits,
      subject_type,
      is_active: true,
    });
  }

  if (parsedSubjects.length === 0) {
    throw new Error('No valid subjects were parsed from the CSV');
  }

  const { data, error } = await supabase
    .from('subjects')
    .upsert(parsedSubjects, {
      onConflict: 'regulation_id,department_id,semester_id,subject_code',
    })
    .select();

  if (error) throw new Error(error.message || 'Failed to import subjects');
  return { count: data?.length ?? parsedSubjects.length };
}
