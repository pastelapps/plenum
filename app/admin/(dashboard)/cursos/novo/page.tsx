import { Suspense } from 'react';
import CourseForm from '@/components/admin/CourseForm';
import { getDesignSystems } from '@/lib/actions/courses';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/user-roles';

export default async function NewCoursePage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Novo Curso</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os dados para criar uma nova landing page de curso.
        </p>
      </div>

      <Suspense>
        <CourseForm
          designSystems={designSystems}
          role={role}
        />
      </Suspense>
    </div>
  );
}
