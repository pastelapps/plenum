import { h, getImageSrc, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getCheckIcon } from '../icons';
import { STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Page 9 — Fotos do Evento + Kit Participante
 * Static company promotional page identical across all generated PDFs.
 * Set STATIC_PDF_IMAGES.eventBanner and .kitParticipant in config.ts.
 */
export function renderGallery(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

  const bannerSrc = STATIC_PDF_IMAGES.eventBanner
    ? getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.eventBanner, ctx.siteBaseUrl)
    : null;

  const kitSrc = STATIC_PDF_IMAGES.kitParticipant
    ? getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.kitParticipant, ctx.siteBaseUrl)
    : null;

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

    // Section label
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

    // Title
    h('div', {
      style: { display: 'flex', fontSize: 44, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
    }, 'Fotos do Evento'),

    // Accent underline
    h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 14 } }),

    // Sub-heading
    h('div', {
      style: { display: 'flex', fontSize: 15, fontFamily: body, color: '#ffffffaa', marginBottom: 20 },
    }, 'Confira alguns registros de edições anteriores do nosso curso.'),

    // Event banner (or placeholder)
    bannerSrc
      ? h('img', {
          src: bannerSrc,
          width: PAGE_W - PAD * 2,
          height: 270,
          style: { borderRadius: 12, objectFit: 'cover', marginBottom: 36 },
        })
      : h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            borderRadius: 12,
            backgroundColor: `${ds.color_surface}88`,
            border: `1px solid ${primary}22`,
            marginBottom: 36,
          },
        },
          h('span', {
            style: { fontSize: 22, fontFamily: heading, fontWeight: 700, color: `${primary}88` },
          }, 'NOTÓRIA ESPECIALIZAÇÃO'),
          h('span', {
            style: { fontSize: 13, fontFamily: body, color: '#ffffff55', marginTop: 8 },
          }, 'Capacitações com foco no dia a dia do serviço público'),
        ),

    // ═══════════════════════════════════════════════════════
    // SECTION 2 — Kit Participante
    // ═══════════════════════════════════════════════════════

    // Section label
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

    // Title
    h('div', {
      style: { display: 'flex', fontSize: 38, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
    }, 'Kit Participante'),

    // Accent underline
    h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 20 } }),

    // Kit image + item list (side by side)
    h('div', {
      style: { display: 'flex', flexDirection: 'row', gap: 36, alignItems: 'flex-start' },
    },
      kitSrc
        ? h('img', {
            src: kitSrc,
            width: 220,
            height: 240,
            style: { borderRadius: 10, objectFit: 'cover', flexShrink: 0 },
          })
        : h('div', {
            style: {
              width: 220,
              height: 240,
              borderRadius: 10,
              backgroundColor: `${ds.color_surface}66`,
              flexShrink: 0,
            },
          }),

      h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: 14, flex: 1 },
      },
        ...items.map((item) =>
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            getCheckIcon(22, primary),
            h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, item.text),
          ),
        ),
      ),
    ),

    // ── Footer ───────────────────────────────────────────────
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
