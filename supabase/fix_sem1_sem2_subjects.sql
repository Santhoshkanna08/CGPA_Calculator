-- ============================================================
-- FIX: Delete old Sem 1 & Sem 2 subjects and re-insert correct ones
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Step 1: Delete ALL existing Sem 1 and Sem 2 subjects for all departments
DELETE FROM subjects
WHERE regulation_id = 'R21'
  AND semester_id IN ('sem-1', 'sem-2');

-- ============================================================
-- Step 2: Re-insert correct Sem 1 subjects (Common - all departments)
-- ============================================================
INSERT INTO subjects (regulation_id, department_id, semester_id, subject_code, subject_name, credits, subject_type) VALUES

-- ECE Sem 1
('R21', 'ECE', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'ECE', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'ECE', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'ECE', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'ECE', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'ECE', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'ECE', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'ECE', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'ECE', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'ECE', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- CSE Sem 1
('R21', 'CSE', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'CSE', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'CSE', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'CSE', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'CSE', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- IT Sem 1
('R21', 'IT', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'IT', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'IT', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'IT', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'IT', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'IT', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'IT', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'IT', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'IT', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'IT', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- AIDS Sem 1
('R21', 'AIDS', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'AIDS', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'AIDS', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'AIDS', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- EEE Sem 1
('R21', 'EEE', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'EEE', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'EEE', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'EEE', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'EEE', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'EEE', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'EEE', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'EEE', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'EEE', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'EEE', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- MECH Sem 1
('R21', 'MECH', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'MECH', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'MECH', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'MECH', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'MECH', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'MECH', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'MECH', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'MECH', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'MECH', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'MECH', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- MTRE Sem 1
('R21', 'MTRE', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'MTRE', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'MTRE', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'MTRE', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- BIOTECH Sem 1
('R21', 'BIOTECH', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'BIOTECH', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'BIOTECH', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'BIOTECH', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- CIVIL Sem 1
('R21', 'CIVIL', 'sem-1', 'SH2101', 'Technical English', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'MA2101', 'Matrices and Differential Calculus', 4, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'PH2101', 'Engineering Physics', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'CY2101', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'EM2101', 'Coding Techniques - I', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'GE2101', 'Principles of Engineering', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'GE2102', 'Heritage of Tamils', 1, 'THEORY'),
('R21', 'CIVIL', 'sem-1', 'EM2102', 'Coding Techniques - I Laboratory', 1, 'PRACTICAL'),
('R21', 'CIVIL', 'sem-1', 'MA2102', 'Mathematics Laboratory', 1, 'PRACTICAL'),
('R21', 'CIVIL', 'sem-1', 'PH2102', 'Physics Laboratory', 1, 'PRACTICAL'),

-- ============================================================
-- Step 3: Re-insert correct Sem 2 subjects (Common - all departments)
-- ============================================================

-- ECE Sem 2
('R21', 'ECE', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'ECE', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'ECE', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'ECE', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'ECE', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- CSE Sem 2
('R21', 'CSE', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'CSE', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'CSE', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'CSE', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'CSE', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- IT Sem 2
('R21', 'IT', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'IT', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'IT', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'IT', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'IT', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- AIDS Sem 2
('R21', 'AIDS', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'AIDS', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'AIDS', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- EEE Sem 2
('R21', 'EEE', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'EEE', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'EEE', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'EEE', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'EEE', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- MECH Sem 2
('R21', 'MECH', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'MECH', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'MECH', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'MECH', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'MECH', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- MTRE Sem 2
('R21', 'MTRE', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'MTRE', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'MTRE', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- BIOTECH Sem 2
('R21', 'BIOTECH', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'BIOTECH', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'BIOTECH', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- CIVIL Sem 2
('R21', 'CIVIL', 'sem-2', 'SH2151', 'Professional English', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'MA2151', 'Vector Calculus Complex Integration and Laplace Transforms', 4, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'PH2151', 'Physics of Non-Conventional Energy Sources', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'EM2151', 'Coding Techniques - II', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'GE2151', 'Engineering Graphics', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'GE2152', 'Environmental Science and Engineering', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'GE2154', 'Tamils and Technology', 1, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'CY2151', 'Chemistry Laboratory', 1, 'PRACTICAL'),
('R21', 'CIVIL', 'sem-2', 'EM2152', 'Coding Techniques - II Laboratory', 1, 'PRACTICAL'),
('R21', 'CIVIL', 'sem-2', 'GE2153', 'Engineering Practices Laboratory', 2, 'PRACTICAL');
