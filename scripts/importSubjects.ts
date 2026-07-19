import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment configurations
dotenv.config();

// Simple relative check for DB layer to support direct node execution
import { bulkImportSubjects } from '../src/services/serverDb';
import { SubjectType } from '../src/types/database';

/**
 * Runs bulk syllabus importing from a target CSV file
 * Usage: npx tsx scripts/importSubjects.ts [path_to_csv]
 */
async function runImporter() {
  const csvPathArg = process.argv[2] || './subject-import-template.csv';
  const resolvedPath = path.resolve(process.cwd(), csvPathArg);

  console.log(`[CSV Importer] Reading curriculum template from: ${resolvedPath}`);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`[Error] CSV file not found at ${resolvedPath}. Please specify a valid target.`);
    process.exit(1);
  }

  try {
    const csvContent = fs.readFileSync(resolvedPath, 'utf-8');
    const lines = csvContent.split('\n');
    const parsedSubjects: any[] = [];

    console.log(`[CSV Importer] Total lines read: ${lines.length}. Parsing columns...`);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple robust comma separation
      const parts = line.split(',');
      if (parts.length < 5) {
        console.warn(`[Warning] Skipping malformed row at index ${i}: "${line}"`);
        continue;
      }

      const regulation = parts[0]?.trim();
      const department = parts[1]?.trim();
      const semesterNum = parts[2]?.trim();
      const subjectCode = parts[3]?.trim();
      const subjectName = parts[4]?.trim();
      const creditsStr = parts[5]?.trim();
      const subjectTypeStr = parts[6]?.trim();

      if (!regulation || !department || !semesterNum || !subjectCode || !subjectName) {
        continue;
      }

      const credits = parseInt(creditsStr, 10) || 0;
      const semesterId = `sem-${semesterNum}`;
      const rawType = subjectTypeStr ? subjectTypeStr.toUpperCase() : 'THEORY';
      const type = ['THEORY', 'PRACTICAL', 'ELECTIVE', 'OTHER'].includes(rawType) 
        ? rawType 
        : 'THEORY';

      parsedSubjects.push({
        regulation_id: regulation,
        department_id: department,
        semester_id: semesterId,
        subject_code: subjectCode,
        subject_name: subjectName,
        credits,
        subject_type: type as SubjectType,
        is_active: true,
      });
    }

    if (parsedSubjects.length === 0) {
      console.error('[Error] No valid subjects were extracted. Aborting.');
      process.exit(1);
    }

    console.log(`[CSV Importer] Parsed ${parsedSubjects.length} valid courses. Committing to database layer...`);
    const count = await bulkImportSubjects(parsedSubjects);
    console.log(`[Success] Bulk insertion complete! Created/updated ${count} syllabus course entries in storage.`);
    process.exit(0);
  } catch (err: any) {
    console.error('[Error] CSV Import process failed:', err);
    process.exit(1);
  }
}

runImporter();
