'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Testimonial } from '@/types/course';
import ImageUploadField from '../ImageUploadField';

interface Props {
  testimonials: Testimonial[];
  setTestimonials: (v: Testimonial[]) => void;
}

export default function TabDepoimentos({ testimonials, setTestimonials }: Props) {
  const addTestimonial = () =>
    setTestimonials([...testimonials, { name: '', role: '', thumbnail_url: '', youtube_id: '' }]);
  const removeTestimonial = (i: number) =>
    setTestimonials(testimonials.filter((_, idx) => idx !== i));
  const updateTestimonial = (i: number, field: keyof Testimonial, value: string) => {
    const updated = [...testimonials];
    updated[i] = { ...updated[i], [field]: value };
    setTestimonials(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Depoimentos em Vídeo ({testimonials.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-4 h-4 mr-1" /> Depoimento
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Vídeos de depoimentos do YouTube. O ID do vídeo é a parte após &quot;v=&quot; na URL do YouTube.
          </p>
          {testimonials.map((t, i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Depoimento {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeTestimonial(i)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nome</Label>
                  <Input
                    value={t.name}
                    onChange={(e) => updateTestimonial(i, 'name', e.target.value)}
                    placeholder="Nome do depoente"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cargo / Função</Label>
                  <Input
                    value={t.role || ''}
                    onChange={(e) => updateTestimonial(i, 'role', e.target.value)}
                    placeholder="Ex: Procurador Municipal"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">YouTube ID</Label>
                <Input
                  value={t.youtube_id}
                  onChange={(e) => updateTestimonial(i, 'youtube_id', e.target.value)}
                  placeholder="dQw4w9WgXcQ"
                />
              </div>
              <ImageUploadField
                label="Foto / Thumbnail"
                value={t.thumbnail_url}
                onChange={(url) => updateTestimonial(i, 'thumbnail_url', url)}
                bucket="course-covers"
                pathPrefix="testimonials/"
                shape="square"
                placeholder="URL da foto do depoente"
              />
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Nenhum depoimento cadastrado. Clique em &quot;+ Depoimento&quot; para adicionar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
