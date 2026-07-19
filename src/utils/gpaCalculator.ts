import { CalculatedSubjectResult } from '../types/subject';

/**
 * Calculates GPA from a list of calculated subject results.
 * GPA = Sum of (Credit × Grade Point) / Sum of Credits
 */
export function calculateGPA(
  results: CalculatedSubjectResult[],
  precision: number = 2
): { gpa: number; totalCredits: number; totalCreditPoints: number } {
  if (results.length === 0) {
    return { gpa: 0, totalCredits: 0, totalCreditPoints: 0 };
  }

  let totalCredits = 0;
  let totalCreditPoints = 0;

  for (const result of results) {
    totalCredits += result.credits;
    totalCreditPoints += result.credits * result.gradePoint;
  }

  const rawGpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
  
  // Round to the specified decimal precision
  const factor = Math.pow(10, precision);
  const roundedGpa = Math.round(rawGpa * factor) / factor;

  return {
    gpa: roundedGpa,
    totalCredits,
    totalCreditPoints,
  };
}
