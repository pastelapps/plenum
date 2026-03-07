import type { PdfContext } from './types.ts';

export type ImageCache = Map<string, string>; // rawUrl → "data:image/jpeg;base64,..."

/**
 * Resolve a potentially relative URL to absolute using siteBaseUrl.
 */
function resolveUrl(rawUrl: string, siteBaseUrl: string): string {
  return rawUrl.startsWith('/') ? `${siteBaseUrl}${rawUrl}` : rawUrl;
}

/**
 * Convert ArrayBuffer to base64 string in 32KB chunks
 * to avoid stack overflow on large images.
 */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Fetch a single image and return a base64 data URI.
 * Returns empty string on any failure so rendering degrades gracefully.
 */
export async function fetchImageAsDataUri(
  rawUrl: string,
  siteBaseUrl: string,
): Promise<string> {
  if (!rawUrl) return '';
  const url = resolveUrl(rawUrl, siteBaseUrl);

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.warn(`[IMAGES] HTTP ${res.status} for ${url.slice(0, 80)}`);
      return '';
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    // Normalize: strip charset params that break data URIs
    const mimeType = contentType.split(';')[0].trim();

    // Reject HTML/text responses (happens on redirect-to-login pages)
    if (mimeType === 'text/html' || mimeType === 'text/plain') {
      console.warn(`[IMAGES] Got ${mimeType} instead of image for ${url.slice(0, 80)}`);
      return '';
    }

    const buf = await res.arrayBuffer();
    const b64 = arrayBufferToBase64(buf);
    return `data:${mimeType};base64,${b64}`;
  } catch (err) {
    console.warn(`[IMAGES] Failed ${url.slice(0, 80)}:`, err instanceof Error ? err.message : err);
    return '';
  }
}

/**
 * Pre-load ALL images referenced in the PDF context in parallel.
 * Keys are raw URL strings from the data (before siteBaseUrl resolution).
 * Page renderers look up by raw URL: ctx.imageCache.get(rawUrl) ?? fallbackUrl
 */
export async function preloadImages(ctx: PdfContext): Promise<ImageCache> {
  const { company, instructors, course, siteBaseUrl } = ctx;
  const cache: ImageCache = new Map();

  // Collect every unique URL that appears in the PDF
  const rawUrls: string[] = [];

  if (company.logo_url) rawUrls.push(company.logo_url);

  for (const inst of instructors) {
    if (inst.photo_url) rawUrls.push(inst.photo_url);
  }

  for (const t of (course.testimonials || [])) {
    if (t.thumbnail_url) rawUrls.push(t.thumbnail_url);
  }

  for (const logo of (course.partner_logos || [])) {
    if (logo.url) rawUrls.push(logo.url);
  }

  // Deduplicate
  const unique = [...new Set(rawUrls)];
  if (unique.length === 0) {
    console.log(`[IMAGES] No images to pre-fetch`);
    return cache;
  }

  console.log(`[IMAGES] Pre-fetching ${unique.length} image(s) in parallel...`);

  // Fetch all in parallel; failures are silenced via Promise.allSettled
  const results = await Promise.allSettled(
    unique.map(async (rawUrl) => {
      const dataUri = await fetchImageAsDataUri(rawUrl, siteBaseUrl);
      return { rawUrl, dataUri };
    }),
  );

  let successCount = 0;
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.dataUri) {
      cache.set(result.value.rawUrl, result.value.dataUri);
      successCount++;
    }
  }

  console.log(`[IMAGES] Pre-fetch done: ${successCount}/${unique.length} OK`);
  return cache;
}
