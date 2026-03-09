import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { PDFDocument } from 'pdf-lib';
import { PAGE_W, PAGE_H, PDF_W, PDF_H, type SatoriNode, type FontData } from './types.ts';

let wasmInitialized = false;

// Render at ~37% of satori width to stay within Supabase CPU limit (2s/req).
// 465px ≈ 56 DPI in a 595-point PDF — acceptable for digital brochures.
// Reducing from 620 to 465 cuts resvg pixel area by ~44% (area ∝ width²).
const RENDER_W = 465;

/**
 * Initialize resvg WASM (once per cold start)
 */
async function ensureWasm() {
  if (wasmInitialized) return;

  const wasmUrl = 'https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm';
  const wasmRes = await fetch(wasmUrl);
  if (!wasmRes.ok) throw new Error(`WASM fetch failed: HTTP ${wasmRes.status}`);

  const wasmBuf = await wasmRes.arrayBuffer();
  console.log(`[WASM] ${(wasmBuf.byteLength / 1024 / 1024).toFixed(1)}MB loaded`);

  await initWasm(wasmBuf);
  wasmInitialized = true;
  console.log(`[WASM] Initialized OK`);
}

/**
 * Render a satori element tree to PNG bytes
 */
export async function renderPageToPng(
  element: SatoriNode,
  fonts: FontData[],
): Promise<Uint8Array> {
  await ensureWasm();

  // satori → SVG
  const svg = await satori(element as any, {
    width: PAGE_W,
    height: PAGE_H,
    fonts: fonts.map((f) => ({
      name: f.name,
      data: f.data,
      weight: f.weight as any,
      style: f.style,
    })),
  });

  // SVG → PNG via resvg (at reduced resolution)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: RENDER_W },
  });
  const rendered = resvg.render();

  // Guard: resvg returns undefined if it fails to decode an image in the SVG.
  // With imageCache (base64 data URIs), this should never happen — but if it does,
  // throw a descriptive error instead of crashing with "reading '256'".
  if (!rendered) {
    const svgSnippet = svg.slice(0, 400).replace(/data:[^;]+;base64,[A-Za-z0-9+/=]+/g, '[BASE64]');
    throw new Error(`resvg.render() returned undefined. The SVG may contain an unresolvable image.\nSVG snippet: ${svgSnippet}`);
  }

  return rendered.asPng();
}

/**
 * Assemble multiple PNG pages into a single PDF
 */
export async function assemblePdf(pngPages: Uint8Array[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pngPages.length; i++) {
    const image = await pdfDoc.embedPng(pngPages[i]);
    const page = pdfDoc.addPage([PDF_W, PDF_H]);
    page.drawImage(image, { x: 0, y: 0, width: PDF_W, height: PDF_H });
  }

  return await pdfDoc.save();
}
