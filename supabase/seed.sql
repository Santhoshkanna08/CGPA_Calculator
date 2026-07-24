-- KCET GPA Calculator - Seed Data

-- 1. Insert Regulations
INSERT INTO regulations (id, name, academic_year, is_active) VALUES
('R21', 'Regulation 2021', '2021-2022', true),
('R20', 'Regulation 2020', '2020-2021', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Departments
INSERT INTO departments (id, department_code, department_name, degree_type) VALUES
('CSE', 'CSE', 'Computer Science and Engineering', 'B.E.'),
('IT', 'IT', 'Information Technology', 'B.Tech.'),
('AIDS', 'AI&DS', 'Artificial Intelligence and Data Science', 'B.Tech.'),
('ECE', 'ECE', 'Electronics and Communication Engineering', 'B.E.'),
('EEE', 'EEE', 'Electrical and Electronics Engineering', 'B.E.'),
('MECH', 'MECH', 'Mechanical Engineering', 'B.E.'),
('MTRE', 'MTRE', 'Mechatronics Engineering', 'B.E.'),
('BIOTECH', 'BIO TECH', 'Biotechnology', 'B.Tech.'),
('CIVIL', 'CIVIL', 'Civil Engineering', 'B.E.')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Semesters
INSERT INTO semesters (id, semester_number, semester_name) VALUES
('sem-1', 1, 'Semester I'),
('sem-2', 2, 'Semester II'),
('sem-3', 3, 'Semester III'),
('sem-4', 4, 'Semester IV'),
('sem-5', 5, 'Semester V'),
('sem-6', 6, 'Semester VI'),
('sem-7', 7, 'Semester VII'),
('sem-8', 8, 'Semester VIII')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Grade Rules (Regulation 2021)
-- Marks <= 50 are 'RA' (Re-Appearance/Fail) requiring official verification
INSERT INTO grade_rules (regulation_id, grade, minimum_mark, maximum_mark, grade_point, is_pass) VALUES
('R21', 'S', 91, 100, 10, true),
('R21', 'A+', 81, 90, 9, true),
('R21', 'A', 71, 80, 8, true),
('R21', 'B+', 66, 70, 7, true),
('R21', 'B', 61, 65, 6, true),
('R21', 'C+', 56, 60, 5, true),
('R21', 'C', 51, 55, 4, true),
('R21', 'RA', 0, 50, 0, false)
ON CONFLICT (regulation_id, grade) DO NOTHING;

-- 5. Insert Subjects
-- Sem 1 & Sem 2 are COMMON across all departments (ECE subject list)
-- ECE Sem 1 subjects applied to ALL departments
INSERT INTO subjects (regulation_id, department_id, semester_id, subject_code, subject_name, credits, subject_type) VALUES

-- ===================== SEM 1 (ALL DEPARTMENTS - ECE Common) =====================

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

-- ===================== SEM 2 (ALL DEPARTMENTS - ECE Common) =====================

-- ECE Sem 2
('R21', 'ECE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'ECE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- CSE Sem 2
('R21', 'CSE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'CSE', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'CSE', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'CSE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- IT Sem 2
('R21', 'IT', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'IT', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'IT', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'IT', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'IT', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- AIDS Sem 2
('R21', 'AIDS', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'AIDS', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- EEE Sem 2
('R21', 'EEE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'EEE', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'EEE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'EEE', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'EEE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- MECH Sem 2
('R21', 'MECH', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'MECH', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'MECH', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'MECH', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'MECH', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- MTRE Sem 2
('R21', 'MTRE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'MTRE', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'MTRE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- BIOTECH Sem 2
('R21', 'BIOTECH', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'BIOTECH', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'BIOTECH', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- CIVIL Sem 2
('R21', 'CIVIL', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'CIVIL', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'CIVIL', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL')
ON CONFLICT (regulation_id, department_id, semester_id, subject_code) DO NOTHING;
