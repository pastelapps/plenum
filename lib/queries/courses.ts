import { createClient } from '@/lib/supabase/server';
import type { Course, CourseWithRelations, CourseDateWithInstructor, Instructor } from '@/types/course';
import type { DesignSystem } from '@/types/design-system';

/**
 * Get a single course by slug (with design system and course dates + instructors).
 * Used by the dynamic page: app/cursos/[slug]/page.tsx
 */
export async function getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
  const supabase = await createClient();

  // 1. Fetch the course
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError || !courseData) return null;

  const course = courseData as unknown as Course;

  // 2. Fetch design system (if linked)
  let designSystem: DesignSystem | null = null;
  if (course.design_system_id) {
    const { data: ds } = await supabase
      .from('design_systems')
      .select('*')
      .eq('id', course.design_system_id)
      .single();
    designSystem = (ds as unknown as DesignSystem) ?? null;
  } else {
    // Fallback: use the default design system
    const { data: ds } = await supabase
      .from('design_systems')
      .select('*')
      .eq('is_default', true)
      .single();
    designSystem = (ds as unknown as DesignSystem) ?? null;
  }

  // 3. Fetch course dates
  const { data: courseDatesData } = await supabase
    .from('course_dates')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true });

  // 4. Collect all instructor IDs and bulk-fetch
  const allInstructorIds = [...new Set(
    (courseDatesData || []).flatMap((cd: Record<string, unknown>) =>
      (cd.instructor_ids as string[]) || []
    )
  )];

  const instructorsMap = new Map<string, Instructor>();
  if (allInstructorIds.length > 0) {
    const { data: instructorsData } = await supabase
      .from('instructors')
      .select('*')
      .in('id', allInstructorIds);
    for (const inst of (instructorsData || [])) {
      instructorsMap.set((inst as any).id, inst as unknown as Instructor);
    }
  }

  // 5. Map instructors to dates
  const datesWithInstructors: CourseDateWithInstructor[] = (courseDatesData || []).map(
    (cd: Record<string, unknown>) => ({
      ...cd,
      instructors: ((cd.instructor_ids as string[]) || [])
        .map(id => instructorsMap.get(id))
        .filter(Boolean) as Instructor[],
    } as CourseDateWithInstructor)
  );

  return {
    ...course,
    design_system: designSystem,
    dates: datesWithInstructors,
  };
}

/**
 * Get all published courses (for listing pages and generateStaticParams).
 */
export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching published courses:', error);
    return [];
  }

  return (data || []) as unknown as Course[];
}

/**
 * Get all courses (for admin dashboard).
 */
export async function getAllCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching all courses:', error);
    return [];
  }

  return (data || []) as unknown as Course[];
}

/**
 * Get all courses with their course_dates count + status summary.
 * Used by the admin dashboard for the expandable turma view.
 */
export async function getAllCoursesWithDates(): Promise<CourseWithDatesPreview[]> {
  const supabase = await createClient();

  // 1. Fetch all courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('updated_at', { ascending: false });

  if (coursesError || !courses) {
    console.error('Error fetching courses with dates:', coursesError);
    return [];
  }

  // 2. Fetch all course_dates (no FK join — instructor_ids is an array)
  const { data: allDates } = await supabase
    .from('course_dates')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true });

  // 3. Collect all instructor IDs and bulk-fetch names
  const allInstructorIds = [...new Set(
    (allDates || []).flatMap((d: Record<string, unknown>) =>
      (d.instructor_ids as string[]) || []
    )
  )];

  const instructorNamesMap = new Map<string, string>();
  if (allInstructorIds.length > 0) {
    const { data: instructorsData } = await supabase
      .from('instructors')
      .select('id, name')
      .in('id', allInstructorIds);
    for (const inst of (instructorsData || [])) {
      instructorNamesMap.set((inst as any).id, (inst as any).name);
    }
  }

  const datesMap = new Map<string, CourseDatePreview[]>();
  for (const d of (allDates || [])) {
    const courseId = d.course_id as string;
    if (!datesMap.has(courseId)) datesMap.set(courseId, []);
    const ids = (d.instructor_ids as string[]) || [];
    datesMap.get(courseId)!.push({
      id: d.id as string,
      label: (d.label as string) || '',
      start_date: d.start_date as string,
      end_date: d.end_date as string,
      status: d.status as string,
      location_venue: (d.location_venue as string) || '',
      instructor_names: ids.length > 0
        ? ids.map(id => instructorNamesMap.get(id) || 'Sem instrutor')
        : ['Sem instrutor'],
      max_students: d.max_students as number | null,
    });
  }

  return (courses as unknown as Course[]).map((course) => ({
    ...course,
    dates_preview: datesMap.get(course.id) || [],
  }));
}

/** Lightweight turma preview for dashboard */
export interface CourseDatePreview {
  id: string;
  label: string;
  start_date: string;
  end_date: string;
  status: string;
  location_venue: string;
  instructor_names: string[];
  max_students: number | null;
}

/** Course with lightweight dates for dashboard */
export interface CourseWithDatesPreview extends Course {
  dates_preview: CourseDatePreview[];
}

/**
 * Get a single course by ID (for admin editing).
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as Course;
}
