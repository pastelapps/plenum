'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, GripVertical, Calendar, MapPin, Users } from 'lucide-react';
import { createCourseDate, updateCourseDate, deleteCourseDate } from '@/lib/actions/courses';
import type { CourseDate, ProgramDay, ProgramTopic, LocationExtra } from '@/types/course';

// ─── Types ──────────────────────────────────────────────
interface Instructor {
  id: string;
  name: string;
  role: string | null;
}

interface Props {
  programHeading: string; setProgramHeading: (v: string) => void;
  programDescription: string; setProgramDescription: (v: string) => void;
  courseId?: string;
  instructors: Instructor[];
  courseDates: CourseDate[];
}

// ─── Empty defaults ─────────────────────────────────────
const emptyProgramTopic: ProgramTopic = { text: '', children: [] };

const emptyProgramDay: ProgramDay = {
  tag: '',
  time: '',
  title: '',
  description: '',
  topics: [{ ...emptyProgramTopic }],
};

const emptyLocationExtra: LocationExtra = { label: '', value: '', icon: '' };

// ─── Component ──────────────────────────────────────────
export default function TabProgramacao({
  programHeading, setProgramHeading,
  programDescription, setProgramDescription,
  courseId,
  instructors,
  courseDates: initialDates,
}: Props) {
  const router = useRouter();
  const [dates, setDates] = useState<CourseDate[]>(initialDates);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);

  // ─── Turma CRUD ─────────────────────────────────────
  const handleAddTurma = async () => {
    if (!courseId) return;
    setSaving('new');
    const result = await createCourseDate({
      course_id: courseId,
      instructor_id: instructors[0]?.id || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      label: `Turma ${dates.length + 1}`,
      location_venue: null,
      location_address: null,
      location_map_embed: null,
      location_extra: [],
      program_days: [],
      max_students: null,
      status: 'open',
      sort_order: dates.length,
    });
    if (result.error) {
      setMessage({ id: 'new', type: 'error', text: result.error });
    } else if (result.data) {
      const newDate: CourseDate = {
        id: result.data.id,
        course_id: courseId,
        instructor_id: instructors[0]?.id || '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        label: `Turma ${dates.length + 1}`,
        location_venue: null,
        location_address: null,
        location_map_embed: null,
        location_extra: [],
        program_days: [],
        max_students: null,
        status: 'open',
        sort_order: dates.length,
        created_at: new Date().toISOString(),
      };
      setDates([...dates, newDate]);
      setExpandedId(result.data.id);
    }
    setSaving(null);
  };

  const handleSaveTurma = async (turma: CourseDate) => {
    setSaving(turma.id);
    setMessage(null);
    const { id, course_id, created_at, ...updateData } = turma;
    void course_id; void created_at;
    const result = await updateCourseDate(id, updateData);
    if (result.error) {
      setMessage({ id: turma.id, type: 'error', text: result.error });
    } else {
      setMessage({ id: turma.id, type: 'success', text: 'Turma salva!' });
      router.refresh();
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(null);
  };

  const handleDeleteTurma = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;
    setSaving(id);
    const result = await deleteCourseDate(id);
    if (result.error) {
      setMessage({ id, type: 'error', text: result.error });
    } else {
      setDates(dates.filter(d => d.id !== id));
      if (expandedId === id) setExpandedId(null);
      router.refresh();
    }
    setSaving(null);
  };

  const updateDate = (id: string, field: string, value: unknown) => {
    setDates(dates.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // ─── Program Days helpers ───────────────────────────
  const updateProgramDays = (turmaId: string, days: ProgramDay[]) => {
    updateDate(turmaId, 'program_days', days);
  };

  const addProgramDay = (turmaId: string) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days, { ...emptyProgramDay, tag: `Dia ${turma.program_days.length + 1}` }];
    updateProgramDays(turmaId, days);
  };

  const removeProgramDay = (turmaId: string, dayIdx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    updateProgramDays(turmaId, turma.program_days.filter((_, i) => i !== dayIdx));
  };

  const updateDayField = (turmaId: string, dayIdx: number, field: keyof ProgramDay, value: unknown) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days];
    days[dayIdx] = { ...days[dayIdx], [field]: value };
    updateProgramDays(turmaId, days);
  };

  // ─── Topics helpers ─────────────────────────────────
  const addTopic = (turmaId: string, dayIdx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days];
    days[dayIdx] = { ...days[dayIdx], topics: [...days[dayIdx].topics, { text: '', children: [] }] };
    updateProgramDays(turmaId, days);
  };

  const removeTopic = (turmaId: string, dayIdx: number, topicIdx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days];
    days[dayIdx] = { ...days[dayIdx], topics: days[dayIdx].topics.filter((_, i) => i !== topicIdx) };
    updateProgramDays(turmaId, days);
  };

  const updateTopicText = (turmaId: string, dayIdx: number, topicIdx: number, text: string) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days];
    const topics = [...days[dayIdx].topics];
    topics[topicIdx] = { ...topics[topicIdx], text };
    days[dayIdx] = { ...days[dayIdx], topics };
    updateProgramDays(turmaId, days);
  };

  const updateTopicChildren = (turmaId: string, dayIdx: number, topicIdx: number, children: string[]) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const days = [...turma.program_days];
    const topics = [...days[dayIdx].topics];
    topics[topicIdx] = { ...topics[topicIdx], children };
    days[dayIdx] = { ...days[dayIdx], topics };
    updateProgramDays(turmaId, days);
  };

  const addSubtopic = (turmaId: string, dayIdx: number, topicIdx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const children = [...turma.program_days[dayIdx].topics[topicIdx].children, ''];
    updateTopicChildren(turmaId, dayIdx, topicIdx, children);
  };

  const removeSubtopic = (turmaId: string, dayIdx: number, topicIdx: number, childIdx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const children = turma.program_days[dayIdx].topics[topicIdx].children.filter((_, i) => i !== childIdx);
    updateTopicChildren(turmaId, dayIdx, topicIdx, children);
  };

  const updateSubtopic = (turmaId: string, dayIdx: number, topicIdx: number, childIdx: number, value: string) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    const children = [...turma.program_days[dayIdx].topics[topicIdx].children];
    children[childIdx] = value;
    updateTopicChildren(turmaId, dayIdx, topicIdx, children);
  };

  // ─── Location Extra helpers ─────────────────────────
  const updateLocationExtra = (turmaId: string, extras: LocationExtra[]) => {
    updateDate(turmaId, 'location_extra', extras);
  };

  const addLocationExtra = (turmaId: string) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    updateLocationExtra(turmaId, [...turma.location_extra, { ...emptyLocationExtra }]);
  };

  const removeLocationExtra = (turmaId: string, idx: number) => {
    const turma = dates.find(d => d.id === turmaId);
    if (!turma) return;
    updateLocationExtra(turmaId, turma.location_extra.filter((_, i) => i !== idx));
  };

  // ─── Render ─────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle>Cabeçalho da Programação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input value={programHeading} onChange={(e) => setProgramHeading(e.target.value)} placeholder="Programação" />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={programDescription} onChange={(e) => setProgramDescription(e.target.value)} rows={2} placeholder="4 dias de imersão..." />
          </div>
        </CardContent>
      </Card>

      {/* Turmas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Turmas ({dates.length})
          </CardTitle>
          {courseId && (
            <Button variant="outline" size="sm" onClick={handleAddTurma} disabled={saving === 'new'}>
              <Plus className="w-4 h-4 mr-1" />
              {saving === 'new' ? 'Criando...' : 'Nova Turma'}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!courseId && (
            <p className="text-sm text-gray-500">Salve o curso primeiro para gerenciar as turmas.</p>
          )}

          {dates.map((turma) => {
            const isExpanded = expandedId === turma.id;
            const isSaving = saving === turma.id;
            const turmaMessage = message?.id === turma.id ? message : null;
            const instructorName = instructors.find(i => i.id === turma.instructor_id)?.name || 'Sem instrutor';

            return (
              <div key={turma.id} className="border rounded-lg bg-white overflow-hidden">
                {/* Header (collapsed) */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : turma.id)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="font-medium text-gray-900">{turma.label || 'Sem nome'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                        <span>{turma.start_date} → {turma.end_date}</span>
                        <span>|</span>
                        <span>{instructorName}</span>
                        <span>|</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          turma.status === 'open' ? 'bg-green-100 text-green-700' :
                          turma.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                          turma.status === 'closed' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {turma.status === 'open' ? 'Aberta' : turma.status === 'paused' ? 'Pausada' : turma.status === 'closed' ? 'Encerrada' : 'Cancelada'}
                        </span>
                        <span>|</span>
                        <span>{turma.program_days.length} dias</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t p-4 space-y-6 bg-gray-50/50">
                    {turmaMessage && (
                      <div className={`text-sm px-3 py-2 rounded ${turmaMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {turmaMessage.text}
                      </div>
                    )}

                    {/* ── Info básica ── */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Informações Básicas
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Label / Nome</Label>
                          <Input value={turma.label || ''} onChange={(e) => updateDate(turma.id, 'label', e.target.value)} placeholder="Turma Brasília - Março 2026" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Instrutor</Label>
                          <Select value={turma.instructor_id} onValueChange={(v) => updateDate(turma.id, 'instructor_id', v)}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              {instructors.map(inst => (
                                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Data Início</Label>
                          <Input type="date" value={turma.start_date} onChange={(e) => updateDate(turma.id, 'start_date', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Data Fim</Label>
                          <Input type="date" value={turma.end_date} onChange={(e) => updateDate(turma.id, 'end_date', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Máx. Alunos</Label>
                          <Input type="number" value={turma.max_students || ''} onChange={(e) => updateDate(turma.id, 'max_students', e.target.value ? Number(e.target.value) : null)} placeholder="Ilimitado" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Status</Label>
                          <Select value={turma.status} onValueChange={(v) => updateDate(turma.id, 'status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Aberta</SelectItem>
                              <SelectItem value="paused">Pausada</SelectItem>
                              <SelectItem value="closed">Encerrada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Ordem</Label>
                          <Input type="number" value={turma.sort_order} onChange={(e) => updateDate(turma.id, 'sort_order', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>

                    {/* ── Local ── */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Local
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Venue / Nome do Local</Label>
                          <Input value={turma.location_venue || ''} onChange={(e) => updateDate(turma.id, 'location_venue', e.target.value || null)} placeholder="Hotel Nacional" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Endereço</Label>
                          <Input value={turma.location_address || ''} onChange={(e) => updateDate(turma.id, 'location_address', e.target.value || null)} placeholder="SHS Quadra 1, Brasília/DF" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Google Maps Embed URL</Label>
                        <Input value={turma.location_map_embed || ''} onChange={(e) => updateDate(turma.id, 'location_map_embed', e.target.value || null)} placeholder="https://www.google.com/maps/embed?pb=..." />
                      </div>

                      {/* Location extras */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Informações Extras do Local</Label>
                          <Button variant="ghost" size="sm" onClick={() => addLocationExtra(turma.id)} className="h-7 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Info
                          </Button>
                        </div>
                        {turma.location_extra.map((extra, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <Input className="flex-1" placeholder="Label (ex: Estacionamento)" value={extra.label} onChange={(e) => {
                              const extras = [...turma.location_extra];
                              extras[idx] = { ...extras[idx], label: e.target.value };
                              updateLocationExtra(turma.id, extras);
                            }} />
                            <Input className="flex-1" placeholder="Valor (ex: Gratuito)" value={extra.value} onChange={(e) => {
                              const extras = [...turma.location_extra];
                              extras[idx] = { ...extras[idx], value: e.target.value };
                              updateLocationExtra(turma.id, extras);
                            }} />
                            <Input className="w-24" placeholder="Ícone" value={extra.icon || ''} onChange={(e) => {
                              const extras = [...turma.location_extra];
                              extras[idx] = { ...extras[idx], icon: e.target.value };
                              updateLocationExtra(turma.id, extras);
                            }} />
                            <Button variant="ghost" size="sm" onClick={() => removeLocationExtra(turma.id, idx)} className="h-9 px-2">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Programação / Ementa ── */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Programação ({turma.program_days.length} dias)
                        </h4>
                        <Button variant="outline" size="sm" onClick={() => addProgramDay(turma.id)} className="h-7 text-xs">
                          <Plus className="w-3 h-3 mr-1" /> Dia
                        </Button>
                      </div>

                      {turma.program_days.map((day, dayIdx) => (
                        <div key={dayIdx} className="border rounded-lg p-4 bg-white space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Dia {dayIdx + 1}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeProgramDay(turma.id, dayIdx)} className="h-7 px-2">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Tag (ex: Dia 1 — Terça, 10/03)</Label>
                              <Input value={day.tag} onChange={(e) => updateDayField(turma.id, dayIdx, 'tag', e.target.value)} placeholder="Dia 1 — Terça, 10/03" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Horário</Label>
                              <Input value={day.time} onChange={(e) => updateDayField(turma.id, dayIdx, 'time', e.target.value)} placeholder="14:00 às 18:00" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Título do Módulo</Label>
                            <Input value={day.title} onChange={(e) => updateDayField(turma.id, dayIdx, 'title', e.target.value)} placeholder="Fundamentos da Gestão de Projetos" />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Descrição</Label>
                            <Textarea value={day.description} onChange={(e) => updateDayField(turma.id, dayIdx, 'description', e.target.value)} rows={2} placeholder="Breve descrição do módulo..." />
                          </div>

                          {/* Topics */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-semibold">Tópicos ({day.topics.length})</Label>
                              <Button variant="ghost" size="sm" onClick={() => addTopic(turma.id, dayIdx)} className="h-6 text-xs">
                                <Plus className="w-3 h-3 mr-1" /> Tópico
                              </Button>
                            </div>

                            {day.topics.map((topic, topicIdx) => (
                              <div key={topicIdx} className="pl-3 border-l-2 border-gray-200 space-y-2">
                                <div className="flex gap-2 items-start">
                                  <Input
                                    className="flex-1"
                                    value={topic.text}
                                    onChange={(e) => updateTopicText(turma.id, dayIdx, topicIdx, e.target.value)}
                                    placeholder="Tópico principal"
                                  />
                                  <Button variant="ghost" size="sm" onClick={() => removeTopic(turma.id, dayIdx, topicIdx)} className="h-9 px-2">
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                  </Button>
                                </div>

                                {/* Sub-topics */}
                                <div className="pl-4 space-y-1">
                                  {topic.children.map((child, childIdx) => (
                                    <div key={childIdx} className="flex gap-2 items-center">
                                      <span className="text-gray-300 text-xs">↳</span>
                                      <Input
                                        className="flex-1 h-8 text-sm"
                                        value={child}
                                        onChange={(e) => updateSubtopic(turma.id, dayIdx, topicIdx, childIdx, e.target.value)}
                                        placeholder="Sub-tópico"
                                      />
                                      <Button variant="ghost" size="sm" onClick={() => removeSubtopic(turma.id, dayIdx, topicIdx, childIdx)} className="h-7 px-1.5">
                                        <Trash2 className="w-3 h-3 text-red-300" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button variant="ghost" size="sm" onClick={() => addSubtopic(turma.id, dayIdx, topicIdx)} className="h-6 text-xs text-gray-400 hover:text-gray-600">
                                    <Plus className="w-3 h-3 mr-1" /> Sub-tópico
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {turma.program_days.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">Nenhum dia de programação. Clique em &quot;+ Dia&quot; para adicionar.</p>
                      )}
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTurma(turma.id)} disabled={isSaving}>
                        <Trash2 className="w-4 h-4 mr-1" /> Excluir Turma
                      </Button>
                      <Button onClick={() => handleSaveTurma(turma)} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? 'Salvando...' : 'Salvar Turma'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {courseId && dates.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma turma cadastrada. Clique em &quot;Nova Turma&quot; para começar.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
