import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/queries/courses';
import { getDesignSystems } from '@/lib/actions/courses';
import CourseForm from '@/components/admin/CourseForm';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/user-roles';

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) notFound();

  const [designSystems, supabase] = await Promise.all([
    getDesignSystems(),
    createClient(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();
  let role: UserRole = 'dev';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role) role = profile.role as UserRole;
  }

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
          role={role}
        />
      </Suspense>
    </div>
  );
}
