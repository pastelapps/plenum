import type { FontData, DesignSystemData } from './types';

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url.slice(0, 80)} (${res.status})`);
  const buf = await res.arrayBuffer();

  // Reject WOFF2 (not supported by satori)
  if (buf.byteLength >= 4) {
    const sig = String.fromCharCode(...new Uint8Array(buf.slice(0, 4)));
    if (sig === 'wOF2') {
      throw new Error(`Font is WOFF2 (not supported by satori). URL: ${url.slice(0, 60)}`);
    }
  }

  return buf;
}

/**
 * Load the Inter fallback fonts.
 *
 * Browser NOTE: The Fetch API forbids setting the User-Agent header, so we
 * CANNOT use Google Fonts CSS trickery (it returns WOFF2 for modern browsers,
 * which satori does not support). Instead we load the pre-downloaded TTF files
 * from the local public/ directory (public/fonts/inter-*.ttf).
 */
async function loadInterFallback(weightsToLoad: number[]): Promise<FontData[]> {
  const fonts: FontData[] = [];

  // ── Strategy 1: local TTF files served from /fonts/ ─────────────────────
  // Files: public/fonts/inter-400.ttf, public/fonts/inter-700.ttf
  const localWeightFiles: Record<number, string> = {
    400: '/fonts/inter-400.ttf',
    700: '/fonts/inter-700.ttf',
  };

  let localSuccess = false;
  for (const weight of weightsToLoad) {
    const path = localWeightFiles[weight];
    if (!path) continue;
    try {
      const data = await fetchFont(path);
      fonts.push({ name: 'Inter', data, weight, style: 'normal' });
      localSuccess = true;
    } catch (e) {
      console.warn(`[PDF Fonts] Local Inter ${weight} failed:`, e instanceof Error ? e.message : e);
    }
  }

  if (localSuccess && fonts.length > 0) {
    console.log(`[PDF Fonts] Loaded ${fonts.length} Inter font(s) from local /fonts/`);
    return fonts;
  }

  // ── Strategy 2: Known stable Google Fonts gstatic TTF URLs ──────────────
  // These are direct TTF CDN links (CORS-enabled, browser-safe).
  // Note: Inter v20 URLs — update if Google changes them.
  const gstaticUrls: Record<number, string> = {
    400: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrj72A.ttf',
    700: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrj72A.ttf',
  };

  for (const weight of weightsToLoad) {
    const url = gstaticUrls[weight];
    if (!url) continue;
    try {
      const data = await fetchFont(url);
      fonts.push({ name: 'Inter', data, weight, style: 'normal' });
    } catch (e) {
      console.warn(`[PDF Fonts] gstatic Inter ${weight} failed:`, e instanceof Error ? e.message : e);
    }
  }

  if (fonts.length > 0) {
    console.log(`[PDF Fonts] Loaded ${fonts.length} Inter font(s) from gstatic CDN`);
    return fonts;
  }

  throw new Error('All Inter font loading strategies failed. Make sure public/fonts/inter-400.ttf and inter-700.ttf exist.');
}

export async function loadFonts(ds: DesignSystemData): Promise<FontData[]> {
  const fonts: FontData[] = [];

  if (ds.font_heading_urls && ds.font_heading_urls.length > 0) {
    for (const entry of ds.font_heading_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_heading, data, weight: entry.weight, style: 'normal' });
      } catch { /* skip */ }
    }
  }

  if (ds.font_body_urls && ds.font_body_urls.length > 0) {
    for (const entry of ds.font_body_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_body, data, weight: entry.weight, style: 'normal' });
      } catch { /* skip */ }
    }
  }

  if (fonts.length === 0) {
    console.log('[PDF Fonts] No DS fonts configured, falling back to Inter...');
    const interFonts = await loadInterFallback([400, 700]);
    fonts.push(...interFonts);
  } else {
    const hasBody = fonts.some((f) => f.name === ds.font_body);
    if (!hasBody) {
      try {
        const interFonts = await loadInterFallback([400, 700]);
        for (const f of interFonts) {
          fonts.push({ ...f, name: ds.font_body });
        }
      } catch { /* continue without body fallback */ }
    }
  }

  if (fonts.length === 0) throw new Error('No fonts could be loaded.');
  return fonts;
}

export function getFontFamily(ds: DesignSystemData, type: 'heading' | 'body', fonts: FontData[]): string {
  const targetName = type === 'heading' ? ds.font_heading : ds.font_body;
  return fonts.some((f) => f.name === targetName) ? targetName : 'Inter';
}
