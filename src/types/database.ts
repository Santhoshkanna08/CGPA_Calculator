export interface Regulation {
  id: string; // e.g. 'R2021' or UUID
  name: string; // e.g. 'Regulation 2021'
  academic_year: string; // e.g. '2021-2022'
  is_active: boolean;
  created_at?: string;
}

export interface Department {
  id: string; // e.g. 'CSE' or UUID
  department_code: string; // e.g. 'CSE'
  department_name: string; // e.g. 'Computer Science and Engineering'
  degree_type: string; // e.g. 'B.E.' or 'B.Tech.'
  created_at?: string;
}

export interface Semester {
  id: string; // UUID or string like 'sem-1'
  semester_number: number; // e.g. 1, 2, ..., 8
  semester_name: string; // e.g. 'Semester I'
}

export type SubjectType = 'THEORY' | 'PRACTICAL' | 'ELECTIVE' | 'OTHER';

export interface Subject {
  id: string;
  regulation_id: string;
  department_id: string;
  semester_id: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  subject_type: SubjectType;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GradeRule {
  id: string;
  regulation_id: string;
  grade: string; // e.g. 'S', 'A+', 'A', etc.
  minimum_mark: number; // e.g. 91
  maximum_mark: number; // e.g. 100
  grade_point: number; // e.g. 10, 9, 8, etc.
  is_pass: boolean;
}

export interface SavedCalculation {
  id: string;
  user_id?: string;
  calculation_type: 'GPA' | 'CGPA';
  department_id: string;
  semester_id?: string;
  gpa?: number;
  cgpa?: number;
  calculation_data: any; // Raw JSON of inputs & results
  created_at?: string;
}
