'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  metaTitle: string;
  setMetaTitle: (v: string) => void;
  metaDescription: string;
  setMetaDescription: (v: string) => void;
  ogImageUrl: string;
  setOgImageUrl: (v: string) => void;
}

export default function TabSeo({
  metaTitle, setMetaTitle,
  metaDescription, setMetaDescription,
  ogImageUrl, setOgImageUrl,
}: Props) {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>SEO & Open Graph</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Título para buscadores (Google, Bing)"
            />
            <p className="text-xs text-gray-500">
              {metaTitle.length}/60 caracteres (recomendado: até 60)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="Descrição para buscadores..."
            />
            <p className="text-xs text-gray-500">
              {metaDescription.length}/160 caracteres (recomendado: até 160)
            </p>
          </div>

          <div className="space-y-2">
            <Label>OG Image URL</Label>
            <Input
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://... (1200x630 recomendado)"
            />
            <p className="text-xs text-gray-500">
              Imagem exibida ao compartilhar o link em redes sociais. Tamanho ideal: 1200×630px.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {(metaTitle || metaDescription) && (
        <Card>
          <CardHeader>
            <CardTitle>Preview no Google</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border space-y-1">
              <p className="text-blue-700 text-lg font-medium truncate">
                {metaTitle || 'Título do Curso'}
              </p>
              <p className="text-green-700 text-sm">
                plenumbrasil.com.br/cursos/...
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {metaDescription || 'Descrição da página...'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
