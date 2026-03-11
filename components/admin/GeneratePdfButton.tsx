'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Loader2, ExternalLink, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TurmaOption {
  id: string;
  label: string | null;
  start_date: string;
  status: string;
  folder_pdf_url: string | null;
}

interface Props {
  courseId: string;
  /** Compact mode for dashboard row (inline) vs full mode for TabMidias */
  variant?: 'compact' | 'full';
  /** Callback when PDF is generated */
  onGenerated?: (url: string) => void;
}

export default function GeneratePdfButton({
  courseId,
  variant = 'compact',
  onGenerated,
}: Props) {
  const [turmas, setTurmas] = useState<TurmaOption[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  // Get existing PDF URL for selected turma
  const selectedTurmaData = turmas.find((t) => t.id === selectedTurma);
  const existingPdfUrl = selectedTurmaData?.folder_pdf_url || null;

  // Fetch turmas when selector is opened
  const fetchTurmas = async () => {
    if (turmas.length > 0) return; // Already loaded
    setLoadingTurmas(true);
    try {
      const supabase = createClient();
      // folder_pdf_url is a new column - cast to bypass stale generated types
      const { data } = await supabase
        .from('course_dates')
        .select('id, label, start_date, status, folder_pdf_url')
        .eq('course_id', courseId)
        .order('start_date', { ascending: false }) as { data: TurmaOption[] | null };

      setTurmas(data || []);
      // Auto-select first open turma
      const firstOpen = data?.find((t) => t.status === 'open');
      if (firstOpen) setSelectedTurma(firstOpen.id);
      else if (data && data.length > 0) setSelectedTurma(data[0].id);
    } catch (err) {
      console.error('Error fetching turmas:', err);
    } finally {
      setLoadingTurmas(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTurma) return;
    setLoading(true);
    setResult(null);

    try {
      const supabase = createClient();

      // Force a session refresh to ensure we have a valid (non-expired) token
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      let accessToken: string;

      if (refreshError || !refreshData.session) {
        console.warn('refreshSession failed, trying getSession...', refreshError?.message);
        // Fallback: try cached session (may still work if not expired)
        const { data: { session: cachedSession } } = await supabase.auth.getSession();
        if (!cachedSession) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        accessToken = cachedSession.access_token;
      } else {
        accessToken = refreshData.session.access_token;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-folder-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_id: courseId,
            course_date_id: selectedTurma,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar PDF');
      }

      setResult({ success: true, url: data.url });

      // Update local turma data with new PDF URL
      setTurmas((prev) =>
        prev.map((t) =>
          t.id === selectedTurma ? { ...t, folder_pdf_url: data.url } : t,
        ),
      );

      onGenerated?.(data.url);
    } catch (err) {
      setResult({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' });
    } finally {
      setLoading(false);
    }
  };

  // Compact variant: button that opens selector inline
  if (variant === 'compact') {
    if (!showSelector) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(true);
            fetchTurmas();
          }}
          className="text-gray-800 border-gray-300"
        >
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          PDF
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {loadingTurmas ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="Turma..." />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label || formatDate(t.start_date)} {t.status !== 'open' ? `(${t.status})` : ''} {t.folder_pdf_url ? '📄' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={loading || !selectedTurma || loadingTurmas}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
          <span className="ml-1">{loading ? 'Gerando...' : existingPdfUrl ? 'Regerar' : 'Gerar'}</span>
        </Button>

        {/* Show existing or just-generated PDF link */}
        {(result?.success && result.url) || existingPdfUrl ? (
          <a
            href={result?.url || existingPdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir PDF"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </a>
        ) : null}

        {result?.error && (
          <span className="text-xs text-red-500 max-w-32 truncate" title={result.error}>
            {result.error}
          </span>
        )}

        <button
          className="text-xs text-gray-400 hover:text-gray-600"
          onClick={() => {
            setShowSelector(false);
            setResult(null);
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  // Full variant: for TabMidias
  // Auto-fetch turmas on mount
  useEffect(() => { fetchTurmas(); }, [courseId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger>
              <SelectValue placeholder={loadingTurmas ? 'Carregando turmas...' : 'Selecione uma turma'} />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label || formatDate(t.start_date)} {t.status !== 'open' ? `(${t.status})` : ''} {t.folder_pdf_url ? '📄' : ''}
                </SelectItem>
              ))}
              {turmas.length === 0 && !loadingTurmas && (
                <div className="px-3 py-2 text-sm text-gray-400">Nenhuma turma encontrada</div>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !selectedTurma}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Gerando PDF...' : existingPdfUrl ? 'Regerar Folder PDF' : 'Gerar Folder PDF'}
        </Button>
      </div>

      {result?.error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {result.error}
        </div>
      )}

      {/* Show existing PDF for selected turma or just-generated */}
      {(result?.success && result.url) || existingPdfUrl ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700">
              {result?.success ? 'PDF gerado com sucesso!' : 'PDF já gerado para esta turma'}
            </p>
            <a
              href={result?.url || existingPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline truncate block"
            >
              {result?.url || existingPdfUrl}
            </a>
          </div>
          <a
            href={result?.url || existingPdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 text-green-500" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
