import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPdfData } from './data';
import { loadFonts } from './fonts';
import { preloadImages } from './images';
import { renderPageToPng, assemblePdf } from './renderer';
import type { PdfContext, SatoriNode } from './types';

import { renderCover } from './pages/cover';
import { renderPresentation } from './pages/presentation';
import { renderAbout } from './pages/about';
import { renderProgram } from './pages/program';
import { renderSpeaker } from './pages/speaker';
import { renderClosing } from './pages/closing';

export interface GeneratePdfOptions {
  courseId: string;
  courseDateId: string;
  supabase: SupabaseClient;
  /** Base URL to resolve relative image paths (e.g. '/logo.png') */
  siteBaseUrl?: string;
  /** Progress callback — called between async steps */
  onProgress?: (message: string) => void;
}

/**
 * Generate a PDF folder for a course + turma, entirely in the browser.
 * No edge function CPU limits apply here.
 *
 * @returns PDF as Uint8Array ready for download or upload to Supabase Storage
 */
export async function generateFolderPdf(opts: GeneratePdfOptions): Promise<Uint8Array> {
  const {
    courseId,
    courseDateId,
    supabase,
    siteBaseUrl = 'https://plenumbrasil.com.br',
    onProgress,
  } = opts;

  const report = (msg: string) => {
    console.log(`[PDF Generator] ${msg}`);
    onProgress?.(msg);
  };

  // ─── 1. Fetch data from Supabase ─────────────────────────
  report('Buscando dados do curso...');
  const data = await fetchPdfData(courseId, courseDateId, supabase);
  report(`Dados: "${data.course.title}", ${data.instructors.length} inst., ${data.courseDate.program_days?.length || 0} dias`);

  // ─── 2. Load fonts ───────────────────────────────────────
  report('Carregando fontes...');
  const fonts = await loadFonts(data.ds);
  report(`${fonts.length} fonte(s) carregada(s)`);

  // ─── 3. Pre-load images as base64 data URIs ──────────────
  report('Pré-carregando imagens...');
  const imageCache = await preloadImages({ ...data, siteBaseUrl, imageCache: new Map() });
  report(`${imageCache.size} imagem(ns) carregada(s)`);

  // ─── 4. Build page element trees ─────────────────────────
  const ctx: PdfContext = { ...data, siteBaseUrl, imageCache };
  const pageElements: SatoriNode[] = [];

  pageElements.push(renderCover(ctx, fonts));
  pageElements.push(renderPresentation(ctx, fonts));

  if (data.course.about_cards && data.course.about_cards.length > 0) {
    pageElements.push(renderAbout(ctx, fonts));
  }

  const programPages = renderProgram(ctx, fonts);
  pageElements.push(...programPages);

  const speakerPage = renderSpeaker(ctx, fonts);
  if (speakerPage) pageElements.push(speakerPage);

  pageElements.push(renderClosing(ctx, fonts));

  report(`${pageElements.length} página(s) planejada(s)`);

  // ─── 5. Render each page to PNG ──────────────────────────
  const pngPages: Uint8Array[] = [];
  for (let i = 0; i < pageElements.length; i++) {
    report(`Renderizando página ${i + 1} de ${pageElements.length}...`);
    const png = await renderPageToPng(pageElements[i], fonts);
    pngPages.push(png);
    report(`Página ${i + 1}: ${(png.length / 1024).toFixed(0)}KB`);
  }

  // ─── 6. Assemble PDF ─────────────────────────────────────
  report('Montando PDF...');
  const pdfBytes = await assemblePdf(pngPages);
  report(`PDF pronto: ${(pdfBytes.length / 1024).toFixed(0)}KB, ${pngPages.length} páginas`);

  return pdfBytes;
}
