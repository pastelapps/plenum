import { redirect } from 'next/navigation';
import { getPublishedCourses } from '@/lib/queries/courses';

/**
 * Homepage — redirects to the first published course.
 * When there are multiple courses, this can be changed to a listing page.
 */
export default async function Home() {
  const courses = await getPublishedCourses();

  if (courses.length > 0) {
    redirect(`/cursos/${courses[0].slug}`);
  }

  // Fallback: no published courses yet
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030d1f] text-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Instituto Plenum Brasil</h1>
        <p className="text-white/50 text-lg">
          Nenhum curso publicado no momento. Acesse o painel admin para criar um curso.
        </p>
      </div>
    </main>
  );
}
