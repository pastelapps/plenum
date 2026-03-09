import { PAGE_W, PAGE_H, PDF_W, PDF_H, type SatoriNode, type FontData } from './types';

// Render at ~37% of satori width — acceptable quality for digital brochures.
// 465px ≈ 56 DPI in a 595-point PDF.
const RENDER_W = 465;

// Lazy-loaded module references (avoids SSR issues in Next.js)
let resvgMod: typeof import('@resvg/resvg-wasm') | null = null;
let resvgWasmInitialized = false;

async function getResvg() {
  if (!resvgMod) {
    resvgMod = await import('@resvg/resvg-wasm');
  }
  if (!resvgWasmInitialized) {
    try {
      // Load WASM from our local public/ directory (fastest, no CDN dependency)
      // File: public/resvg.wasm — copied from node_modules/@resvg/resvg-wasm/index_bg.wasm
      const wasmRes = await fetch('/resvg.wasm');
      if (!wasmRes.ok) throw new Error(`HTTP ${wasmRes.status}`);
      const wasmBuf = await wasmRes.arrayBuffer();
      console.log(`[PDF Renderer] resvg WASM: ${(wasmBuf.byteLength / 1024 / 1024).toFixed(1)}MB`);
      await resvgMod.initWasm(wasmBuf);
      console.log('[PDF Renderer] resvg WASM ready');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // "Already initialized" means HMR reloaded this module but resvg WASM
      // module is still cached. Safe to proceed.
      if (msg.includes('Already initialized')) {
        console.log('[PDF Renderer] resvg WASM already initialized (HMR)');
      } else {
        throw new Error(`Failed to load resvg WASM: ${msg}`);
      }
    }
    resvgWasmInitialized = true;
  }
  return resvgMod;
}

/**
 * Render a satori element tree to PNG bytes.
 * satori 0.25+ bundles yoga WASM as base64 — no manual init needed.
 */
export async function renderPageToPng(
  element: SatoriNode,
  fonts: FontData[],
): Promise<Uint8Array> {
  // Load resvg (initializes WASM on first call)
  const { Resvg } = await getResvg();

  // satori → SVG (yoga WASM is auto-initialized from bundled base64)
  const { default: satori } = await import('satori');
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

  // SVG → PNG via resvg (at reduced resolution to save memory & time)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: RENDER_W },
  });

  const rendered = resvg.render();

  if (!rendered) {
    const svgSnippet = svg.slice(0, 400).replace(/data:[^;]+;base64,[A-Za-z0-9+/=]+/g, '[BASE64]');
    throw new Error(`resvg.render() returned undefined. SVG snippet: ${svgSnippet}`);
  }

  return rendered.asPng();
}

/**
 * Assemble multiple PNG pages into a single PDF using pdf-lib.
 */
export async function assemblePdf(pngPages: Uint8Array[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();

  for (const pngBytes of pngPages) {
    const image = await pdfDoc.embedPng(pngBytes);
    const page = pdfDoc.addPage([PDF_W, PDF_H]);
    page.drawImage(image, { x: 0, y: 0, width: PDF_W, height: PDF_H });
  }

  return await pdfDoc.save();
}
