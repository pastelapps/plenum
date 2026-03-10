import { h, getImageSrc, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getCheckIcon } from '../icons';
import { STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Page 9 — Fotos do Evento + Kit Participante
 *
 * Event photos: 5-photo mosaic (3 on top row, 2 on bottom row)
 * Kit Participante: product photo left + included items checklist right
 */
export function renderGallery(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

  // Resolve cached srcs for all 5 photos
  const photoSrcs = STATIC_PDF_IMAGES.eventPhotos.map((url) =>
    getImageSrc(ctx.imageCache, url, ctx.siteBaseUrl),
  );

  const kitSrc = getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.kitParticipant, ctx.siteBaseUrl);

  const items = course.included_items && course.included_items.length > 0
    ? course.included_items
    : [
        { text: 'Material didático completo (digital e impresso)' },
        { text: 'Coffee break durante todo o evento' },
        { text: 'Certificado de conclusão — 30 horas' },
        { text: 'Acesso às apresentações e materiais complementares' },
        { text: 'Suporte pós-curso para dúvidas e orientação' },
        { text: 'Acesso à comunidade exclusiva de ex-alunos' },
      ];

  const innerW = PAGE_W - PAD * 2;

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: ds.color_background,
      padding: PAD,
    },
  },

    // ═══════════════════════════════════════════════════════
    // SECTION 1 — Fotos do Evento
    // ═══════════════════════════════════════════════════════

    h('div', {
      style: {
        display: 'flex',
        fontSize: 12,
        fontFamily: body,
        color: primary,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 6,
      },
    }, 'Registros'),

    h('div', {
      style: { display: 'flex', fontSize: 44, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
    }, 'Fotos do Evento'),

    h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 12 } }),

    h('div', {
      style: { display: 'flex', fontSize: 15, fontFamily: body, color: '#ffffffaa', marginBottom: 16 },
    }, 'Confira alguns registros de edições anteriores do nosso curso.'),

    // ── Photo mosaic 3 + 2 ───────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 36,
        width: innerW,
      },
    },
      // Row 1 — 3 photos (flex: 1.3 | 1 | 1)
      h('div', { style: { display: 'flex', gap: 8, height: 210 } },
        _photoCell(photoSrcs[0], 1.3, ds, primary),
        _photoCell(photoSrcs[1], 1,   ds, primary),
        _photoCell(photoSrcs[2], 1,   ds, primary),
      ),
      // Row 2 — 2 photos (flex: 1.4 | 1)
      h('div', { style: { display: 'flex', gap: 8, height: 190 } },
        _photoCell(photoSrcs[3], 1.4, ds, primary),
        _photoCell(photoSrcs[4], 1,   ds, primary),
      ),
    ),

    // ═══════════════════════════════════════════════════════
    // SECTION 2 — Kit Participante
    // ═══════════════════════════════════════════════════════

    h('div', {
      style: {
        display: 'flex',
        fontSize: 12,
        fontFamily: body,
        color: accent,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 6,
      },
    }, 'Material Exclusivo'),

    h('div', {
      style: { display: 'flex', fontSize: 38, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
    }, 'Kit Participante'),

    h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 20 } }),

    // Kit image + item list (side by side)
    h('div', {
      style: { display: 'flex', flexDirection: 'row', gap: 36, alignItems: 'flex-start' },
    },
      kitSrc
        ? h('img', {
            src: kitSrc,
            width: 210,
            height: 230,
            style: { borderRadius: 12, objectFit: 'contain', flexShrink: 0 },
          })
        : h('div', {
            style: {
              width: 210,
              height: 230,
              borderRadius: 12,
              backgroundColor: `${ds.color_surface}66`,
              flexShrink: 0,
            },
          }),

      h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: 14, flex: 1, paddingTop: 8 },
      },
        ...items.map((item) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            getCheckIcon(22, primary),
            h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, item.text),
          ),
        ),
      ),
    ),

    // ── Footer ───────────────────────────────────────────
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 16 } }),
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 16,
        borderTop: `1px solid ${primary}22`,
        fontSize: 11,
        fontFamily: body,
        color: '#ffffff33',
        textTransform: 'uppercase',
        letterSpacing: 2,
      },
    }, company.company_name),
  );
}

/** Render a single photo cell in the mosaic grid */
function _photoCell(
  src: string | null,
  flex: number,
  ds: { color_surface: string },
  primary: string,
): SatoriNode {
  if (src) {
    return h('img', {
      src,
      style: {
        flex,
        height: '100%',
        objectFit: 'cover',
        borderRadius: 10,
        minWidth: 0,
      },
    });
  }
  // Placeholder when image not available
  return h('div', {
    style: {
      flex,
      height: '100%',
      borderRadius: 10,
      backgroundColor: `${ds.color_surface}88`,
      border: `1px solid ${primary}22`,
      minWidth: 0,
    },
  });
}
