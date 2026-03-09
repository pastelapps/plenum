import { createClient } from '@supabase/supabase-js';
import { fetchPdfData } from './lib/data.ts';
import { loadFonts } from './lib/fonts.ts';
import { renderPageToPng, assemblePdf } from './lib/renderer.ts';
import { preloadImages } from './lib/images.ts';
import type { PdfContext, SatoriNode } from './lib/types.ts';

// Page renderers
import { renderCover } from './pages/cover.ts';
import { renderPresentation } from './pages/presentation.ts';
import { renderAbout } from './pages/about.ts';
import { renderProgram } from './pages/program.ts';
import { renderSpeaker } from './pages/speaker.ts';
import { renderClosing } from './pages/closing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function ts(): string {
  return new Date().toISOString();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // ─── Auth ────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: authError?.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] Auth OK: ${user.email}`);

    // ─── Parse body ──────────────────────────────────────────
    let body: Record<string, string>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { course_id, course_date_id } = body;
    if (!course_id || !course_date_id) {
      return new Response(JSON.stringify({ error: 'Missing course_id or course_date_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] Generating PDF: course=${course_id}, date=${course_date_id}`);

    // ─── Fetch data ──────────────────────────────────────────
    const data = await fetchPdfData(course_id, course_date_id);
    console.log(`[${ts()}] Data: "${data.course.title}", ${data.instructors.length} inst, ${data.courseDate.program_days?.length || 0} days`);

    // ─── Load fonts ──────────────────────────────────────────
    const fonts = await loadFonts(data.ds);
    console.log(`[${ts()}] Fonts: ${fonts.length} loaded`);

    // ─── Pre-load images ──────────────────────────────────────
    const siteBaseUrl = Deno.env.get('SITE_BASE_URL') || 'https://plenumbrasil.com.br';
    const imageCache = await preloadImages({ ...data, siteBaseUrl, imageCache: new Map() });
    console.log(`[${ts()}] Images: ${imageCache.size} pre-loaded`);

    // ─── Build pages ─────────────────────────────────────────
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
    console.log(`[${ts()}] Built ${pageElements.length} pages, rendering...`);

    // ─── Render pages to PNG ─────────────────────────────────
    const pngPages: Uint8Array[] = [];
    for (let i = 0; i < pageElements.length; i++) {
      const png = await renderPageToPng(pageElements[i], fonts);
      console.log(`[${ts()}] Page ${i + 1}/${pageElements.length}: ${(png.length / 1024).toFixed(0)}KB`);
      pngPages.push(png);
    }

    // ─── Assemble PDF ────────────────────────────────────────
    const pdfBytes = await assemblePdf(pngPages);
    console.log(`[${ts()}] PDF: ${(pdfBytes.length / 1024).toFixed(0)}KB, ${pngPages.length} pages`);

    // ─── Return binary PDF ────────────────────────────────────
    const totalMs = Date.now() - startTime;
    const fileName = `${data.course.slug}-${course_date_id.slice(0, 8)}.pdf`;
    console.log(`[${ts()}] ✅ Done: ${pngPages.length}p, ${(pdfBytes.length / 1024).toFixed(0)}KB, ${totalMs}ms`);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Course-Slug': data.course.slug,
        'X-Course-Date-Id': course_date_id,
      },
    });
  } catch (error) {
    const totalMs = Date.now() - startTime;
    console.error(`[${ts()}] ❌ FAILED ${totalMs}ms:`, error instanceof Error ? error.message : error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
