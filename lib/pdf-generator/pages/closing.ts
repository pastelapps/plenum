import { h, getImageSrc, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import { STATIC_PDF_IMAGES } from '../config';
import type { FontData } from '../types';

/**
 * Page 11 — Depoimentos + Parceiros + Entre em Contato + Até breve!
 * Dynamic content from course (testimonials, partners) and company settings.
 */
export function renderClosing(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, company, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

  const hasTestimonials = course.testimonials && course.testimonials.length > 0;
  const hasPartners     = course.partner_logos  && course.partner_logos.length  > 0;

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
    // SECTION: Depoimentos
    // ═══════════════════════════════════════════════════════
    ...(hasTestimonials
      ? [
          h('div', {
            style: {
              display: 'flex',
              fontSize: 12,
              fontFamily: body,
              color: `${primary}99`,
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 4,
            },
          }, 'O que Dizem'),

          h('div', {
            style: { display: 'flex', fontSize: 52, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
          }, 'Depoimentos'),

          h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 20 } }),

          h('div', {
            style: { display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
          },
            ...course.testimonials!.slice(0, 4).map((t) => {
              const photoSrc = getImageSrc(ctx.imageCache, t.thumbnail_url, ctx.siteBaseUrl);
              return h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  padding: '20px 24px',
                  borderRadius: 16,
                  backgroundColor: `${ds.color_surface}cc`,
                  border: `1px solid ${primary}22`,
                  flex: 1,
                },
              },
                photoSrc
                  ? h('img', {
                      src: photoSrc,
                      width: 80,
                      height: 80,
                      style: { borderRadius: 8, objectFit: 'cover', border: `2px solid ${primary}44` },
                    })
                  : h('div', {
                      style: {
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        backgroundColor: primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontFamily: heading,
                        fontWeight: 700,
                        color: '#ffffff',
                      },
                    }, t.name.charAt(0)),
                h('span', {
                  style: { fontSize: 15, fontFamily: heading, fontWeight: 700, color: '#ffffff', textAlign: 'center' },
                }, t.name),
                t.role
                  ? h('span', { style: { fontSize: 12, fontFamily: body, color: accent, textAlign: 'center' } }, t.role)
                  : null,
              );
            }),
          ),
        ]
      : []),

    // ═══════════════════════════════════════════════════════
    // SECTION: Parceiros
    // ═══════════════════════════════════════════════════════
    ...(hasPartners
      ? [
          h('div', {
            style: {
              display: 'flex',
              fontSize: 12,
              fontFamily: body,
              color: `${primary}99`,
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 4,
            },
          }, 'Instituições'),

          h('div', {
            style: { display: 'flex', fontSize: 52, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
          }, 'Parceiros'),

          h('div', { style: { width: 50, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 20 } }),

          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
              marginBottom: 32,
            },
          },
            ...course.partner_logos!.map((logo) => {
              const imgSrc = getImageSrc(ctx.imageCache, logo.url, ctx.siteBaseUrl);
              return imgSrc
                ? h('img', {
                    src: imgSrc,
                    width: logo.width  || 110,
                    height: logo.height || 50,
                    style: { objectFit: 'contain' },
                  })
                : h('span', { style: { fontSize: 14, fontFamily: body, color: '#ffffff88' } }, logo.name);
            }),
          ),
        ]
      : []),

    // ═══════════════════════════════════════════════════════
    // SECTION: Entre em Contato
    // ═══════════════════════════════════════════════════════
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 32px',
        borderRadius: 16,
        backgroundColor: `${ds.color_surface}cc`,
        border: `1px solid ${primary}33`,
        marginBottom: 28,
      },
    },
      h('span', {
        style: { fontSize: 22, fontFamily: heading, fontWeight: 700, color: '#ffffff', marginBottom: 20 },
      }, 'Entre em Contato'),

      h('div', {
        style: { display: 'flex', flexDirection: 'row', gap: 48 },
      },
        // Left: phones + emails
        h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: 13, flex: 1 },
        },
          ...(company.phones || []).map((p) =>
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
              getIcon('Phone', 18, primary),
              h('span', { style: { fontSize: 14, fontFamily: body, color: '#ffffffdd' } },
                `${p.label}: ${p.number}`),
            ),
          ),
          ...(company.emails || []).map((e) =>
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
              getIcon('Mail', 18, primary),
              h('span', { style: { fontSize: 14, fontFamily: body, color: '#ffffffdd' } }, e.email),
            ),
          ),
        ),

        // Right: website + address
        h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: 13, flex: 1 },
        },
          company.website
            ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
                getIcon('Globe', 18, primary),
                h('span', { style: { fontSize: 14, fontFamily: body, color: '#ffffffdd' } }, company.website),
              )
            : null,
          company.address
            ? h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
                h('div', { style: { display: 'flex', flexShrink: 0, marginTop: 1 } },
                  getIcon('MapPin', 18, primary),
                ),
                h('span', {
                  style: { fontSize: 14, fontFamily: body, color: '#ffffffdd', lineHeight: 1.5 },
                }, company.address),
              )
            : null,
        ),
      ),
    ),

    // ═══════════════════════════════════════════════════════
    // FOOTER: Logo + "Até breve!" + website
    // ═══════════════════════════════════════════════════════
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 10 } }),
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        paddingTop: 24,
        borderTop: `1px solid ${primary}22`,
      },
    },
      // Logo: company DB logo → static Plenum logo → company name text
      (() => {
        const logoSrc =
          getImageSrc(ctx.imageCache, company.logo_url, ctx.siteBaseUrl) ??
          getImageSrc(ctx.imageCache, STATIC_PDF_IMAGES.logoUrl, ctx.siteBaseUrl);
        return logoSrc
          ? h('img', {
              src: logoSrc,
              width: 220,
              height: 64,
              style: { objectFit: 'contain' },
            })
          : h('span', {
              style: { fontSize: 28, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
            }, company.company_name);
      })(),

      h('span', {
        style: { fontSize: 18, fontFamily: body, color: '#ffffffaa', letterSpacing: 4 },
      }, 'Até breve!'),

      company.website
        ? h('span', {
            style: { fontSize: 12, fontFamily: body, color: '#ffffff44', letterSpacing: 2 },
          }, company.website)
        : null,
    ),
  );
}
