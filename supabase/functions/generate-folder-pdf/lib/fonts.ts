import type { FontData, DesignSystemData } from './types.ts';

function ts(): string {
  return new Date().toISOString();
}

/**
 * Fetch font as ArrayBuffer.
 * Validates the font is TTF/OTF (not WOFF/WOFF2) since satori only supports those.
 */
async function fetchFont(url: string): Promise<ArrayBuffer> {
  console.log(`[${ts()}] [FONTS] Fetching font: ${url.slice(0, 100)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url} (${res.status})`);
  const buf = await res.arrayBuffer();

  // Check file signature to reject WOFF/WOFF2
  if (buf.byteLength >= 4) {
    const header = new Uint8Array(buf.slice(0, 4));
    const sig = String.fromCharCode(...header);
    if (sig === 'wOF2') {
      throw new Error(`Font is WOFF2 format (not supported by satori). URL: ${url.slice(0, 80)}`);
    }
    if (sig === 'wOFF') {
      throw new Error(`Font is WOFF format (not supported by satori). URL: ${url.slice(0, 80)}`);
    }
  }

  console.log(`[${ts()}] [FONTS] OK font loaded: ${buf.byteLength} bytes`);
  return buf;
}

/**
 * Fetch Inter TTF font URLs from Google Fonts CSS API.
 * Uses an older User-Agent to force Google Fonts to serve TTF instead of WOFF2.
 */
async function getInterTtfUrls(weights: number[]): Promise<Map<number, string>> {
  const weightsStr = weights.join(';');
  const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weightsStr}`;

  console.log(`[${ts()}] [FONTS] Fetching Google Fonts CSS for TTF format...`);
  console.log(`[${ts()}] [FONTS]   URL: ${cssUrl}`);

  // Use IE11 user-agent to get TTF format instead of WOFF2
  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)',
    },
  });

  if (!res.ok) throw new Error(`Google Fonts CSS fetch failed: HTTP ${res.status}`);
  const css = await res.text();
  console.log(`[${ts()}] [FONTS] Google Fonts CSS response: ${css.length} chars`);

  const urlMap = new Map<number, string>();

  // Parse @font-face blocks to extract URLs and weights
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/src:\s*url\(([^)]+)\)/);
    if (weightMatch && urlMatch) {
      const weight = parseInt(weightMatch[1]);
      const url = urlMatch[1];
      urlMap.set(weight, url);
      console.log(`[${ts()}] [FONTS] Found Inter TTF: weight=${weight}`);
    }
  }

  if (urlMap.size === 0) {
    console.error(`[${ts()}] [FONTS] No font URLs parsed from CSS. First 500 chars of CSS:\n${css.slice(0, 500)}`);
    throw new Error('Failed to parse any font URLs from Google Fonts CSS');
  }

  console.log(`[${ts()}] [FONTS] Parsed ${urlMap.size} Inter TTF URLs from Google Fonts CSS`);
  return urlMap;
}

/**
 * Load fonts for satori.
 * Satori requires TTF or OTF fonts (NOT WOFF/WOFF2).
 * Falls back to Inter TTF from Google Fonts if design system fonts are unavailable or WOFF2.
 */
export async function loadFonts(ds: DesignSystemData): Promise<FontData[]> {
  console.log(`[${ts()}] [FONTS] Loading fonts...`);
  console.log(`[${ts()}] [FONTS]   DS heading: "${ds.font_heading}", heading_urls: ${ds.font_heading_urls?.length || 0}`);
  console.log(`[${ts()}] [FONTS]   DS body: "${ds.font_body}", body_urls: ${ds.font_body_urls?.length || 0}`);

  const fonts: FontData[] = [];

  // Try loading heading font from design system URLs
  if (ds.font_heading_urls && ds.font_heading_urls.length > 0) {
    for (const entry of ds.font_heading_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_heading, data, weight: entry.weight, style: 'normal' });
      } catch (e) {
        console.warn(`[${ts()}] [FONTS] Heading font failed (will use fallback):`, e instanceof Error ? e.message : e);
      }
    }
  }

  // Try loading body font from design system URLs
  if (ds.font_body_urls && ds.font_body_urls.length > 0) {
    for (const entry of ds.font_body_urls) {
      try {
        const data = await fetchFont(entry.url);
        fonts.push({ name: ds.font_body, data, weight: entry.weight, style: 'normal' });
      } catch (e) {
        console.warn(`[${ts()}] [FONTS] Body font failed (will use fallback):`, e instanceof Error ? e.message : e);
      }
    }
  }

  // If no fonts were loaded (or all were WOFF2), fallback to Inter TTF
  if (fonts.length === 0) {
    console.log(`[${ts()}] [FONTS] No DS fonts loaded, falling back to Inter TTF from Google Fonts`);
    const weightsToLoad = [400, 600, 700, 800];

    try {
      const urlMap = await getInterTtfUrls(weightsToLoad);

      const promises = weightsToLoad.map(async (weight) => {
        const url = urlMap.get(weight);
        if (!url) {
          console.warn(`[${ts()}] [FONTS] No URL found for Inter weight ${weight}`);
          return null;
        }
        try {
          const data = await fetchFont(url);
          return { name: 'Inter', data, weight, style: 'normal' as const };
        } catch (e) {
          console.warn(`[${ts()}] [FONTS] Failed to load Inter ${weight}:`, e instanceof Error ? e.message : e);
          return null;
        }
      });

      const results = await Promise.all(promises);
      for (const r of results) {
        if (r) fonts.push(r);
      }
    } catch (e) {
      console.error(`[${ts()}] [FONTS] CRITICAL: Failed to get Inter TTF URLs:`, e instanceof Error ? e.message : e);
      throw new Error(`Cannot load any fonts: ${e instanceof Error ? e.message : e}`);
    }
  } else {
    // Ensure we have body font if only heading was loaded
    const hasBody = fonts.some((f) => f.name === ds.font_body);
    if (!hasBody) {
      console.log(`[${ts()}] [FONTS] No body font loaded, adding Inter TTF as body fallback`);
      try {
        const urlMap = await getInterTtfUrls([400, 600, 700]);
        for (const weight of [400, 600, 700]) {
          const url = urlMap.get(weight);
          if (!url) continue;
          try {
            const data = await fetchFont(url);
            fonts.push({ name: ds.font_body, data, weight, style: 'normal' });
          } catch {
            // skip individual weight failures
          }
        }
      } catch (e) {
        console.warn(`[${ts()}] [FONTS] Body fallback failed:`, e instanceof Error ? e.message : e);
      }
    }
  }

  console.log(`[${ts()}] [FONTS] Total fonts loaded: ${fonts.length}`);
  fonts.forEach((f, i) => {
    console.log(`[${ts()}] [FONTS]   ${i + 1}. name="${f.name}" weight=${f.weight} size=${f.data.byteLength} bytes`);
  });

  if (fonts.length === 0) {
    throw new Error('No fonts could be loaded. Cannot render PDF.');
  }

  return fonts;
}

/**
 * Get the font family name to use in satori styles.
 * Returns the DS font name if loaded, otherwise 'Inter'.
 */
export function getFontFamily(ds: DesignSystemData, type: 'heading' | 'body', fonts: FontData[]): string {
  const targetName = type === 'heading' ? ds.font_heading : ds.font_body;
  const hasFont = fonts.some((f) => f.name === targetName);
  return hasFont ? targetName : 'Inter';
}
