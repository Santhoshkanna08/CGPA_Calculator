-- Run this SQL in your Supabase SQL Editor to update the grade_point column to support float/decimal values.
ALTER TABLE grade_rules ALTER COLUMN grade_point TYPE NUMERIC(3, 1);
