import type { FontData, DesignSystemData } from './types.ts';

function ts(): string {
  return new Date().toISOString();
}

/**
 * Fetch font as ArrayBuffer.
 * Satori supports TTF, OTF, and WOFF — only WOFF2 is rejected.
 */
async function fetchFont(url: string): Promise<ArrayBuffer> {
  console.log(`[${ts()}] [FONTS] Fetching font: ${url.slice(0, 120)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url} (${res.status})`);
  const buf = await res.arrayBuffer();

  // Check file signature — satori supports TTF, OTF, and WOFF but NOT WOFF2
  if (buf.byteLength >= 4) {
    const header = new Uint8Array(buf.slice(0, 4));
    const sig = String.fromCharCode(...header);
    if (sig === 'wOF2') {
      throw new Error(`Font is WOFF2 format (not supported by satori). URL: ${url.slice(0, 80)}`);
    }
    if (sig === 'wOFF') {
      console.log(`[${ts()}] [FONTS] Font format: WOFF (supported by satori)`);
    } else if (sig === '\x00\x01\x00\x00' || sig.startsWith('\x00\x01')) {
      console.log(`[${ts()}] [FONTS] Font format: TTF (supported by satori)`);
    } else if (sig === 'OTTO') {
      console.log(`[${ts()}] [FONTS] Font format: OTF (supported by satori)`);
    } else {
      console.log(`[${ts()}] [FONTS] Font format: unknown signature (0x${Array.from(header).map(b => b.toString(16).padStart(2, '0')).join('')})`);
    }
  }

  console.log(`[${ts()}] [FONTS] OK font loaded: ${buf.byteLength} bytes`);
  return buf;
}

/**
 * Load Inter font as fallback using multiple strategies.
 * Strategy 1: Variable font TTF from Google Fonts GitHub repo (most reliable)
 * Strategy 2: Google Fonts CSS API with Android 2.2 UA → TTF
 * Strategy 3: Google Fonts CSS API with IE11 UA → WOFF
 */
async function loadInterFallback(weightsToLoad: number[]): Promise<FontData[]> {
  const fonts: FontData[] = [];

  // ─── Strategy 1: Variable font TTF from GitHub ───────────────
  console.log(`[${ts()}] [FONTS] Strategy 1: Fetching Inter variable font TTF from GitHub...`);
  const variableFontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf';
  try {
    const data = await fetchFont(variableFontUrl);
    console.log(`[${ts()}] [FONTS] ✓ Strategy 1 SUCCESS: Variable font loaded (${data.byteLength} bytes)`);
    // Register the same variable font for each requested weight
    for (const weight of weightsToLoad) {
      fonts.push({ name: 'Inter', data, weight, style: 'normal' });
    }
    return fonts;
  } catch (e) {
    console.warn(`[${ts()}] [FONTS] Strategy 1 failed:`, e instanceof Error ? e.message : e);
  }

  // ─── Strategy 2: Google Fonts CSS with Android 2.2 UA (TTF) ──
  console.log(`[${ts()}] [FONTS] Strategy 2: Google Fonts CSS with Android 2.2 UA (TTF)...`);
  try {
    const urls = await fetchGoogleFontsCss(weightsToLoad,
      'Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
      'Android 2.2 (TTF)');
    if (urls.size > 0) {
      for (const weight of weightsToLoad) {
        const url = urls.get(weight);
        if (!url) continue;
        try {
          const data = await fetchFont(url);
          fonts.push({ name: 'Inter', data, weight, style: 'normal' });
        } catch (e) {
          console.warn(`[${ts()}] [FONTS] Strategy 2: Failed to load weight ${weight}:`, e instanceof Error ? e.message : e);
        }
      }
      if (fonts.length > 0) {
        console.log(`[${ts()}] [FONTS] ✓ Strategy 2 SUCCESS: ${fonts.length} fonts loaded`);
        return fonts;
      }
    }
  } catch (e) {
    console.warn(`[${ts()}] [FONTS] Strategy 2 failed:`, e instanceof Error ? e.message : e);
  }

  // ─── Strategy 3: Google Fonts CSS with IE11 UA (WOFF) ────────
  console.log(`[${ts()}] [FONTS] Strategy 3: Google Fonts CSS with IE11 UA (WOFF)...`);
  try {
    const urls = await fetchGoogleFontsCss(weightsToLoad,
      'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)',
      'IE11 (WOFF)');
    if (urls.size > 0) {
      for (const weight of weightsToLoad) {
        const url = urls.get(weight);
        if (!url) continue;
        try {
          const data = await fetchFont(url);
          fonts.push({ name: 'Inter', data, weight, style: 'normal' });
        } catch (e) {
          console.warn(`[${ts()}] [FONTS] Strategy 3: Failed to load weight ${weight}:`, e instanceof Error ? e.message : e);
        }
      }
      if (fonts.length > 0) {
        console.log(`[${ts()}] [FONTS] ✓ Strategy 3 SUCCESS: ${fonts.length} fonts loaded`);
        return fonts;
      }
    }
  } catch (e) {
    console.warn(`[${ts()}] [FONTS] Strategy 3 failed:`, e instanceof Error ? e.message : e);
  }

  throw new Error('All font loading strategies failed. Cannot load Inter font.');
}

/**
 * Fetch font URLs from Google Fonts CSS API using the specified user-agent.
 */
async function fetchGoogleFontsCss(
  weights: number[],
  userAgent: string,
  label: string,
): Promise<Map<number, string>> {
  const weightsStr = weights.join(';');
  const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weightsStr}`;

  console.log(`[${ts()}] [FONTS] Fetching Google Fonts CSS (${label})...`);
  const res = await fetch(cssUrl, {
    headers: { 'User-Agent': userAgent },
  });

  if (!res.ok) throw new Error(`Google Fonts CSS fetch failed: HTTP ${res.status}`);
  const css = await res.text();
  console.log(`[${ts()}] [FONTS] CSS response (${label}): ${css.length} chars`);
  console.log(`[${ts()}] [FONTS] CSS snippet: ${css.slice(0, 300)}`);

  const urlMap = new Map<number, string>();
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
      console.log(`[${ts()}] [FONTS] Found: weight=${weight} url=${url.slice(0, 80)}...`);
    }
  }

  if (urlMap.size === 0) {
    console.warn(`[${ts()}] [FONTS] No font URLs parsed from CSS (${label})`);
  }

  return urlMap;
}

/**
 * Load fonts for satori.
 * Satori supports TTF, OTF, and WOFF (NOT WOFF2).
 * Falls back to Inter from multiple sources if design system fonts are unavailable.
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

  // If no fonts were loaded, fallback to Inter via multiple strategies
  if (fonts.length === 0) {
    console.log(`[${ts()}] [FONTS] No DS fonts loaded, falling back to Inter...`);
    const weightsToLoad = [400, 600, 700, 800];

    try {
      const interFonts = await loadInterFallback(weightsToLoad);
      fonts.push(...interFonts);
    } catch (e) {
      console.error(`[${ts()}] [FONTS] CRITICAL: All Inter loading strategies failed:`, e instanceof Error ? e.message : e);
      throw new Error(`Cannot load any fonts: ${e instanceof Error ? e.message : e}`);
    }
  } else {
    // Ensure we have body font if only heading was loaded
    const hasBody = fonts.some((f) => f.name === ds.font_body);
    if (!hasBody) {
      console.log(`[${ts()}] [FONTS] No body font loaded, adding Inter as body fallback`);
      try {
        const interFonts = await loadInterFallback([400, 600, 700]);
        // Rename Inter to body font name so satori uses it
        for (const f of interFonts) {
          fonts.push({ ...f, name: ds.font_body });
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
