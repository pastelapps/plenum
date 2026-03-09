'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Pencil } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────
interface Props {
  programHeading: string;
  setProgramHeading: (v: string) => void;
  programDescription: string;
  setProgramDescription: (v: string) => void;
  courseId?: string;
  turmasSummary: Array<{
    id: string;
    label: string;
    status: string;
    start_date: string;
    end_date: string;
  }>;
}

const statusMap: Record<string, { label: string; className: string }> = {
  open: { label: 'Aberta', className: 'bg-green-100 text-green-700' },
  paused: { label: 'Pausada', className: 'bg-amber-100 text-amber-700' },
  closed: { label: 'Encerrada', className: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
};

// ─── Component ──────────────────────────────────────────
export default function TabProgramacao({
  programHeading,
  setProgramHeading,
  programDescription,
  setProgramDescription,
  courseId,
  turmasSummary,
}: Props) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabecalho */}
      <Card>
        <CardHeader>
          <CardTitle>Cabecalho da Programacao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={programHeading}
              onChange={(e) => setProgramHeading(e.target.value)}
              placeholder="Programacao"
            />
          </div>
          <div className="space-y-2">
            <Label>Descricao</Label>
            <Textarea
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              rows={2}
              placeholder="4 dias de imersao..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Turmas (read-only list) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Turmas ({turmasSummary.length})
          </CardTitle>
          {courseId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/cursos/${courseId}/turmas/nova`}>
                <Plus className="w-4 h-4 mr-1" />
                Nova Turma
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {!courseId && (
            <p className="text-sm text-gray-500">
              Salve o curso primeiro para gerenciar as turmas.
            </p>
          )}

          {turmasSummary.map((turma) => {
            const st = statusMap[turma.status] || statusMap.open;
            return (
              <div
                key={turma.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.className}`}
                  >
                    {st.label}
                  </span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {turma.label || 'Sem nome'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(turma.start_date)} &rarr; {formatDate(turma.end_date)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/cursos/${courseId}/turmas/${turma.id}`}>
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Link>
                </Button>
              </div>
            );
          })}

          {courseId && turmasSummary.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhuma turma cadastrada. Clique em &quot;Nova Turma&quot; para comecar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
