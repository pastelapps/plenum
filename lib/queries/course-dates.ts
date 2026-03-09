import { createClient } from '@/lib/supabase/server';
import type { CourseDate, CourseDateWithInstructor, Instructor } from '@/types/course';

/**
 * Helper: bulk-fetch instructors by IDs and return a Map.
 */
async function fetchInstructorsMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[]
): Promise<Map<string, Instructor>> {
  const map = new Map<string, Instructor>();
  if (ids.length === 0) return map;

  const { data } = await supabase
    .from('instructors')
    .select('*')
    .in('id', ids);

  for (const inst of (data || [])) {
    map.set((inst as any).id, inst as unknown as Instructor);
  }
  return map;
}

/**
 * Helper: attach instructors array to each course_date row.
 */
async function attachInstructors(
  supabase: Awaited<ReturnType<typeof createClient>>,
  dates: Record<string, unknown>[]
): Promise<CourseDateWithInstructor[]> {
  const allIds = [...new Set(
    dates.flatMap((cd) => (cd.instructor_ids as string[]) || [])
  )];

  const instructorsMap = await fetchInstructorsMap(supabase, allIds);

  return dates.map((cd) => ({
    ...cd,
    instructors: ((cd.instructor_ids as string[]) || [])
      .map(id => instructorsMap.get(id))
      .filter(Boolean) as Instructor[],
  } as CourseDateWithInstructor));
}

/**
 * Get all course dates for a specific course (with instructors data).
 * Returns dates sorted by sort_order then start_date.
 */
export async function getCourseDates(courseId: string): Promise<CourseDateWithInstructor[]> {
  const supabase = await createClient();

  const { data: dates, error } = await supabase
    .from('course_dates')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true });

  if (error || !dates) {
    console.error('Error fetching course dates:', error);
    return [];
  }

  return attachInstructors(supabase, dates as Record<string, unknown>[]);
}

/**
 * Get open course dates for a course (public-facing).
 * Only returns dates with status = 'open' and future start_date.
 */
export async function getOpenCourseDates(courseId: string): Promise<CourseDateWithInstructor[]> {
  const supabase = await createClient();

  const { data: dates, error } = await supabase
    .from('course_dates')
    .select('*')
    .eq('course_id', courseId)
    .eq('status', 'open')
    .gte('start_date', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true });

  if (error || !dates) {
    console.error('Error fetching open course dates:', error);
    return [];
  }

  return attachInstructors(supabase, dates as Record<string, unknown>[]);
}

/**
 * Get a single course date by ID (for admin editing).
 */
export async function getCourseDateById(id: string): Promise<CourseDate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('course_dates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as CourseDate;
}

/**
 * Get a single course date with its instructors (for turma edit page).
 */
export async function getCourseDateWithInstructors(id: string): Promise<CourseDateWithInstructor | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('course_dates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const results = await attachInstructors(supabase, [data as Record<string, unknown>]);
  return results[0] || null;
}
