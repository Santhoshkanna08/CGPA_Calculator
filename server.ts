import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import {
  getRegulations,
  getDepartments,
  getSemesters,
  getSubjects,
  getGradeRules,
  saveSubject,
  deleteSubject,
  saveGradeRules,
  saveCalculation,
  getSavedCalculations,
  bulkImportSubjects,
  isSupabaseEnabled,
} from './src/services/serverDb';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // API ENDPOINTS
  // ==========================================

  // Database Connection Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      supabase: isSupabaseEnabled ? 'connected' : 'local_json_fallback',
      timestamp: new Date().toISOString(),
    });
  });

  // Get Academic Regulations
  app.get('/api/regulations', async (req, res) => {
    try {
      const data = await getRegulations();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch regulations' });
    }
  });

  // Get Departments
  app.get('/api/departments', async (req, res) => {
    try {
      const data = await getDepartments();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch departments' });
    }
  });

  // Get Semesters
  app.get('/api/semesters', async (req, res) => {
    try {
      const data = await getSemesters();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch semesters' });
    }
  });

  // Get Subjects by query filters
  app.get('/api/subjects', async (req, res) => {
    const { regulation_id, department_id, semester_id } = req.query;
    try {
      const data = await getSubjects(
        regulation_id as string,
        department_id as string,
        semester_id as string
      );
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch subjects' });
    }
  });

  // Get Grade Rules
  app.get('/api/grade-rules', async (req, res) => {
    const { regulation_id } = req.query;
    try {
      const data = await getGradeRules(regulation_id as string);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch grade rules' });
    }
  });

  // Save GPA/CGPA Calculation results (unauthenticated history log)
  app.post('/api/saved-calculations', async (req, res) => {
    try {
      const data = await saveCalculation(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save calculation' });
    }
  });

  // Retrieve Saved Calculations History
  app.get('/api/saved-calculations', async (req, res) => {
    try {
      const data = await getSavedCalculations();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve calculations history' });
    }
  });

  // ==========================================
  // ADMIN API ENDPOINTS (Supabase Auth proxy / Simple Local pass for preview testing)
  // ==========================================

  // Create or Update Subject
  app.post('/api/admin/subjects', async (req, res) => {
    try {
      const subject = req.body;
      if (!subject.subject_code || !subject.subject_name || !subject.regulation_id || !subject.department_id || !subject.semester_id) {
        return res.status(400).json({ error: 'Missing required subject parameters' });
      }
      const data = await saveSubject(subject);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save subject' });
    }
  });

  // Delete Subject
  app.delete('/api/admin/subjects/:id', async (req, res) => {
    try {
      await deleteSubject(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete subject' });
    }
  });

  // Configure Grade Rules
  app.post('/api/admin/grade-rules', async (req, res) => {
    try {
      const { rules } = req.body;
      if (!Array.isArray(rules)) {
        return res.status(400).json({ error: 'Invalid grade rules collection' });
      }
      await saveGradeRules(rules);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save grade rules' });
    }
  });

  // Import subjects from CSV text
  app.post('/api/admin/import-subjects', async (req, res) => {
    try {
      const { csv } = req.body;
      if (!csv || typeof csv !== 'string') {
        return res.status(400).json({ error: 'CSV data is required' });
      }

      const lines = csv.split('\n');
      const parsedSubjects: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple comma split
        const parts = line.split(',');
        if (parts.length < 5) continue;

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
          subject_type: type,
          is_active: true,
        });
      }

      if (parsedSubjects.length === 0) {
        return res.status(400).json({ error: 'No valid subjects were parsed from the CSV text' });
      }

      const count = await bulkImportSubjects(parsedSubjects);
      res.json({ success: true, count });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to import subjects CSV' });
    }
  });

  // Simple Admin Login bypass & Auth validation proxy
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Standard bypass for preview testing if Supabase Auth is not fully wired yet
    if (username === 'admin' && password === 'cgpa@987') {
      return res.json({
        success: true,
        user: { email: 'work.santhosh.fsd@gmail.com', role: 'admin' },
        token: 'dev-token-secret-12345',
      });
    }
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  });

  // ==========================================
  // VITE / STATIC FILE SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server Startup] Running in Development Mode. Mounted Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server Startup] Running in Production Mode. Serving static assets.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KCET API SERVER] Running on port http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Crash] Failed to start backend server:', err);
});
