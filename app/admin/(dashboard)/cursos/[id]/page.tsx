import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/queries/courses';
import { getDesignSystems, getInstructors } from '@/lib/actions/courses';
import { createClient } from '@/lib/supabase/server';
import CourseForm from '@/components/admin/CourseForm';
import type { CourseDate, Instructor } from '@/types/course';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) notFound();

  const [designSystems, instructors] = await Promise.all([
    getDesignSystems(),
    getInstructors(),
  ]);

  // Fetch course_dates for this course
  const supabase = await createClient();
  const { data: datesData } = await supabase
    .from('course_dates')
    .select('*')
    .eq('course_id', id)
    .order('sort_order', { ascending: true });

  // For each date, fetch instructor
  const dates = await Promise.all(
    (datesData || []).map(async (cd: Record<string, unknown>) => {
      const { data: instrData } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', cd.instructor_id as string)
        .single();

      return {
        ...cd,
        instructor: instrData as unknown as Instructor,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-sm text-gray-500 mt-1">
          {course.title}
        </p>
      </div>

      <CourseForm
        course={course}
        courseDates={dates as unknown as CourseDate[]}
        designSystems={designSystems}
        instructors={instructors}
      />
    </div>
  );
}
