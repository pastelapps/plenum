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

async function fetchGoogleFontsCss(
  weights: number[],
  userAgent: string,
): Promise<Map<number, string>> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weights.join(';')}`;
  const res = await fetch(cssUrl, { headers: { 'User-Agent': userAgent } });
  if (!res.ok) throw new Error(`Google Fonts CSS failed: HTTP ${res.status}`);
  const css = await res.text();

  const urlMap = new Map<number, string>();
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/src:\s*url\(([^)]+)\)/);
    if (weightMatch && urlMatch) {
      urlMap.set(parseInt(weightMatch[1]), urlMatch[1]);
    }
  }
  return urlMap;
}

async function loadInterFallback(weightsToLoad: number[]): Promise<FontData[]> {
  const fonts: FontData[] = [];

  // Strategy 1: Android 2.2 UA → static TTF per weight
  try {
    const urls = await fetchGoogleFontsCss(weightsToLoad,
      'Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1');
    if (urls.size > 0) {
      for (const weight of weightsToLoad) {
        const url = urls.get(weight);
        if (!url) continue;
        try {
          const data = await fetchFont(url);
          fonts.push({ name: 'Inter', data, weight, style: 'normal' });
        } catch { /* skip weight */ }
      }
      if (fonts.length > 0) return fonts;
    }
  } catch (e) {
    console.warn('[PDF Fonts] Strategy 1 (TTF) failed:', e instanceof Error ? e.message : e);
  }

  // Strategy 2: IE11 UA → WOFF per weight
  try {
    const urls = await fetchGoogleFontsCss(weightsToLoad,
      'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)');
    if (urls.size > 0) {
      for (const weight of weightsToLoad) {
        const url = urls.get(weight);
        if (!url) continue;
        try {
          const data = await fetchFont(url);
          fonts.push({ name: 'Inter', data, weight, style: 'normal' });
        } catch { /* skip weight */ }
      }
      if (fonts.length > 0) return fonts;
    }
  } catch (e) {
    console.warn('[PDF Fonts] Strategy 2 (WOFF) failed:', e instanceof Error ? e.message : e);
  }

  throw new Error('All font loading strategies failed.');
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
    console.log('[PDF Fonts] No DS fonts, falling back to Inter...');
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
