import CourseForm from '@/components/admin/CourseForm';
import { getDesignSystems, getInstructors } from '@/lib/actions/courses';

export default async function NewCoursePage() {
  const [designSystems, instructors] = await Promise.all([
    getDesignSystems(),
    getInstructors(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Novo Curso</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os dados para criar uma nova landing page de curso.
        </p>
      </div>

      <CourseForm
        designSystems={designSystems}
        instructors={instructors}
      />
    </div>
  );
}
