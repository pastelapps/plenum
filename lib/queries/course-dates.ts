import { createClient } from '@/lib/supabase/server';
import type { CourseDate, CourseDateWithInstructor, Instructor } from '@/types/course';

/**
 * Get all course dates for a specific course (with instructor data).
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

  // Fetch instructors for each date
  const datesWithInstructors: CourseDateWithInstructor[] = await Promise.all(
    dates.map(async (cd: Record<string, unknown>) => {
      const { data: instructorData } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', cd.instructor_id as string)
        .single();

      return {
        ...cd,
        instructor: instructorData as unknown as Instructor,
      } as CourseDateWithInstructor;
    })
  );

  return datesWithInstructors;
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

  const datesWithInstructors: CourseDateWithInstructor[] = await Promise.all(
    dates.map(async (cd: Record<string, unknown>) => {
      const { data: instructorData } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', cd.instructor_id as string)
        .single();

      return {
        ...cd,
        instructor: instructorData as unknown as Instructor,
      } as CourseDateWithInstructor;
    })
  );

  return datesWithInstructors;
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
