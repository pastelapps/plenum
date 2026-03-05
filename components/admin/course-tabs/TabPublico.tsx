'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { AudienceCard, AudienceImage } from '@/types/course';

interface Props {
  audienceCards: AudienceCard[]; setAudienceCards: (v: AudienceCard[]) => void;
  audienceImages: AudienceImage[]; setAudienceImages: (v: AudienceImage[]) => void;
}

export default function TabPublico({
  audienceCards, setAudienceCards,
  audienceImages, setAudienceImages,
}: Props) {
  // Audience Cards
  const addCard = () => setAudienceCards([...audienceCards, { icon: 'User', title: '', description: '' }]);
  const removeCard = (i: number) => setAudienceCards(audienceCards.filter((_, idx) => idx !== i));
  const updateCard = (i: number, field: keyof AudienceCard, value: string) => {
    const updated = [...audienceCards];
    updated[i] = { ...updated[i], [field]: value };
    setAudienceCards(updated);
  };

  // Audience Images
  const addImage = () => setAudienceImages([...audienceImages, { url: '', alt: '' }]);
  const removeImage = (i: number) => setAudienceImages(audienceImages.filter((_, idx) => idx !== i));
  const updateImage = (i: number, field: keyof AudienceImage, value: string) => {
    const updated = [...audienceImages];
    updated[i] = { ...updated[i], [field]: value };
    setAudienceImages(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cards de Público-Alvo ({audienceCards.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addCard}>
            <Plus className="w-4 h-4 mr-1" /> Card
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {audienceCards.map((card, i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Card {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeCard(i)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Ícone</Label>
                  <Input value={card.icon} onChange={(e) => updateCard(i, 'icon', e.target.value)} placeholder="Landmark" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Título</Label>
                  <Input value={card.title} onChange={(e) => updateCard(i, 'title', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Descrição</Label>
                <Textarea value={card.description} onChange={(e) => updateCard(i, 'description', e.target.value)} rows={2} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Imagens de Fundo ({audienceImages.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addImage}>
            <Plus className="w-4 h-4 mr-1" /> Imagem
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500">5 imagens para o bento grid da seção de público-alvo.</p>
          {audienceImages.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={img.url}
                onChange={(e) => updateImage(i, 'url', e.target.value)}
                placeholder="URL da imagem"
                className="flex-1"
              />
              <Input
                value={img.alt}
                onChange={(e) => updateImage(i, 'alt', e.target.value)}
                placeholder="Alt text"
                className="w-40"
              />
              <Button variant="ghost" size="sm" onClick={() => removeImage(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
