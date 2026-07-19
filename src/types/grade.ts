export interface GradeRange {
  grade: string;
  minMark: number;
  maxMark: number;
  gradePoint: number;
  isPass: boolean;
}

export interface GPAResultData {
  gpa: number;
  totalCredits: number;
  totalCreditPoints: number;
  results: Array<{
    subjectCode: string;
    subjectName: string;
    credits: number;
    grade: string;
    gradePoint: number;
    creditPoints: number;
  }>;
}

export interface CGPAResultData {
  cgpa: number;
  calculationMethod: 'SIMPLE_AVERAGE' | 'CREDIT_WEIGHTED';
  semesters: Array<{
    semesterNumber: number;
    gpa: number;
    credits?: number; // optional, used if credit-weighted
  }>;
}
