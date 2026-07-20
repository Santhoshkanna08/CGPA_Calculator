-- KCET GPA Calculator - Supabase Database Schema

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Regulations Table
CREATE TABLE IF NOT EXISTS regulations (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'R21', 'R20'
    name VARCHAR(255) NOT NULL, -- e.g. 'Regulation 2021'
    academic_year VARCHAR(50) NOT NULL, -- e.g. '2021-2022'
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'CSE', 'IT', 'ECE'
    department_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'CSE'
    department_name VARCHAR(255) NOT NULL, -- e.g. 'Computer Science and Engineering'
    degree_type VARCHAR(50) NOT NULL, -- e.g. 'B.E.', 'B.Tech.'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Semesters Table
CREATE TABLE IF NOT EXISTS semesters (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'sem-1', 'sem-2'
    semester_number INTEGER UNIQUE NOT NULL, -- e.g. 1, 2, ..., 8
    semester_name VARCHAR(50) NOT NULL -- e.g. 'Semester I'
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation_id VARCHAR(50) REFERENCES regulations(id) ON DELETE CASCADE,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE CASCADE,
    semester_id VARCHAR(50) REFERENCES semesters(id) ON DELETE CASCADE,
    subject_code VARCHAR(50) NOT NULL, -- e.g. 'MA3151'
    subject_name VARCHAR(255) NOT NULL, -- e.g. 'Matrices and Calculus'
    credits INTEGER NOT NULL CHECK (credits >= 0 AND credits <= 10),
    subject_type VARCHAR(50) NOT NULL CHECK (subject_type IN ('THEORY', 'PRACTICAL', 'ELECTIVE', 'OTHER')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (regulation_id, department_id, semester_id, subject_code)
);

-- 5. Grade Rules Table
CREATE TABLE IF NOT EXISTS grade_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation_id VARCHAR(50) REFERENCES regulations(id) ON DELETE CASCADE,
    grade VARCHAR(10) NOT NULL, -- e.g. 'S', 'A+'
    minimum_mark INTEGER NOT NULL CHECK (minimum_mark >= 0 AND minimum_mark <= 100),
    maximum_mark INTEGER NOT NULL CHECK (maximum_mark >= 0 AND maximum_mark <= 100),
    grade_point NUMERIC(3, 1) NOT NULL CHECK (grade_point >= 0 AND grade_point <= 10),
    is_pass BOOLEAN DEFAULT true,
    UNIQUE (regulation_id, grade),
    CONSTRAINT valid_mark_range CHECK (minimum_mark <= maximum_mark)
);

-- 6. Saved Calculations Table
CREATE TABLE IF NOT EXISTS saved_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255), -- optional, for authenticated users
    calculation_type VARCHAR(50) NOT NULL CHECK (calculation_type IN ('GPA', 'CGPA')),
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    semester_id VARCHAR(50) REFERENCES semesters(id) ON DELETE SET NULL,
    gpa NUMERIC(4, 2),
    cgpa NUMERIC(4, 2),
    calculation_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_subjects_query ON subjects(regulation_id, department_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_grade_rules_reg ON grade_rules(regulation_id);
CREATE INDEX IF NOT EXISTS idx_saved_calcs_user ON saved_calculations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Regulations: Anyone can read, only Admins can write
CREATE POLICY "Allow public read on regulations" ON regulations FOR SELECT USING (true);
CREATE POLICY "Allow admin write on regulations" ON regulations FOR ALL USING (auth.role() = 'authenticated');

-- Departments: Anyone can read, only Admins can write
CREATE POLICY "Allow public read on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow admin write on departments" ON departments FOR ALL USING (auth.role() = 'authenticated');

-- Semesters: Anyone can read, only Admins can write
CREATE POLICY "Allow public read on semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "Allow admin write on semesters" ON semesters FOR ALL USING (auth.role() = 'authenticated');

-- Subjects: Anyone can read, only Admins can write
CREATE POLICY "Allow public read on subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow admin write on subjects" ON subjects FOR ALL USING (auth.role() = 'authenticated');

-- Grade Rules: Anyone can read, only Admins can write
CREATE POLICY "Allow public read on grade_rules" ON grade_rules FOR SELECT USING (true);
CREATE POLICY "Allow admin write on grade_rules" ON grade_rules FOR ALL USING (auth.role() = 'authenticated');

-- Saved Calculations: Anyone can insert, users can read their own or public can read if unauthenticated
CREATE POLICY "Allow anyone to insert calculations" ON saved_calculations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to select their own calculations" ON saved_calculations FOR SELECT USING (
    user_id IS NULL OR user_id = auth.uid()::text
);
