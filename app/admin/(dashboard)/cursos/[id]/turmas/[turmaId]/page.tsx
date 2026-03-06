import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/queries/courses';
import { getCourseDateWithInstructors } from '@/lib/queries/course-dates';
import { getInstructors } from '@/lib/actions/courses';
import TurmaForm from '@/components/admin/TurmaForm';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CourseDate } from '@/types/course';

export default async function EditTurmaPage({
  params,
}: {
  params: Promise<{ id: string; turmaId: string }>;
}) {
  const { id, turmaId } = await params;
  const [course, turmaData, instructors] = await Promise.all([
    getCourseById(id),
    getCourseDateWithInstructors(turmaId),
    getInstructors(),
  ]);

  if (!course) notFound();
  if (!turmaData) notFound();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/cursos" className="hover:text-gray-700 transition-colors">
          Cursos
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/admin/cursos/${id}`} className="hover:text-gray-700 transition-colors">
          {course.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">
          {turmaData.label || 'Editar Turma'}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {turmaData.label || 'Editar Turma'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Editar turma do curso {course.title}
        </p>
      </div>

      <TurmaForm
        courseId={id}
        turma={turmaData as unknown as CourseDate}
        instructors={instructors}
      />
    </div>
  );
}
