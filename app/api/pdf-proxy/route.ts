import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side image proxy for the PDF generator.
 *
 * The browser-side PDF pipeline (satori + resvg) needs to pre-fetch all images
 * as base64 data URIs before rendering. Browser `fetch()` is blocked by CORS when
 * images live on a different origin (e.g. plenumbrasil.com.br vs. admin subdomain).
 *
 * This route fetches the image server-side (no CORS restrictions) and returns the
 * raw bytes so the client can convert them to a data URI.
 *
 * Usage: GET /api/pdf-proxy?url=<encoded-image-url>
 */

const TIMEOUT_MS = 10_000;
const ALLOWED_MIME_PREFIXES = ['image/'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  // Security: only allow http/https URLs
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      // Server-side fetch — no CORS restrictions apply here
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned HTTP ${res.status}` },
        { status: 502 },
      );
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim();

    // Only proxy images — reject HTML error pages etc.
    if (!ALLOWED_MIME_PREFIXES.some((p) => mimeType.startsWith(p))) {
      return NextResponse.json(
        { error: `Unexpected content-type: ${mimeType}` },
        { status: 422 },
      );
    }

    const buf = await res.arrayBuffer();

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        // Cache for 1 hour — images don't change during a PDF generation session
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Fetch failed: ${msg}` }, { status: 502 });
  }
}
