'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  slug: string; setSlug: (v: string) => void;
  title: string; setTitle: (v: string) => void;
  subtitle: string; setSubtitle: (v: string) => void;
  categoryLabel: string; setCategoryLabel: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  modality: string; setModality: (v: string) => void;
  designSystemId: string; setDesignSystemId: (v: string) => void;
  whatsappNumber: string; setWhatsappNumber: (v: string) => void;
  whatsappMessage: string; setWhatsappMessage: (v: string) => void;
  designSystems: Array<{ id: string; name: string; is_default: boolean }>;
}

export default function TabGeral({
  slug, setSlug,
  title, setTitle,
  subtitle, setSubtitle,
  categoryLabel, setCategoryLabel,
  status, setStatus,
  modality, setModality,
  designSystemId, setDesignSystemId,
  whatsappNumber, setWhatsappNumber,
  whatsappMessage, setWhatsappMessage,
  designSystems,
}: Props) {
  const generateSlug = () => {
    const s = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setSlug(s);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Emendas Parlamentares na Prática" />
          </div>

          <div className="space-y-2">
            <Label>Slug *</Label>
            <div className="flex gap-2">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="emendas-parlamentares" className="flex-1 font-mono text-sm" />
              <button type="button" onClick={generateSlug} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                Gerar do título
              </button>
            </div>
            <p className="text-xs text-gray-400">URL: /cursos/{slug || '...'}</p>
          </div>

          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Descrição breve do curso" />
          </div>

          <div className="space-y-2">
            <Label>Rótulo de Categoria</Label>
            <Input value={categoryLabel} onChange={(e) => setCategoryLabel(e.target.value)} placeholder="Imersão" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modalidade</Label>
              <Select value={modality} onValueChange={setModality}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Design System</Label>
            <Select value={designSystemId} onValueChange={setDesignSystemId}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {designSystems.map((ds) => (
                  <SelectItem key={ds.id} value={ds.id}>
                    {ds.name} {ds.is_default ? '(padrão)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Número (com DDI)</Label>
            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="553125311776" />
          </div>
          <div className="space-y-2">
            <Label>Mensagem Padrão</Label>
            <Textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} rows={2} placeholder="Olá! Gostaria de informações..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
