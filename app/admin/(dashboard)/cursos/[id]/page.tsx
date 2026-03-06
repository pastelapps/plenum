import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/queries/courses';
import { getDesignSystems } from '@/lib/actions/courses';
import CourseForm from '@/components/admin/CourseForm';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) notFound();

  const designSystems = await getDesignSystems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
        <p className="text-sm text-gray-500 mt-1">
          {course.title}
        </p>
      </div>

      <Suspense>
        <CourseForm
          course={course}
          designSystems={designSystems}
        />
      </Suspense>
    </div>
  );
}
