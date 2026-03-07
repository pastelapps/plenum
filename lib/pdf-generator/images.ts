import type { PdfContext, ImageCache } from './types';

export type { ImageCache };

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[PDF Images] HTTP ${res.status} for ${url.slice(0, 80)}`);
      return '';
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim();

    if (mimeType === 'text/html' || mimeType === 'text/plain') {
      console.warn(`[PDF Images] Got ${mimeType} instead of image for ${url.slice(0, 80)}`);
      return '';
    }

    const buf = await res.arrayBuffer();
    const b64 = arrayBufferToBase64(buf);
    return `data:${mimeType};base64,${b64}`;
  } catch (err) {
    console.warn(`[PDF Images] Failed ${url.slice(0, 80)}:`, err instanceof Error ? err.message : err);
    return '';
  }
}

/**
 * Pre-load ALL images referenced in the PDF context in parallel.
 */
export async function preloadImages(ctx: PdfContext): Promise<ImageCache> {
  const { company, instructors, course, siteBaseUrl } = ctx;
  const cache: ImageCache = new Map();

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

  const unique = [...new Set(rawUrls)];
  if (unique.length === 0) return cache;

  console.log(`[PDF Images] Pre-fetching ${unique.length} image(s)...`);

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

  console.log(`[PDF Images] Done: ${successCount}/${unique.length} OK`);
  return cache;
}
