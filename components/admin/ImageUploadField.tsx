'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  value: string | null;
  onChange: (url: string) => void;
  bucket: string;
  pathPrefix: string;
  /** Optional label shown above the field */
  label?: string;
  accept?: string;
  /** 'square' → circle preview (photos), 'wide' → rect preview (logos) */
  shape?: 'square' | 'wide';
  placeholder?: string;
}

/**
 * Compact image upload field: preview thumbnail + URL input + upload button.
 * Uploads to Supabase Storage and calls onChange with the full public URL.
 */
export default function ImageUploadField({
  value,
  onChange,
  bucket,
  pathPrefix,
  label,
  accept = 'image/*',
  shape = 'square',
  placeholder = 'https://...',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${pathPrefix}${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="text-xs font-medium text-gray-500">{label}</span>
      )}

      <div className="flex items-center gap-2">
        {/* Thumbnail preview */}
        {value ? (
          <div
            className={`relative shrink-0 group ${
              shape === 'square' ? 'w-10 h-10' : 'w-20 h-8'
            }`}
          >
            <img
              src={value}
              alt=""
              className={`w-full h-full object-cover border border-gray-200 ${
                shape === 'square' ? 'rounded-full' : 'rounded'
              }`}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`shrink-0 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
              shape === 'square' ? 'w-10 h-10 rounded-full' : 'w-20 h-8 rounded'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}

        {/* URL text input (manual fallback) */}
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm h-8"
        />

        {/* Upload button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 h-8 px-2"
          title="Fazer upload de imagem"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
