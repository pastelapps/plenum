import type { PdfContext, ImageCache } from './types';
import { STATIC_PDF_IMAGES } from './config';

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
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    // Relative URLs (starting with '/') are same-origin — fetch directly.
    // No CORS restriction and resolves against the correct local server,
    // not against siteBaseUrl (which points to the production domain).
    // Absolute cross-origin URLs are routed through the server-side proxy
    // to avoid CORS restrictions in the browser.
    const fetchUrl = rawUrl.startsWith('/')
      ? rawUrl
      : `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(fetchUrl, { signal: controller.signal });
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

  // Static promotional images (Gallery page — same in every PDF)
  for (const url of STATIC_PDF_IMAGES.eventPhotos) {
    if (url) rawUrls.push(url);
  }
  if (STATIC_PDF_IMAGES.kitParticipant) rawUrls.push(STATIC_PDF_IMAGES.kitParticipant);
  if (STATIC_PDF_IMAGES.logoUrl)        rawUrls.push(STATIC_PDF_IMAGES.logoUrl);

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
    if (result.status === 'fulfilled') {
      // Always store in cache — empty string '' acts as a sentinel meaning
      // "fetch was attempted but failed". Pages use getImageSrc() which
      // converts '' → null so they render the initials/placeholder fallback
      // instead of passing a broken URL to satori.
      cache.set(result.value.rawUrl, result.value.dataUri);
      if (result.value.dataUri) successCount++;
    }
  }

  console.log(`[PDF Images] Done: ${successCount}/${unique.length} OK`);
  return cache;
}
