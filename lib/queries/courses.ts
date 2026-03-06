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

  // 4. For each course_date, fetch the instructor
  const datesWithInstructors: CourseDateWithInstructor[] = await Promise.all(
    (courseDatesData || []).map(async (cd: Record<string, unknown>) => {
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

  // 2. Fetch all course_dates with instructor name
  const { data: allDates } = await supabase
    .from('course_dates')
    .select('*, instructor:instructors(id, name)')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true });

  const datesMap = new Map<string, CourseDatePreview[]>();
  for (const d of (allDates || [])) {
    const courseId = d.course_id as string;
    if (!datesMap.has(courseId)) datesMap.set(courseId, []);
    datesMap.get(courseId)!.push({
      id: d.id as string,
      label: (d.label as string) || '',
      start_date: d.start_date as string,
      end_date: d.end_date as string,
      status: d.status as string,
      location_venue: (d.location_venue as string) || '',
      instructor_name: (d.instructor as any)?.name || 'Sem instrutor',
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
  instructor_name: string;
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
