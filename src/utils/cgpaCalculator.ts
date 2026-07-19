interface SemesterInput {
  semesterNumber: number;
  gpa: number;
  credits?: number; // Used for credit-weighted calculation
}

/**
 * Calculates CGPA based on selected method.
 * Method 1: Simple average of semester GPA values.
 * Method 2: Credit-weighted cumulative GPA.
 */
export function calculateCGPA(
  semesters: SemesterInput[],
  method: 'SIMPLE_AVERAGE' | 'CREDIT_WEIGHTED',
  precision: number = 2
): number {
  const activeSemesters = semesters.filter((s) => s.gpa > 0);

  if (activeSemesters.length === 0) {
    return 0;
  }

  let finalCgpa = 0;

  if (method === 'SIMPLE_AVERAGE') {
    const sumGpa = activeSemesters.reduce((sum, s) => sum + s.gpa, 0);
    finalCgpa = sumGpa / activeSemesters.length;
  } else {
    // CREDIT_WEIGHTED
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    for (const sem of activeSemesters) {
      // Fallback to average credit weight (e.g. 20 credits) if credits are not specified
      const credits = sem.credits && sem.credits > 0 ? sem.credits : 20;
      totalWeightedPoints += sem.gpa * credits;
      totalCredits += credits;
    }

    finalCgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  }

  // Round to the specified decimal precision
  const factor = Math.pow(10, precision);
  return Math.round(finalCgpa * factor) / factor;
}
