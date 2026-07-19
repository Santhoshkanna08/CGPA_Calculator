import { Subject, SubjectType } from './database';

export interface SubjectInput {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  subjectType: SubjectType;
  selectedGrade?: string; // selected grade letter, e.g. 'S', 'A+', etc.
  gradePoint?: number;
}

export interface CalculatedSubjectResult {
  subjectCode: string;
  subjectName: string;
  credits: number;
  subjectType: SubjectType;
  grade: string;
  gradePoint: number;
  creditPoints: number;
}
