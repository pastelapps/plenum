'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { AboutCard } from '@/types/course';

interface Props {
  aboutHeading: string; setAboutHeading: (v: string) => void;
  aboutSubheading: string; setAboutSubheading: (v: string) => void;
  aboutCards: AboutCard[]; setAboutCards: (v: AboutCard[]) => void;
}

export default function TabSobre({
  aboutHeading, setAboutHeading,
  aboutSubheading, setAboutSubheading,
  aboutCards, setAboutCards,
}: Props) {
  const addCard = () => setAboutCards([...aboutCards, { icon: 'Star', title: '', description: '' }]);
  const removeCard = (i: number) => setAboutCards(aboutCards.filter((_, idx) => idx !== i));
  const updateCard = (i: number, field: keyof AboutCard, value: string) => {
    const updated = [...aboutCards];
    updated[i] = { ...updated[i], [field]: value };
    setAboutCards(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Cabeçalho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Textarea value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} rows={2} placeholder="Título da seção Sobre" />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Textarea value={aboutSubheading} onChange={(e) => setAboutSubheading(e.target.value)} rows={2} placeholder="Descrição da seção" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cards ({aboutCards.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addCard}>
            <Plus className="w-4 h-4 mr-1" /> Card
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutCards.map((card, i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Card {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeCard(i)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Ícone (Lucide)</Label>
                  <Input value={card.icon} onChange={(e) => updateCard(i, 'icon', e.target.value)} placeholder="ShieldCheck" />
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
    </div>
  );
}
