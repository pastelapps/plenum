import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPdfData } from './data';
import { loadFonts } from './fonts';
import { preloadImages } from './images';
import { renderPageToPng, assemblePdf } from './renderer';
import type { PdfContext, SatoriNode } from './types';

import { renderCover }        from './pages/cover';
import { renderPresentation } from './pages/presentation';
import { renderAbout }        from './pages/about';
import { renderProgram }      from './pages/program';
import { renderSpeakers }     from './pages/speaker';
import { renderGallery }      from './pages/gallery';
import { renderInvestment }   from './pages/investment';
import { renderClosing }      from './pages/closing';

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
 *
 * Page order:
 *  1  Capa
 *  2  Apresentação + Público
 *  3  Sobre (optional)
 *  4+ Programação (one per pair of days)
 *  N  Palestrantes       ← dynamic, all instructors
 *  N+1 Fotos do Evento + Kit Participante  ← static promotional
 *  N+2 Investimento      ← two-column price + payment
 *  N+3 Depoimentos + Parceiros + Entre em Contato  ← closing
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

  // Pages 1-2: always present
  pageElements.push(renderCover(ctx, fonts));
  pageElements.push(renderPresentation(ctx, fonts));

  // Page 3: About (optional — only when about_cards are filled)
  if (data.course.about_cards && data.course.about_cards.length > 0) {
    pageElements.push(renderAbout(ctx, fonts));
  }

  // Pages 4+: Programme (one per pair of days)
  const programPages = renderProgram(ctx, fonts);
  pageElements.push(...programPages);

  // Page N: Speakers list
  const speakersPage = renderSpeakers(ctx, fonts);
  if (speakersPage) pageElements.push(speakersPage);

  // Page N+1: Static gallery + kit participante
  pageElements.push(renderGallery(ctx, fonts));

  // Page N+2: Investimento (two-column)
  pageElements.push(renderInvestment(ctx, fonts));

  // Page N+3: Depoimentos + Parceiros + Contato
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
