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
