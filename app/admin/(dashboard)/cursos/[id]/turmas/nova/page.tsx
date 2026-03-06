import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/queries/courses';
import { getInstructors } from '@/lib/actions/courses';
import TurmaForm from '@/components/admin/TurmaForm';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function NovaTurmaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, instructors] = await Promise.all([
    getCourseById(id),
    getInstructors(),
  ]);

  if (!course) notFound();

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
        <span className="text-gray-900 font-medium">Nova Turma</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nova Turma</h1>
        <p className="text-sm text-gray-500 mt-1">
          Criar nova turma para {course.title}
        </p>
      </div>

      <TurmaForm courseId={id} instructors={instructors} />
    </div>
  );
}
