import { createClient } from '@supabase/supabase-js';
import { fetchPdfData } from './lib/data.ts';
import { loadFonts } from './lib/fonts.ts';
import { renderPageToPng, assemblePdf } from './lib/renderer.ts';
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

// ─── Helper: timestamp for logs ───────────────────────────
function ts(): string {
  return new Date().toISOString();
}

Deno.serve(async (req: Request) => {
  console.log(`[${ts()}] ▶ Edge Function invoked: ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log(`[${ts()}] ✓ CORS preflight response`);
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // ─── STEP 1: Auth verification ──────────────────────────
    console.log(`[${ts()}] [STEP 1/8] Verifying authentication...`);
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${ts()}] ✗ STEP 1 FAILED: No Authorization header present`);
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] Auth header present: Bearer ${authHeader.slice(7, 20)}...`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    console.log(`[${ts()}] SUPABASE_URL: ${supabaseUrl}`);
    console.log(`[${ts()}] SUPABASE_ANON_KEY present: ${!!anonKey} (length: ${anonKey?.length})`);

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      console.error(`[${ts()}] ✗ STEP 1 FAILED: Auth error:`, authError?.message || 'No user returned');
      return new Response(JSON.stringify({ error: 'Unauthorized', details: authError?.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] ✓ STEP 1 OK: User authenticated: ${user.email} (${user.id})`);

    // ─── STEP 2: Parse request body ─────────────────────────
    console.log(`[${ts()}] [STEP 2/8] Parsing request body...`);
    let body: Record<string, string>;
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error(`[${ts()}] ✗ STEP 2 FAILED: Invalid JSON body:`, parseErr);
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { course_id, course_date_id } = body;
    console.log(`[${ts()}] Request body: course_id=${course_id}, course_date_id=${course_date_id}`);

    if (!course_id || !course_date_id) {
      console.error(`[${ts()}] ✗ STEP 2 FAILED: Missing required fields`);
      return new Response(JSON.stringify({ error: 'Missing course_id or course_date_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[${ts()}] ✓ STEP 2 OK: Body parsed successfully`);

    // ─── STEP 3: Fetch all data from DB ─────────────────────
    console.log(`[${ts()}] [STEP 3/8] Fetching data from database...`);
    const fetchStart = Date.now();
    const data = await fetchPdfData(course_id, course_date_id);
    const fetchMs = Date.now() - fetchStart;
    console.log(`[${ts()}] ✓ STEP 3 OK: Data fetched in ${fetchMs}ms`);
    console.log(`[${ts()}]   Course: "${data.course.title}" (slug: ${data.course.slug})`);
    console.log(`[${ts()}]   Course Date: ${data.courseDate.start_date} → ${data.courseDate.end_date} (label: ${data.courseDate.label})`);
    console.log(`[${ts()}]   Instructors: ${data.instructors.length} (${data.instructors.map(i => i.name).join(', ')})`);
    console.log(`[${ts()}]   Design System: primary=${data.ds.color_primary}, heading=${data.ds.font_heading}, body=${data.ds.font_body}`);
    console.log(`[${ts()}]   Company: ${data.company.company_name}, logo_url=${data.company.logo_url || 'NULL'}`);
    console.log(`[${ts()}]   Course data: about_cards=${data.course.about_cards?.length || 0}, audience_cards=${data.course.audience_cards?.length || 0}`);
    console.log(`[${ts()}]   Course data: program_days=${data.courseDate.program_days?.length || 0}, testimonials=${data.course.testimonials?.length || 0}`);
    console.log(`[${ts()}]   Course data: about_description length=${data.course.about_description?.length || 0}`);

    // ─── STEP 4: Load fonts ─────────────────────────────────
    console.log(`[${ts()}] [STEP 4/8] Loading fonts...`);
    console.log(`[${ts()}]   DS font_heading_urls: ${JSON.stringify(data.ds.font_heading_urls?.length || 0)} entries`);
    console.log(`[${ts()}]   DS font_body_urls: ${JSON.stringify(data.ds.font_body_urls?.length || 0)} entries`);
    const fontStart = Date.now();
    const fonts = await loadFonts(data.ds);
    const fontMs = Date.now() - fontStart;
    console.log(`[${ts()}] ✓ STEP 4 OK: ${fonts.length} fonts loaded in ${fontMs}ms`);
    fonts.forEach((f, i) => {
      console.log(`[${ts()}]   Font ${i + 1}: name="${f.name}", weight=${f.weight}, dataSize=${f.data.byteLength} bytes`);
    });

    // ─── STEP 5: Build page elements ────────────────────────
    console.log(`[${ts()}] [STEP 5/8] Building page elements...`);
    const siteBaseUrl = Deno.env.get('SITE_BASE_URL') || 'https://plenumbrasil.com.br';
    console.log(`[${ts()}]   siteBaseUrl: ${siteBaseUrl}`);
    const ctx: PdfContext = { ...data, siteBaseUrl };

    const pageElements: SatoriNode[] = [];

    // Cover
    console.log(`[${ts()}]   Building Cover page...`);
    try {
      pageElements.push(renderCover(ctx, fonts));
      console.log(`[${ts()}]   ✓ Cover page built`);
    } catch (err) {
      console.error(`[${ts()}]   ✗ Cover page FAILED:`, err);
      throw new Error(`Cover page render failed: ${err instanceof Error ? err.message : err}`);
    }

    // Presentation
    console.log(`[${ts()}]   Building Presentation page...`);
    try {
      pageElements.push(renderPresentation(ctx, fonts));
      console.log(`[${ts()}]   ✓ Presentation page built`);
    } catch (err) {
      console.error(`[${ts()}]   ✗ Presentation page FAILED:`, err);
      throw new Error(`Presentation page render failed: ${err instanceof Error ? err.message : err}`);
    }

    // About
    if (data.course.about_cards && data.course.about_cards.length > 0) {
      console.log(`[${ts()}]   Building About page (${data.course.about_cards.length} cards)...`);
      try {
        pageElements.push(renderAbout(ctx, fonts));
        console.log(`[${ts()}]   ✓ About page built`);
      } catch (err) {
        console.error(`[${ts()}]   ✗ About page FAILED:`, err);
        throw new Error(`About page render failed: ${err instanceof Error ? err.message : err}`);
      }
    } else {
      console.log(`[${ts()}]   ⊘ Skipping About page (no about_cards)`);
    }

    // Program (can be multiple pages)
    console.log(`[${ts()}]   Building Program pages (${data.courseDate.program_days?.length || 0} days)...`);
    try {
      const programPages = renderProgram(ctx, fonts);
      pageElements.push(...programPages);
      console.log(`[${ts()}]   ✓ Program: ${programPages.length} page(s) built`);
    } catch (err) {
      console.error(`[${ts()}]   ✗ Program pages FAILED:`, err);
      throw new Error(`Program page render failed: ${err instanceof Error ? err.message : err}`);
    }

    // Speaker
    console.log(`[${ts()}]   Building Speaker page...`);
    try {
      const speakerPage = renderSpeaker(ctx, fonts);
      if (speakerPage) {
        pageElements.push(speakerPage);
        console.log(`[${ts()}]   ✓ Speaker page built`);
      } else {
        console.log(`[${ts()}]   ⊘ Skipping Speaker page (no instructors)`);
      }
    } catch (err) {
      console.error(`[${ts()}]   ✗ Speaker page FAILED:`, err);
      throw new Error(`Speaker page render failed: ${err instanceof Error ? err.message : err}`);
    }

    // Closing
    console.log(`[${ts()}]   Building Closing page...`);
    try {
      pageElements.push(renderClosing(ctx, fonts));
      console.log(`[${ts()}]   ✓ Closing page built`);
    } catch (err) {
      console.error(`[${ts()}]   ✗ Closing page FAILED:`, err);
      throw new Error(`Closing page render failed: ${err instanceof Error ? err.message : err}`);
    }

    console.log(`[${ts()}] ✓ STEP 5 OK: ${pageElements.length} total page elements built`);

    // ─── STEP 6: Render pages to PNG ────────────────────────
    console.log(`[${ts()}] [STEP 6/8] Rendering ${pageElements.length} pages to PNG via satori + resvg...`);
    const pngPages: Uint8Array[] = [];
    for (let i = 0; i < pageElements.length; i++) {
      const pageStart = Date.now();
      console.log(`[${ts()}]   Rendering page ${i + 1}/${pageElements.length}...`);
      try {
        const png = await renderPageToPng(pageElements[i], fonts);
        const pageMs = Date.now() - pageStart;
        console.log(`[${ts()}]   ✓ Page ${i + 1} rendered: ${png.length} bytes in ${pageMs}ms`);
        pngPages.push(png);
      } catch (err) {
        const pageMs = Date.now() - pageStart;
        console.error(`[${ts()}]   ✗ Page ${i + 1} render FAILED after ${pageMs}ms:`, err);
        throw new Error(`Page ${i + 1} PNG render failed: ${err instanceof Error ? err.message : err}`);
      }
    }
    console.log(`[${ts()}] ✓ STEP 6 OK: All ${pngPages.length} pages rendered to PNG`);

    // ─── STEP 7: Assemble PDF ───────────────────────────────
    console.log(`[${ts()}] [STEP 7/8] Assembling ${pngPages.length} PNGs into PDF...`);
    const pdfStart = Date.now();
    let pdfBytes: Uint8Array;
    try {
      pdfBytes = await assemblePdf(pngPages);
      const pdfMs = Date.now() - pdfStart;
      console.log(`[${ts()}] ✓ STEP 7 OK: PDF assembled: ${pdfBytes.length} bytes (${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB) in ${pdfMs}ms`);
    } catch (err) {
      console.error(`[${ts()}] ✗ STEP 7 FAILED: PDF assembly error:`, err);
      throw new Error(`PDF assembly failed: ${err instanceof Error ? err.message : err}`);
    }

    // ─── STEP 8: Upload + Save URL ──────────────────────────
    console.log(`[${ts()}] [STEP 8/8] Uploading PDF to storage and saving URL...`);
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    console.log(`[${ts()}]   SERVICE_ROLE_KEY present: ${!!serviceKey} (length: ${serviceKey?.length})`);
    const adminClient = createClient(supabaseUrl, serviceKey);

    const fileName = `${data.course.slug}-${course_date_id.slice(0, 8)}-${Date.now()}.pdf`;
    const filePath = `generated/${fileName}`;
    console.log(`[${ts()}]   Uploading to pdfs/${filePath} (${pdfBytes.length} bytes)...`);

    const uploadStart = Date.now();
    const { error: uploadError } = await adminClient.storage
      .from('pdfs')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      const uploadMs = Date.now() - uploadStart;
      console.error(`[${ts()}]   ✗ Upload FAILED after ${uploadMs}ms:`, uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    const uploadMs = Date.now() - uploadStart;
    console.log(`[${ts()}]   ✓ Upload OK in ${uploadMs}ms`);

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('pdfs')
      .getPublicUrl(filePath);
    console.log(`[${ts()}]   Public URL: ${publicUrl}`);

    // Save URL to course_dates (PDF is per turma)
    console.log(`[${ts()}]   Updating course_dates.folder_pdf_url for id=${course_date_id}...`);
    const { error: updateError } = await adminClient
      .from('course_dates')
      .update({ folder_pdf_url: publicUrl })
      .eq('id', course_date_id);

    if (updateError) {
      console.warn(`[${ts()}]   ⚠ Failed to update course_dates.folder_pdf_url:`, updateError.message);
    } else {
      console.log(`[${ts()}]   ✓ course_dates.folder_pdf_url updated`);
    }

    const totalMs = Date.now() - startTime;
    console.log(`[${ts()}] ══════════════════════════════════════════`);
    console.log(`[${ts()}] ✅ PDF GENERATED SUCCESSFULLY`);
    console.log(`[${ts()}]   Course: "${data.course.title}"`);
    console.log(`[${ts()}]   Turma: ${data.courseDate.label || data.courseDate.start_date}`);
    console.log(`[${ts()}]   Pages: ${pngPages.length}`);
    console.log(`[${ts()}]   Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
    console.log(`[${ts()}]   Total time: ${totalMs}ms`);
    console.log(`[${ts()}]   URL: ${publicUrl}`);
    console.log(`[${ts()}] ══════════════════════════════════════════`);

    return new Response(JSON.stringify({ success: true, url: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const totalMs = Date.now() - startTime;
    console.error(`[${ts()}] ══════════════════════════════════════════`);
    console.error(`[${ts()}] ❌ PDF GENERATION FAILED after ${totalMs}ms`);
    console.error(`[${ts()}]   Error type: ${error?.constructor?.name}`);
    console.error(`[${ts()}]   Error message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(`[${ts()}]   Stack trace:\n${error.stack}`);
    }
    console.error(`[${ts()}] ══════════════════════════════════════════`);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: ts(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
