// ─── Image Cache ─────────────────────────────────────────
export type ImageCache = Map<string, string>; // rawUrl → "data:image/jpeg;base64,..."

// ─── PDF Constants ───────────────────────────────────────
export const PAGE_W = 1240;  // A4 @ ~150dpi
export const PAGE_H = 1754;
export const PDF_W = 595.28; // A4 in points
export const PDF_H = 841.89;
export const PAD = 60;       // Default page padding

/**
 * Resolve an image URL from the cache.
 *
 * - Returns the base64 data URI if pre-fetch succeeded.
 * - Returns `null` if pre-fetch failed (cache has '' sentinel) — caller should
 *   render an initials/placeholder fallback instead of an <img>.
 * - Returns the resolved absolute URL if the URL was never attempted (not in cache).
 */
export function getImageSrc(
  imageCache: ImageCache,
  rawUrl: string | null | undefined,
  siteBaseUrl: string,
): string | null {
  if (!rawUrl) return null;
  const cached = imageCache.get(rawUrl);
  if (cached !== undefined) return cached || null; // '' → null (fetch failed → use fallback)
  // Not in cache — URL was never pre-fetched, return resolved URL directly
  return rawUrl.startsWith('/') ? `${siteBaseUrl}${rawUrl}` : rawUrl;
}

// ─── Satori element helper (hyperscript) ─────────────────
export function h(
  type: string,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): SatoriNode {
  const flatChildren = children.flat().filter(Boolean);
  return {
    type,
    props: {
      ...(props || {}),
      children: flatChildren.length === 1 ? flatChildren[0] : flatChildren.length > 0 ? flatChildren : undefined,
    },
  };
}

// ─── Types ───────────────────────────────────────────────
export interface SatoriNode {
  type: string;
  props: Record<string, unknown>;
}

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: 'normal' | 'italic';
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category_label: string | null;
  title_parts: { text: string; color: 'white' | 'accent' }[] | null;
  about_heading: string | null;
  about_subheading: string | null;
  about_description: string | null;
  about_cards: { icon: string; title: string; description: string }[];
  audience_cards: { icon: string; title: string; description: string }[];
  investment_heading: string | null;
  investment_subtitle: string | null;
  included_items: { icon: string; text: string }[];
  testimonials: { name: string; role?: string; thumbnail_url: string; youtube_id: string }[];
  partner_logos: { name: string; url: string; width?: number; height?: number }[];
  folder_pdf_url: string | null;
  cover_image_url: string | null;
}

export interface CourseDateData {
  id: string;
  start_date: string;
  end_date: string;
  label: string | null;
  location_venue: string | null;
  location_address: string | null;
  location_extra: { label: string; value: string; icon?: string }[];
  program_days: ProgramDay[];
  instructor_ids: string[];
  max_students: number | null;
}

export interface ProgramDay {
  tag: string;
  time: string;
  title: string;
  description: string;
  topics: { text: string; children: string[] }[];
}

export interface InstructorData {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
}

export interface DesignSystemData {
  color_primary: string;
  color_primary_hover: string;
  color_primary_light: string;
  color_background: string;
  color_background_alt: string;
  color_surface: string;
  color_surface_alt: string;
  color_accent: string | null;
  color_hero_gradient_mid: string;
  font_heading: string;
  font_body: string;
  font_heading_urls: { weight: number; url: string; format: string }[];
  font_body_urls: { weight: number; url: string; format: string }[];
}

export interface CompanyData {
  company_name: string;
  logo_url: string | null;
  logo_dark_url: string | null;
  phones: { label: string; number: string }[];
  emails: { label: string; email: string }[];
  website: string | null;
  address: string | null;
  cancellation_policy: string | null;
}

export interface PdfContext {
  course: CourseData;
  courseDate: CourseDateData;
  instructors: InstructorData[];
  ds: DesignSystemData;
  company: CompanyData;
  siteBaseUrl: string;
  imageCache: ImageCache;
}
