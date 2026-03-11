'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { TitlePart, HeroBadge } from '@/types/course';
import type { UserRole } from '@/types/user-roles';

interface Props {
  titleParts: TitlePart[]; setTitleParts: (v: TitlePart[]) => void;
  heroBadges: HeroBadge[]; setHeroBadges: (v: HeroBadge[]) => void;
  heroFramesPath: string; setHeroFramesPath: (v: string) => void;
  heroFrameCount: number; setHeroFrameCount: (v: number) => void;
  heroFrameExt: string; setHeroFrameExt: (v: string) => void;
  role?: UserRole;
}

export default function TabHero({
  titleParts, setTitleParts,
  heroBadges, setHeroBadges,
  heroFramesPath, setHeroFramesPath,
  heroFrameCount, setHeroFrameCount,
  heroFrameExt, setHeroFrameExt,
  role = 'dev',
}: Props) {
  const isDev = role === 'dev';
  // Title Parts
  const addTitlePart = () => setTitleParts([...titleParts, { text: '', color: 'white' }]);
  const removeTitlePart = (i: number) => setTitleParts(titleParts.filter((_, idx) => idx !== i));
  const updateTitlePart = (i: number, field: keyof TitlePart, value: string) => {
    const updated = [...titleParts];
    updated[i] = { ...updated[i], [field]: value } as TitlePart;
    setTitleParts(updated);
  };

  // Badges
  const addBadge = () => setHeroBadges([...heroBadges, { icon: 'Info', label: '', value: '' }]);
  const removeBadge = (i: number) => setHeroBadges(heroBadges.filter((_, idx) => idx !== i));
  const updateBadge = (i: number, field: keyof HeroBadge, value: string) => {
    const updated = [...heroBadges];
    updated[i] = { ...updated[i], [field]: value };
    setHeroBadges(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title Parts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Título Estilizado</CardTitle>
          <Button variant="outline" size="sm" onClick={addTitlePart}>
            <Plus className="w-4 h-4 mr-1" /> Parte
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500">Divida o título em partes com cores diferentes. Se vazio, usa o título simples.</p>
          {titleParts.map((part, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={part.text}
                onChange={(e) => updateTitlePart(i, 'text', e.target.value)}
                placeholder="Texto..."
                className="flex-1"
              />
              <Select
                value={part.color}
                onValueChange={(v) => updateTitlePart(i, 'color', v)}
              >
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">Branco</SelectItem>
                  <SelectItem value="accent">Destaque</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => removeTitlePart(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges — dev only */}
      {isDev && <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Badges do Hero</CardTitle>
          <Button variant="outline" size="sm" onClick={addBadge}>
            <Plus className="w-4 h-4 mr-1" /> Badge
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Valores especiais:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-400">
              <li><code className="bg-gray-100 px-1 rounded">dropdown</code> — Exibe seletor de turmas (datas abertas)</li>
              <li><code className="bg-gray-100 px-1 rounded">location_dynamic</code> — Exibe o local da turma selecionada automaticamente</li>
            </ul>
          </div>
          {heroBadges.map((badge, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-gray-50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={badge.icon}
                    onChange={(e) => updateBadge(i, 'icon', e.target.value)}
                    placeholder="Ícone (MapPin)"
                  />
                  <Input
                    value={badge.label}
                    onChange={(e) => updateBadge(i, 'label', e.target.value)}
                    placeholder="Rótulo"
                  />
                  <Input
                    value={badge.value}
                    onChange={(e) => updateBadge(i, 'value', e.target.value)}
                    placeholder="Valor ou dropdown"
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeBadge(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>}

      {/* Frame Animation — dev only */}
      {isDev && <Card>
        <CardHeader>
          <CardTitle>Animação de Frames</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Caminho</Label>
              <Input value={heroFramesPath} onChange={(e) => setHeroFramesPath(e.target.value)} placeholder="/frames/frame_" />
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input type="number" value={heroFrameCount} onChange={(e) => setHeroFrameCount(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Extensão</Label>
              <Input value={heroFrameExt} onChange={(e) => setHeroFrameExt(e.target.value)} placeholder=".jpg" />
            </div>
          </div>
        </CardContent>
      </Card>}
    </div>
  );
}
