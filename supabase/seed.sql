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

-- 5. Insert Sample Subjects (Regulation 2021 - Semesters I & II)
-- Semester I Subjects (Common across many departments)
INSERT INTO subjects (regulation_id, department_id, semester_id, subject_code, subject_name, credits, subject_type) VALUES
-- CSE Sem 1
('R21', 'CSE', 'sem-1', 'IP3115', 'Induction Programme', 0, 'OTHER'),
('R21', 'CSE', 'sem-1', 'HS3151', 'Professional English I', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'MA3151', 'Matrices and Calculus', 4, 'THEORY'),
('R21', 'CSE', 'sem-1', 'PH3151', 'Engineering Physics', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'CY3151', 'Engineering Chemistry', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'GE3151', 'Problem Solving and Python Programming', 3, 'THEORY'),
('R21', 'CSE', 'sem-1', 'GE3171', 'Problem Solving and Python Programming Laboratory', 2, 'PRACTICAL'),
('R21', 'CSE', 'sem-1', 'BS3171', 'Physics and Chemistry Laboratory', 2, 'PRACTICAL'),

-- CSE Sem 2
('R21', 'CSE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'CSE', 'sem-2', 'PH3256', 'Physics for Information Science', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'BE3251', 'Basic Electrical and Electronics Engineering', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'CSE', 'sem-2', 'CS3251', 'Programming in C', 3, 'THEORY'),
('R21', 'CSE', 'sem-2', 'CS3271', 'Programming in C Laboratory', 2, 'PRACTICAL'),
('R21', 'CSE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- ECE Sem 2
('R21', 'ECE', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3251', 'Circuits and Networks', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3252', 'Electronic Devices', 3, 'THEORY'),
('R21', 'ECE', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'ECE', 'sem-2', 'EC3271', 'Circuits and Devices Laboratory', 2, 'PRACTICAL'),
('R21', 'ECE', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL'),

-- AIDS Sem 2
('R21', 'AIDS', 'sem-2', 'HS3251', 'Professional English II', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'MA3251', 'Statistics and Numerical Methods', 4, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'PH3256', 'Physics for Information Science', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'AD3251', 'Data Structures Design', 3, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'GE3251', 'Engineering Graphics', 4, 'THEORY'),
('R21', 'AIDS', 'sem-2', 'AD3271', 'Data Structures Design Laboratory', 2, 'PRACTICAL'),
('R21', 'AIDS', 'sem-2', 'GE3271', 'Engineering Practices Laboratory', 2, 'PRACTICAL')
ON CONFLICT (regulation_id, department_id, semester_id, subject_code) DO NOTHING;
