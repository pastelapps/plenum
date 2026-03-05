import { getAllCourses } from '@/lib/queries/courses';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ExternalLink, Pencil } from 'lucide-react';
import Link from 'next/link';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  published: { label: 'Publicado', variant: 'default' },
  draft: { label: 'Rascunho', variant: 'secondary' },
  archived: { label: 'Arquivado', variant: 'outline' },
};

const modalityMap: Record<string, string> = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Híbrido',
};

export default async function AdminDashboardPage() {
  const courses = await getAllCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} curso{courses.length !== 1 ? 's' : ''} cadastrado{courses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cursos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Nenhum curso cadastrado. Clique em &quot;Novo Curso&quot; para começar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const status = statusMap[course.status] || statusMap.draft;
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {course.title}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm font-mono">
                        {course.slug}
                      </TableCell>
                      <TableCell className="text-sm">
                        {modalityMap[course.modality] || course.modality}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(course.updated_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/cursos/${course.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          {course.status === 'published' && (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={`/cursos/${course.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
