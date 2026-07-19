import { Department, GradeRule, Regulation, Semester } from '../types/database';

export interface CalculationConfig {
  defaultCgpaMethod: 'SIMPLE_AVERAGE' | 'CREDIT_WEIGHTED';
  gpaPrecision: number;
  activeRegulationId: string;
}

export const APP_CONFIG: CalculationConfig = {
  defaultCgpaMethod: 'CREDIT_WEIGHTED', // default to credit-weighted cumulative GPA
  gpaPrecision: 2, // decimal places to round GPA/CGPA results
  activeRegulationId: 'R2021', // current default regulation
};

export const KCET_DEPARTMENTS: Department[] = [
  { id: 'ECE', department_code: 'ECE', department_name: 'Electronics and Communication Engineering', degree_type: 'B.E.' },
  { id: 'CSE', department_code: 'CSE', department_name: 'Computer Science and Engineering', degree_type: 'B.E.' },
  { id: 'IT', department_code: 'IT', department_name: 'Information Technology', degree_type: 'B.Tech.' },
  { id: 'AIDS', department_code: 'AI&DS', department_name: 'Artificial Intelligence and Data Science', degree_type: 'B.Tech.' },
  { id: 'EEE', department_code: 'EEE', department_name: 'Electrical and Electronics Engineering', degree_type: 'B.E.' },
  { id: 'MECH', department_code: 'MECH', department_name: 'Mechanical Engineering', degree_type: 'B.E.' },
  { id: 'MTRE', department_code: 'MTRE', department_name: 'Mechatronics Engineering', degree_type: 'B.E.' },
  { id: 'BIOTECH', department_code: 'BIO TECH', department_name: 'Biotechnology', degree_type: 'B.Tech.' },
  { id: 'CIVIL', department_code: 'CIVIL', department_name: 'Civil Engineering', degree_type: 'B.E.' },
];

export const KCET_REGULATIONS: Regulation[] = [
  { id: 'R21', name: 'Regulation 2021', academic_year: '2021-2022', is_active: true },
  { id: 'R20', name: 'Regulation 2020', academic_year: '2020-2021', is_active: false },
];

export const KCET_SEMESTERS: Semester[] = [
  { id: 'sem-1', semester_number: 1, semester_name: 'Semester I' },
  { id: 'sem-2', semester_number: 2, semester_name: 'Semester II' },
  { id: 'sem-3', semester_number: 3, semester_name: 'Semester III' },
  { id: 'sem-4', semester_number: 4, semester_name: 'Semester IV' },
  { id: 'sem-5', semester_number: 5, semester_name: 'Semester V' },
  { id: 'sem-6', semester_number: 6, semester_name: 'Semester VI' },
  { id: 'sem-7', semester_number: 7, semester_name: 'Semester VII' },
  { id: 'sem-8', semester_number: 8, semester_name: 'Semester VIII' },
];

/**
 * Official KCET mark-based grade rules configuration.
 * Notes: Marks below 51 are temporarily set as 'RA' (Re-Appearance) with 0 grade points.
 * Values below 51 are explicitly marked as placeholders that "Require official verification".
 */
export const DEFAULT_GRADE_RULES: Omit<GradeRule, 'id'>[] = [
  { regulation_id: 'R21', grade: 'S', minimum_mark: 91, maximum_mark: 100, grade_point: 10, is_pass: true },
  { regulation_id: 'R21', grade: 'A+', minimum_mark: 81, maximum_mark: 90, grade_point: 9, is_pass: true },
  { regulation_id: 'R21', grade: 'A', minimum_mark: 71, maximum_mark: 80, grade_point: 8, is_pass: true },
  { regulation_id: 'R21', grade: 'B+', minimum_mark: 66, maximum_mark: 70, grade_point: 7, is_pass: true },
  { regulation_id: 'R21', grade: 'B', minimum_mark: 61, maximum_mark: 65, grade_point: 6, is_pass: true },
  { regulation_id: 'R21', grade: 'C+', minimum_mark: 56, maximum_mark: 60, grade_point: 5, is_pass: true },
  { regulation_id: 'R21', grade: 'C', minimum_mark: 51, maximum_mark: 55, grade_point: 4, is_pass: true },
  
  // Rules below 51 are placeholders requiring official college handbook verification
  { regulation_id: 'R21', grade: 'RA', minimum_mark: 0, maximum_mark: 50, grade_point: 0, is_pass: false }, // RA = Re-Appearance / Fail (Requires official verification)
];
