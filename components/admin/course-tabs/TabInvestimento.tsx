'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload, ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { IncludedItem } from '@/types/course';
import type { UserRole } from '@/types/user-roles';

interface Props {
  investmentHeading: string; setInvestmentHeading: (v: string) => void;
  investmentSubtitle: string; setInvestmentSubtitle: (v: string) => void;
  includedItems: IncludedItem[]; setIncludedItems: (v: IncludedItem[]) => void;
  backgroundImageUrl: string; setBackgroundImageUrl: (v: string) => void;
  productImageUrl: string; setProductImageUrl: (v: string) => void;
  courseSlug: string;
  role?: UserRole;
}

export default function TabInvestimento({
  investmentHeading, setInvestmentHeading,
  investmentSubtitle, setInvestmentSubtitle,
  includedItems, setIncludedItems,
  backgroundImageUrl, setBackgroundImageUrl,
  productImageUrl, setProductImageUrl,
  courseSlug,
  role = 'dev',
}: Props) {
  const isDev = role === 'dev';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${courseSlug || 'novo'}-bg-${Date.now()}.${ext}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(filePath);

      setBackgroundImageUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProductUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProduct(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${courseSlug || 'novo'}-product-${Date.now()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(filePath);

      setProductImageUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingProduct(false);
      if (productInputRef.current) productInputRef.current.value = '';
    }
  };

  const addItem = () => setIncludedItems([...includedItems, { icon: 'CheckCircle2', text: '' }]);
  const removeItem = (i: number) => setIncludedItems(includedItems.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof IncludedItem, value: string) => {
    const updated = [...includedItems];
    updated[i] = { ...updated[i], [field]: value };
    setIncludedItems(updated);
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
            <Input value={investmentHeading} onChange={(e) => setInvestmentHeading(e.target.value)} placeholder="Garanta sua Vaga" />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Textarea value={investmentSubtitle} onChange={(e) => setInvestmentSubtitle(e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Plano de Fundo — dev only */}
      {isDev && <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Plano de Fundo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Imagem de fundo exibida na seção de investimento da landing page.
          </p>

          {backgroundImageUrl ? (
            <div className="relative group">
              <img
                src={backgroundImageUrl}
                alt="Plano de fundo da seção investimento"
                className="w-full max-w-md rounded-lg border object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <button
                type="button"
                onClick={() => setBackgroundImageUrl('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-12 cursor-pointer hover:border-gray-400 transition-colors"
              style={{ aspectRatio: '16/9' }}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Clique para enviar o plano de fundo</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBgUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploading ? 'Enviando...' : backgroundImageUrl ? 'Trocar imagem' : 'Enviar imagem'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>URL da imagem (ou cole manualmente)</Label>
            <Input
              value={backgroundImageUrl}
              onChange={(e) => setBackgroundImageUrl(e.target.value)}
              placeholder="https://... ou /bgvg.png"
            />
          </div>
        </CardContent>
      </Card>}

      {/* Imagem do Produto (mochila) — dev only */}
      {isDev && <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem do Produto (Mochila/Kit)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Foto do kit/mochila exibida ao lado do texto na seção de investimento. No mobile aparece abaixo do texto. Recomendado: PNG com fundo transparente.
          </p>

          {productImageUrl ? (
            <div className="relative group inline-block">
              <img
                src={productImageUrl}
                alt="Imagem do produto"
                className="max-w-[250px] rounded-lg border object-contain bg-gray-900/50 p-4"
              />
              <button
                type="button"
                onClick={() => setProductImageUrl('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => productInputRef.current?.click()}
              className="w-[250px] h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Enviar foto do kit</span>
              <span className="text-xs text-gray-400 mt-1">PNG transparente ideal</span>
            </div>
          )}

          <input
            ref={productInputRef}
            type="file"
            accept="image/*"
            onChange={handleProductUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => productInputRef.current?.click()}
              disabled={uploadingProduct}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploadingProduct ? 'Enviando...' : productImageUrl ? 'Trocar imagem' : 'Enviar imagem'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>URL da imagem (ou cole manualmente)</Label>
            <Input
              value={productImageUrl}
              onChange={(e) => setProductImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Itens Inclusos ({includedItems.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {includedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={item.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
                placeholder="Ícone"
                className="w-36"
              />
              <Input
                value={item.text}
                onChange={(e) => updateItem(i, 'text', e.target.value)}
                placeholder="Texto do item"
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
