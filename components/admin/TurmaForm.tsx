'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Calendar, MapPin, Users, ArrowLeft, GripVertical } from 'lucide-react';
import { createCourseDate, updateCourseDate, deleteCourseDate, upsertInstructor } from '@/lib/actions/courses';
import type { CourseDate, ProgramDay, ProgramTopic, LocationExtra } from '@/types/course';
import ImageUploadField from '@/components/admin/ImageUploadField';

// ─── Types ──────────────────────────────────────────────
interface Props {
  courseId: string;
  turma?: CourseDate;
  instructors: Array<{
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    photo_url: string | null;
    social_links: Array<{ platform: string; url: string; handle: string }>;
    status: string;
  }>;
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
export default function TurmaForm({ courseId, turma, instructors: initialInstructors }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = !!turma;

  // Tab control
  const urlTab = searchParams.get('tab') || 'geral';
  const [activeTab, setActiveTab] = useState(urlTab);

  // State
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Geral fields ──
  const [label, setLabel] = useState(turma?.label || '');
  const [startDate, setStartDate] = useState(turma?.start_date || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(turma?.end_date || new Date().toISOString().split('T')[0]);
  const [maxStudents, setMaxStudents] = useState<number | null>(turma?.max_students ?? null);
  const [status, setStatus] = useState<string>(turma?.status || 'open');
  const [sortOrder, setSortOrder] = useState(turma?.sort_order ?? 0);

  // ── Local fields ──
  const [locationVenue, setLocationVenue] = useState(turma?.location_venue || '');
  const [locationAddress, setLocationAddress] = useState(turma?.location_address || '');
  const [locationMapEmbed, setLocationMapEmbed] = useState(turma?.location_map_embed || '');
  const [locationExtra, setLocationExtra] = useState<LocationExtra[]>(turma?.location_extra || []);

  // ── Programacao fields ──
  const [programDays, setProgramDays] = useState<ProgramDay[]>(turma?.program_days || []);

  // ── Professores fields ──
  const [instructorIds, setInstructorIds] = useState<string[]>(turma?.instructor_ids || []);
  const [allInstructors, setAllInstructors] = useState(initialInstructors);
  const [showNewInstructor, setShowNewInstructor] = useState(false);
  const [newInstructorName, setNewInstructorName] = useState('');
  const [newInstructorRole, setNewInstructorRole] = useState('');
  const [newInstructorBio, setNewInstructorBio] = useState('');
  const [newInstructorPhotoUrl, setNewInstructorPhotoUrl] = useState('');
  const [creatingInstructor, setCreatingInstructor] = useState(false);

  // ── Save ──
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const data: Record<string, unknown> = {
      course_id: courseId,
      label: label || null,
      start_date: startDate,
      end_date: endDate,
      max_students: maxStudents,
      status,
      sort_order: sortOrder,
      location_venue: locationVenue || null,
      location_address: locationAddress || null,
      location_map_embed: locationMapEmbed || null,
      location_extra: locationExtra,
      program_days: programDays,
      instructor_ids: instructorIds,
    };

    if (isEditing && turma) {
      const { course_id, ...updateData } = data;
      void course_id;
      const result = await updateCourseDate(turma.id, updateData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Turma atualizada com sucesso!' });
        router.refresh();
      }
    } else {
      const result = await createCourseDate(data);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Turma criada com sucesso!' });
        router.push(`/admin/cursos/${courseId}`);
      }
    }

    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!turma) return;
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;
    setDeleting(true);
    const result = await deleteCourseDate(turma.id);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
      setDeleting(false);
    } else {
      router.push(`/admin/cursos/${courseId}`);
    }
  };

  // ── Program Days helpers ──
  const addProgramDay = () => {
    setProgramDays([...programDays, { ...emptyProgramDay, tag: `Dia ${programDays.length + 1}` }]);
  };

  const removeProgramDay = (dayIdx: number) => {
    setProgramDays(programDays.filter((_, i) => i !== dayIdx));
  };

  const updateDayField = (dayIdx: number, field: keyof ProgramDay, value: unknown) => {
    const days = [...programDays];
    days[dayIdx] = { ...days[dayIdx], [field]: value };
    setProgramDays(days);
  };

  const addTopic = (dayIdx: number) => {
    const days = [...programDays];
    days[dayIdx] = { ...days[dayIdx], topics: [...days[dayIdx].topics, { text: '', children: [] }] };
    setProgramDays(days);
  };

  const removeTopic = (dayIdx: number, topicIdx: number) => {
    const days = [...programDays];
    days[dayIdx] = { ...days[dayIdx], topics: days[dayIdx].topics.filter((_, i) => i !== topicIdx) };
    setProgramDays(days);
  };

  const updateTopicText = (dayIdx: number, topicIdx: number, text: string) => {
    const days = [...programDays];
    const topics = [...days[dayIdx].topics];
    topics[topicIdx] = { ...topics[topicIdx], text };
    days[dayIdx] = { ...days[dayIdx], topics };
    setProgramDays(days);
  };

  const updateTopicChildren = (dayIdx: number, topicIdx: number, children: string[]) => {
    const days = [...programDays];
    const topics = [...days[dayIdx].topics];
    topics[topicIdx] = { ...topics[topicIdx], children };
    days[dayIdx] = { ...days[dayIdx], topics };
    setProgramDays(days);
  };

  const addSubtopic = (dayIdx: number, topicIdx: number) => {
    const children = [...programDays[dayIdx].topics[topicIdx].children, ''];
    updateTopicChildren(dayIdx, topicIdx, children);
  };

  const removeSubtopic = (dayIdx: number, topicIdx: number, childIdx: number) => {
    const children = programDays[dayIdx].topics[topicIdx].children.filter((_, i) => i !== childIdx);
    updateTopicChildren(dayIdx, topicIdx, children);
  };

  const updateSubtopic = (dayIdx: number, topicIdx: number, childIdx: number, value: string) => {
    const children = [...programDays[dayIdx].topics[topicIdx].children];
    children[childIdx] = value;
    updateTopicChildren(dayIdx, topicIdx, children);
  };

  // ── Location Extra helpers ──
  const addLocationExtraItem = () => {
    setLocationExtra([...locationExtra, { ...emptyLocationExtra }]);
  };

  const removeLocationExtraItem = (idx: number) => {
    setLocationExtra(locationExtra.filter((_, i) => i !== idx));
  };

  // ── Instructor helpers ──
  const toggleInstructor = (id: string) => {
    setInstructorIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleCreateInstructor = async () => {
    if (!newInstructorName.trim()) return;
    setCreatingInstructor(true);
    const result = await upsertInstructor({
      name: newInstructorName.trim(),
      role: newInstructorRole.trim() || null,
      bio: newInstructorBio.trim() || null,
      photo_url: newInstructorPhotoUrl.trim() || null,
      social_links: [],
      status: 'active',
    });
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.data) {
      const newInst = {
        id: result.data.id,
        name: newInstructorName.trim(),
        role: newInstructorRole.trim() || null,
        bio: newInstructorBio.trim() || null,
        photo_url: newInstructorPhotoUrl.trim() || null,
        social_links: [] as Array<{ platform: string; url: string; handle: string }>,
        status: 'active',
      };
      setAllInstructors([...allInstructors, newInst]);
      setInstructorIds([...instructorIds, newInst.id]);
      setNewInstructorName('');
      setNewInstructorRole('');
      setNewInstructorBio('');
      setNewInstructorPhotoUrl('');
      setShowNewInstructor(false);
    }
    setCreatingInstructor(false);
  };

  // Sort instructors: selected first, then alphabetical
  const sortedInstructors = [...allInstructors].sort((a, b) => {
    const aSelected = instructorIds.includes(a.id);
    const bSelected = instructorIds.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      {message && (
        <div className={`text-sm px-4 py-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="programacao">Programacao</TabsTrigger>
            <TabsTrigger value="professores">Professores</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/cursos/${courseId}`)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            {isEditing && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB GERAL                                            */}
        {/* ══════════════════════════════════════════════════════ */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Informacoes Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Label / Nome da Turma</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Turma Brasilia - Marco 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Max. Alunos</Label>
                  <Input
                    type="number"
                    value={maxStudents ?? ''}
                    onChange={(e) => setMaxStudents(e.target.value ? Number(e.target.value) : null)}
                    placeholder="Ilimitado"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberta</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                      <SelectItem value="closed">Encerrada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB LOCAL                                             */}
        {/* ══════════════════════════════════════════════════════ */}
        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Local
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Venue / Nome do Local</Label>
                  <Input
                    value={locationVenue}
                    onChange={(e) => setLocationVenue(e.target.value)}
                    placeholder="Hotel Nacional"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereco</Label>
                  <Input
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="SHS Quadra 1, Brasilia/DF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Google Maps Embed URL</Label>
                <Input
                  value={locationMapEmbed}
                  onChange={(e) => setLocationMapEmbed(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>

              {/* Location extras */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Informacoes Extras do Local</Label>
                  <Button variant="ghost" size="sm" onClick={addLocationExtraItem} className="h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Info
                  </Button>
                </div>
                {locationExtra.map((extra, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      className="flex-1"
                      placeholder="Label (ex: Estacionamento)"
                      value={extra.label}
                      onChange={(e) => {
                        const extras = [...locationExtra];
                        extras[idx] = { ...extras[idx], label: e.target.value };
                        setLocationExtra(extras);
                      }}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Valor (ex: Gratuito)"
                      value={extra.value}
                      onChange={(e) => {
                        const extras = [...locationExtra];
                        extras[idx] = { ...extras[idx], value: e.target.value };
                        setLocationExtra(extras);
                      }}
                    />
                    <Input
                      className="w-24"
                      placeholder="Icone"
                      value={extra.icon || ''}
                      onChange={(e) => {
                        const extras = [...locationExtra];
                        extras[idx] = { ...extras[idx], icon: e.target.value };
                        setLocationExtra(extras);
                      }}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeLocationExtraItem(idx)} className="h-9 px-2">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
                {locationExtra.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Nenhuma informacao extra. Clique em &quot;+ Info&quot; para adicionar.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB PROGRAMACAO                                       */}
        {/* ══════════════════════════════════════════════════════ */}
        <TabsContent value="programacao">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Programacao ({programDays.length} dias)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addProgramDay} className="h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Dia
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {programDays.map((day, dayIdx) => (
                <div key={dayIdx} className="border rounded-lg p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-300" />
                      Dia {dayIdx + 1}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => removeProgramDay(dayIdx)} className="h-7 px-2">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tag (ex: Dia 1 -- Terca, 10/03)</Label>
                      <Input
                        value={day.tag}
                        onChange={(e) => updateDayField(dayIdx, 'tag', e.target.value)}
                        placeholder="Dia 1 -- Terca, 10/03"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Horario</Label>
                      <Input
                        value={day.time}
                        onChange={(e) => updateDayField(dayIdx, 'time', e.target.value)}
                        placeholder="14:00 as 18:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Titulo do Modulo</Label>
                    <Input
                      value={day.title}
                      onChange={(e) => updateDayField(dayIdx, 'title', e.target.value)}
                      placeholder="Fundamentos da Gestao de Projetos"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Descricao</Label>
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateDayField(dayIdx, 'description', e.target.value)}
                      rows={2}
                      placeholder="Breve descricao do modulo..."
                    />
                  </div>

                  {/* Topics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Topicos ({day.topics.length})</Label>
                      <Button variant="ghost" size="sm" onClick={() => addTopic(dayIdx)} className="h-6 text-xs">
                        <Plus className="w-3 h-3 mr-1" /> Topico
                      </Button>
                    </div>

                    {day.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="pl-3 border-l-2 border-gray-200 space-y-2">
                        <div className="flex gap-2 items-start">
                          <Input
                            className="flex-1"
                            value={topic.text}
                            onChange={(e) => updateTopicText(dayIdx, topicIdx, e.target.value)}
                            placeholder="Topico principal"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeTopic(dayIdx, topicIdx)} className="h-9 px-2">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>

                        {/* Sub-topics */}
                        <div className="pl-4 space-y-1">
                          {topic.children.map((child, childIdx) => (
                            <div key={childIdx} className="flex gap-2 items-center">
                              <span className="text-gray-300 text-xs">&#8627;</span>
                              <Input
                                className="flex-1 h-8 text-sm"
                                value={child}
                                onChange={(e) => updateSubtopic(dayIdx, topicIdx, childIdx, e.target.value)}
                                placeholder="Sub-topico"
                              />
                              <Button variant="ghost" size="sm" onClick={() => removeSubtopic(dayIdx, topicIdx, childIdx)} className="h-7 px-1.5">
                                <Trash2 className="w-3 h-3 text-red-300" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" onClick={() => addSubtopic(dayIdx, topicIdx)} className="h-6 text-xs text-gray-400 hover:text-gray-600">
                            <Plus className="w-3 h-3 mr-1" /> Sub-topico
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {programDays.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">Nenhum dia de programacao. Clique em &quot;+ Dia&quot; para adicionar.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB PROFESSORES                                       */}
        {/* ══════════════════════════════════════════════════════ */}
        <TabsContent value="professores">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" /> Professores
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewInstructor(!showNewInstructor)}
                className="h-8 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Novo Instrutor
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New instructor inline form */}
              {showNewInstructor && (
                <div className="border rounded-lg p-4 bg-blue-50/50 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Novo Instrutor</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome *</Label>
                      <Input
                        value={newInstructorName}
                        onChange={(e) => setNewInstructorName(e.target.value)}
                        placeholder="Nome do instrutor"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cargo</Label>
                      <Input
                        value={newInstructorRole}
                        onChange={(e) => setNewInstructorRole(e.target.value)}
                        placeholder="Ex: Professor, Consultor"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Bio</Label>
                    <Textarea
                      value={newInstructorBio}
                      onChange={(e) => setNewInstructorBio(e.target.value)}
                      rows={2}
                      placeholder="Breve biografia..."
                    />
                  </div>
                  <ImageUploadField
                    value={newInstructorPhotoUrl}
                    onChange={setNewInstructorPhotoUrl}
                    bucket="instructors"
                    pathPrefix="photos/"
                    label="Foto"
                    shape="square"
                    placeholder="URL da foto ou clique para fazer upload"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateInstructor}
                      disabled={creatingInstructor || !newInstructorName.trim()}
                    >
                      {creatingInstructor ? 'Criando...' : 'Criar'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewInstructor(false);
                        setNewInstructorName('');
                        setNewInstructorRole('');
                        setNewInstructorBio('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* Instructor list */}
              <div className="space-y-1">
                {sortedInstructors.map((inst) => {
                  const isSelected = instructorIds.includes(inst.id);
                  return (
                    <div
                      key={inst.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                    >
                      {/* Photo thumbnail */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                        {inst.photo_url ? (
                          <img
                            src={inst.photo_url}
                            alt={inst.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      {/* Name and role */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{inst.name}</div>
                        {inst.role && (
                          <div className="text-xs text-gray-400 truncate">{inst.role}</div>
                        )}
                      </div>

                      {/* Toggle */}
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => toggleInstructor(inst.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {allInstructors.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Nenhum instrutor cadastrado. Clique em &quot;Novo Instrutor&quot; para criar.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
