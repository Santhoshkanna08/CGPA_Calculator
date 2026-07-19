import { GradeRule, SavedCalculation } from '../types/database';
import { supabase, isSupabaseConfigured } from './supabase';
import { DEFAULT_GRADE_RULES } from '../config/calculationConfig';

// In-memory cache for grade rules
let cachedGradeRules: Record<string, GradeRule[]> = {};

export async function fetchGradeRules(regulationId: string): Promise<GradeRule[]> {
  if (cachedGradeRules[regulationId]) return cachedGradeRules[regulationId];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('grade_rules')
      .select('*')
      .eq('regulation_id', regulationId);

    if (!error && data) {
      cachedGradeRules[regulationId] = data as GradeRule[];
      return cachedGradeRules[regulationId];
    }
    console.warn('[gradeService] Supabase error fetching grade rules:', error);
  }

  // Static fallback from config
  const fallback = DEFAULT_GRADE_RULES
    .filter(r => r.regulation_id === regulationId)
    .map((r, idx) => ({ ...r, id: `rule-${idx}` })) as GradeRule[];

  cachedGradeRules[regulationId] = fallback;
  return fallback;
}

export async function updateGradeRules(rules: GradeRule[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Admin features require a live database connection.');
  }

  for (const rule of rules) {
    const { error } = await supabase.from('grade_rules').upsert(rule);
    if (error) throw new Error(error.message || 'Failed to save grade rule');
  }

  // Invalidate cache for affected regulation
  const affectedIds = [...new Set(rules.map(r => r.regulation_id))];
  affectedIds.forEach(id => {
    if (id) delete cachedGradeRules[id];
  });
}

export async function saveCalculation(calc: Partial<SavedCalculation>): Promise<SavedCalculation> {
  const finalCalc = {
    ...calc,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert(finalCalc)
      .select()
      .single();

    if (!error && data) return data as SavedCalculation;
    console.warn('[gradeService] Supabase error saving calculation:', error);
  }

  // If Supabase not available, return local object (won't persist across sessions)
  return {
    ...finalCalc,
    id: `calc-${Date.now()}`,
  } as SavedCalculation;
}

export async function fetchSavedCalculations(): Promise<SavedCalculation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('saved_calculations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) return data as SavedCalculation[];
    console.warn('[gradeService] Supabase error fetching calculations:', error);
  }

  // Return empty array as fallback (no local storage for saved calcs)
  return [];
}
