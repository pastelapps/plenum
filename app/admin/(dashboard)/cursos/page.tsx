import { getAllCoursesWithDates } from '@/lib/queries/courses';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CourseDashboardTable from '@/components/admin/CourseDashboardTable';

export default async function CursosPage() {
  const courses = await getAllCoursesWithDates();

  const totalTurmas = courses.reduce((acc, c) => acc + c.dates_preview.length, 0);
  const openTurmas  = courses.reduce(
    (acc, c) => acc + c.dates_preview.filter((d) => d.status === 'open').length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} curso{courses.length !== 1 ? 's' : ''} •{' '}
            {openTurmas} turma{openTurmas !== 1 ? 's' : ''} aberta{openTurmas !== 1 ? 's' : ''} de {totalTurmas}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cursos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Link>
        </Button>
      </div>

      <CourseDashboardTable courses={courses} />
    </div>
  );
}
