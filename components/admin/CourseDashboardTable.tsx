'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Pencil,
  Copy,
  Pause,
  Play,
  Plus,
  MapPin,
  Users,
  Calendar,
  Eye,
} from 'lucide-react';
import type { CourseWithDatesPreview, CourseDatePreview } from '@/lib/queries/courses';
import { cloneCourseDate, toggleCourseDateStatus } from '@/lib/actions/courses';
import GeneratePdfButton from './GeneratePdfButton';

// ─── Status Maps ────────────────────────────────────────
const courseStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  published: { label: 'Publicado', variant: 'default' },
  draft: { label: 'Rascunho', variant: 'secondary' },
  archived: { label: 'Arquivado', variant: 'outline' },
};

const turmaStatusMap: Record<string, { label: string; className: string }> = {
  open: { label: 'Aberta', className: 'bg-green-100 text-green-700' },
  paused: { label: 'Pausada', className: 'bg-amber-100 text-amber-700' },
  closed: { label: 'Encerrada', className: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
};

const modalityMap: Record<string, string> = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Híbrido',
};

// ─── Component ──────────────────────────────────────────
interface Props {
  courses: CourseWithDatesPreview[];
}

export default function CourseDashboardTable({ courses }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClone = (turmaId: string) => {
    startTransition(async () => {
      const result = await cloneCourseDate(turmaId);
      if (result.error) {
        alert(`Erro ao clonar: ${result.error}`);
      } else {
        router.refresh();
      }
    });
  };

  const handleToggleStatus = (turmaId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'paused' : 'open';
    startTransition(async () => {
      const result = await toggleCourseDateStatus(turmaId, newStatus);
      if (result.error) {
        alert(`Erro: ${result.error}`);
      } else {
        router.refresh();
      }
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-3">
      {courses.map((course) => {
        const isExpanded = expandedIds.has(course.id);
        const courseStatus = courseStatusMap[course.status] || courseStatusMap.draft;
        const openCount = course.dates_preview.filter((d) => d.status === 'open').length;
        const totalCount = course.dates_preview.length;

        return (
          <div key={course.id} className="border rounded-xl bg-white overflow-hidden shadow-sm">
            {/* Course Row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
              onClick={() => toggleExpand(course.id)}
            >
              {/* Expand icon */}
              <div className="shrink-0 text-gray-400">
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>

              {/* Course info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                  <Badge variant={courseStatus.variant} className="shrink-0">{courseStatus.label}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="font-mono">{course.slug}</span>
                  <span>•</span>
                  <span>{modalityMap[course.modality] || course.modality}</span>
                  <span>•</span>
                  <span>Atualizado {new Date(course.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Turma count badge */}
              <div className="shrink-0 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{openCount}/{totalCount} turma{totalCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <GeneratePdfButton courseId={course.id} variant="compact" />
                <Button variant="outline" size="sm" className="text-gray-800 border-gray-300" asChild>
                  <Link href={`/admin/cursos/${course.id}`}>
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Editar
                  </Link>
                </Button>
                {course.status === 'published' && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/cursos/${course.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Turma List */}
            {isExpanded && (
              <div className="border-t bg-gray-50/50">
                {course.dates_preview.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-gray-400">
                    Nenhuma turma cadastrada.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {course.dates_preview.map((turma) => (
                      <TurmaRow
                        key={turma.id}
                        turma={turma}
                        courseId={course.id}
                        onClone={handleClone}
                        onToggleStatus={handleToggleStatus}
                        formatDate={formatDate}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                )}
                {/* Add turma button */}
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{totalCount} turma{totalCount !== 1 ? 's' : ''} cadastrada{totalCount !== 1 ? 's' : ''}</span>
                  <Button variant="outline" size="sm" className="text-gray-800 border-gray-300" asChild>
                    <Link href={`/admin/cursos/${course.id}/turmas/nova`}>
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Nova Turma
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nenhum curso cadastrado. Clique em &quot;Novo Curso&quot; para começar.
        </div>
      )}
    </div>
  );
}

// ─── Turma Row ──────────────────────────────────────────
function TurmaRow({
  turma,
  courseId,
  onClone,
  onToggleStatus,
  formatDate,
  isPending,
}: {
  turma: CourseDatePreview;
  courseId: string;
  onClone: (id: string) => void;
  onToggleStatus: (id: string, status: string) => void;
  formatDate: (d: string) => string;
  isPending: boolean;
}) {
  const status = turmaStatusMap[turma.status] || turmaStatusMap.open;

  return (
    <div className="flex items-center gap-4 px-6 py-3 pl-14 hover:bg-gray-50 transition-colors">
      {/* Status dot */}
      <div className="shrink-0">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* Turma info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-800 truncate">
          {turma.label || 'Sem nome'}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(turma.start_date)} → {formatDate(turma.end_date)}
          </span>
          {turma.location_venue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {turma.location_venue}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {turma.instructor_names[0]}{turma.instructor_names.length > 1 ? ` +${turma.instructor_names.length - 1}` : ''}
          </span>
          {turma.max_students && (
            <span>Máx: {turma.max_students}</span>
          )}
        </div>
      </div>

      {/* Turma actions */}
      <div className="shrink-0 flex items-center gap-1">
        {/* Toggle pause/open */}
        {(turma.status === 'open' || turma.status === 'paused') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(turma.id, turma.status)}
            disabled={isPending}
            title={turma.status === 'open' ? 'Pausar turma' : 'Reativar turma'}
          >
            {turma.status === 'open' ? (
              <Pause className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Play className="w-3.5 h-3.5 text-green-500" />
            )}
          </Button>
        )}

        {/* Ver PDF */}
        {turma.folder_pdf_url && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            title="Ver PDF"
          >
            <a href={turma.folder_pdf_url} target="_blank" rel="noopener noreferrer">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
            </a>
          </Button>
        )}

        {/* Clone */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClone(turma.id)}
          disabled={isPending}
          title="Clonar turma"
        >
          <Copy className="w-3.5 h-3.5 text-blue-500" />
        </Button>

        {/* Edit */}
        <Button variant="ghost" size="sm" className="text-gray-700" asChild>
          <Link href={`/admin/cursos/${courseId}/turmas/${turma.id}`}>
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Editar
          </Link>
        </Button>
      </div>
    </div>
  );
}
