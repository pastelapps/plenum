import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { PDFDocument } from 'pdf-lib';
import { PAGE_W, PAGE_H, PDF_W, PDF_H, type SatoriNode, type FontData } from './types.ts';

let wasmInitialized = false;

function ts(): string {
  return new Date().toISOString();
}

/**
 * Initialize resvg WASM (once per cold start)
 */
async function ensureWasm() {
  if (wasmInitialized) {
    console.log(`[${ts()}] [WASM] Already initialized, skipping`);
    return;
  }

  console.log(`[${ts()}] [WASM] Initializing resvg WASM...`);
  const wasmUrl = 'https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm';
  console.log(`[${ts()}] [WASM] Fetching WASM from: ${wasmUrl}`);

  const fetchStart = Date.now();
  let wasmRes: Response;
  try {
    wasmRes = await fetch(wasmUrl);
  } catch (fetchErr) {
    console.error(`[${ts()}] [WASM] ✗ FETCH FAILED: Network error fetching WASM binary:`, fetchErr);
    throw new Error(`Failed to fetch WASM binary: ${fetchErr instanceof Error ? fetchErr.message : fetchErr}`);
  }

  const fetchMs = Date.now() - fetchStart;
  console.log(`[${ts()}] [WASM] Fetch response: status=${wasmRes.status}, ok=${wasmRes.ok}, content-type=${wasmRes.headers.get('content-type')}, time=${fetchMs}ms`);

  if (!wasmRes.ok) {
    const responseText = await wasmRes.text().catch(() => 'unable to read response');
    console.error(`[${ts()}] [WASM] ✗ FETCH FAILED: HTTP ${wasmRes.status} - ${responseText.slice(0, 200)}`);
    throw new Error(`WASM fetch failed: HTTP ${wasmRes.status}`);
  }

  console.log(`[${ts()}] [WASM] Reading WASM buffer...`);
  const bufStart = Date.now();
  const wasmBuf = await wasmRes.arrayBuffer();
  const bufMs = Date.now() - bufStart;
  console.log(`[${ts()}] [WASM] WASM buffer: ${wasmBuf.byteLength} bytes (${(wasmBuf.byteLength / 1024 / 1024).toFixed(2)} MB) read in ${bufMs}ms`);

  console.log(`[${ts()}] [WASM] Calling initWasm()...`);
  const initStart = Date.now();
  try {
    await initWasm(wasmBuf);
  } catch (initErr) {
    console.error(`[${ts()}] [WASM] ✗ initWasm() FAILED:`, initErr);
    throw new Error(`initWasm() failed: ${initErr instanceof Error ? initErr.message : initErr}`);
  }
  const initMs = Date.now() - initStart;
  console.log(`[${ts()}] [WASM] ✓ initWasm() completed in ${initMs}ms`);

  wasmInitialized = true;
  const totalMs = fetchMs + bufMs + initMs;
  console.log(`[${ts()}] [WASM] ✓ WASM fully initialized (total: ${totalMs}ms)`);
}

/**
 * Render a satori element tree to PNG bytes
 */
export async function renderPageToPng(
  element: SatoriNode,
  fonts: FontData[],
): Promise<Uint8Array> {
  // Ensure WASM is ready
  await ensureWasm();

  // satori → SVG
  console.log(`[${ts()}] [RENDER] Running satori (${PAGE_W}x${PAGE_H})...`);
  const satoriStart = Date.now();
  let svg: string;
  try {
    svg = await satori(element as any, {
      width: PAGE_W,
      height: PAGE_H,
      fonts: fonts.map((f) => ({
        name: f.name,
        data: f.data,
        weight: f.weight as any,
        style: f.style,
      })),
    });
  } catch (satoriErr) {
    console.error(`[${ts()}] [RENDER] ✗ satori FAILED:`, satoriErr);
    throw new Error(`satori failed: ${satoriErr instanceof Error ? satoriErr.message : satoriErr}`);
  }
  const satoriMs = Date.now() - satoriStart;
  console.log(`[${ts()}] [RENDER] ✓ satori → SVG: ${svg.length} chars in ${satoriMs}ms`);

  // SVG → PNG via resvg
  console.log(`[${ts()}] [RENDER] Running resvg (SVG → PNG)...`);
  const resvgStart = Date.now();
  let pngBytes: Uint8Array;
  try {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: PAGE_W },
    });
    const rendered = resvg.render();
    pngBytes = rendered.asPng();
  } catch (resvgErr) {
    console.error(`[${ts()}] [RENDER] ✗ resvg FAILED:`, resvgErr);
    throw new Error(`resvg failed: ${resvgErr instanceof Error ? resvgErr.message : resvgErr}`);
  }
  const resvgMs = Date.now() - resvgStart;
  console.log(`[${ts()}] [RENDER] ✓ resvg → PNG: ${pngBytes.length} bytes (${(pngBytes.length / 1024).toFixed(1)} KB) in ${resvgMs}ms`);

  return pngBytes;
}

/**
 * Assemble multiple PNG pages into a single PDF
 */
export async function assemblePdf(pngPages: Uint8Array[]): Promise<Uint8Array> {
  console.log(`[${ts()}] [PDF] Creating PDF document with ${pngPages.length} pages...`);
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pngPages.length; i++) {
    console.log(`[${ts()}] [PDF] Embedding page ${i + 1}/${pngPages.length} (${pngPages[i].length} bytes)...`);
    try {
      const image = await pdfDoc.embedPng(pngPages[i]);
      const page = pdfDoc.addPage([PDF_W, PDF_H]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: PDF_W,
        height: PDF_H,
      });
      console.log(`[${ts()}] [PDF] ✓ Page ${i + 1} embedded`);
    } catch (embedErr) {
      console.error(`[${ts()}] [PDF] ✗ Page ${i + 1} embed FAILED:`, embedErr);
      throw new Error(`PDF embed page ${i + 1} failed: ${embedErr instanceof Error ? embedErr.message : embedErr}`);
    }
  }

  console.log(`[${ts()}] [PDF] Saving PDF document...`);
  const pdfBytes = await pdfDoc.save();
  console.log(`[${ts()}] [PDF] ✓ PDF saved: ${pdfBytes.length} bytes`);
  return pdfBytes;
}
