'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload, ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { PartnerLogo } from '@/types/course';

interface Props {
  partnerLogos: PartnerLogo[];
  setPartnerLogos: (v: PartnerLogo[]) => void;
  folderPdfUrl: string;
  setFolderPdfUrl: (v: string) => void;
  coverImageUrl: string;
  setCoverImageUrl: (v: string) => void;
  folderBgUrl: string;
  setFolderBgUrl: (v: string) => void;
  courseSlug: string;
}

export default function TabMidias({
  partnerLogos, setPartnerLogos,
  folderPdfUrl, setFolderPdfUrl,
  coverImageUrl, setCoverImageUrl,
  folderBgUrl, setFolderBgUrl,
  courseSlug,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderBgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingFolderBg, setUploadingFolderBg] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${courseSlug || 'novo'}-cover-${Date.now()}.${ext}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFolderBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFolderBg(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${courseSlug || 'novo'}-folder-bg-${Date.now()}.${ext}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-covers')
        .getPublicUrl(filePath);

      setFolderBgUrl(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingFolderBg(false);
      if (folderBgInputRef.current) folderBgInputRef.current.value = '';
    }
  };

  const addLogo = () =>
    setPartnerLogos([...partnerLogos, { name: '', url: '' }]);
  const removeLogo = (i: number) =>
    setPartnerLogos(partnerLogos.filter((_, idx) => idx !== i));
  const updateLogo = (i: number, field: keyof PartnerLogo, value: string | number) => {
    const updated = [...partnerLogos];
    updated[i] = { ...updated[i], [field]: value };
    setPartnerLogos(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Capa do curso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem de Capa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Imagem de capa exibida no site principal da Plenum para representar o curso. Recomendado: 1200x630px.
          </p>

          {coverImageUrl ? (
            <div className="relative group">
              <img
                src={coverImageUrl}
                alt="Capa do curso"
                className="w-full max-w-md rounded-lg border object-cover"
                style={{ aspectRatio: '1200/630' }}
              />
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-12 cursor-pointer hover:border-gray-400 transition-colors"
              style={{ aspectRatio: '1200/630' }}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Clique para enviar a imagem de capa</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
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
              {uploading ? 'Enviando...' : coverImageUrl ? 'Trocar imagem' : 'Enviar imagem'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>URL da imagem (ou cole manualmente)</Label>
            <Input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Logos de parceiros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Logos de Parceiros ({partnerLogos.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={addLogo}>
            <Plus className="w-4 h-4 mr-1" /> Logo
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500">
            Logos exibidos na seção de parceiros/apoiadores da landing page.
          </p>
          {partnerLogos.map((logo, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={logo.name}
                onChange={(e) => updateLogo(i, 'name', e.target.value)}
                placeholder="Nome"
                className="w-36"
              />
              <Input
                value={logo.url}
                onChange={(e) => updateLogo(i, 'url', e.target.value)}
                placeholder="URL da imagem"
                className="flex-1"
              />
              <Input
                value={logo.width || ''}
                onChange={(e) => updateLogo(i, 'width', e.target.value ? parseInt(e.target.value) : 0)}
                placeholder="W"
                className="w-16"
                type="number"
              />
              <Input
                value={logo.height || ''}
                onChange={(e) => updateLogo(i, 'height', e.target.value ? parseInt(e.target.value) : 0)}
                placeholder="H"
                className="w-16"
                type="number"
              />
              <Button variant="ghost" size="sm" onClick={() => removeLogo(i)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          {partnerLogos.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Nenhum logo cadastrado. Clique em &quot;+ Logo&quot; para adicionar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Fundo da seção "Baixe o Folder" */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Fundo — Baixe o Folder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Imagem de fundo da seção &quot;Baixe o Folder&quot; na landing page. Padrão: /fundodepo.png
          </p>

          {folderBgUrl ? (
            <div className="relative group">
              <img
                src={folderBgUrl}
                alt="Fundo da seção Baixe o Folder"
                className="w-full max-w-md rounded-lg border object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <button
                type="button"
                onClick={() => setFolderBgUrl('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => folderBgInputRef.current?.click()}
              className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-12 cursor-pointer hover:border-gray-400 transition-colors"
              style={{ aspectRatio: '16/9' }}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Clique para enviar o plano de fundo</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP</span>
            </div>
          )}

          <input
            ref={folderBgInputRef}
            type="file"
            accept="image/*"
            onChange={handleFolderBgUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => folderBgInputRef.current?.click()}
              disabled={uploadingFolderBg}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploadingFolderBg ? 'Enviando...' : folderBgUrl ? 'Trocar imagem' : 'Enviar imagem'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>URL da imagem (ou cole manualmente)</Label>
            <Input
              value={folderBgUrl}
              onChange={(e) => setFolderBgUrl(e.target.value)}
              placeholder="https://... ou /fundodepo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Folder PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL do Folder PDF</Label>
            <Input
              value={folderPdfUrl}
              onChange={(e) => setFolderPdfUrl(e.target.value)}
              placeholder="https://storage.supabase.co/.../folder.pdf"
            />
            <p className="text-xs text-gray-500">
              URL do PDF gerado ou enviado. Este PDF é enviado para leads que preenchem o formulário de folder.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
