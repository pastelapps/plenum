import { h, getImageSrc, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

/**
 * Page 8 — Palestrantes
 * Lists all course instructors with their square photo, name, role and bio.
 * Layout follows the reference PDF structure using our design system colours.
 */
export function renderSpeakers(ctx: PdfContext, fonts: FontData[]): SatoriNode | null {
  const { instructors, ds, company } = ctx;
  if (!instructors.length) return null;

  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

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

    // ── Breadcrumb label ────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 11,
        fontFamily: body,
        color: `${primary}99`,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 4,
      },
    }, 'Palestrantes'),

    // ── Section sub-label ───────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 13,
        fontFamily: body,
        fontWeight: 600,
        color: primary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
      },
    }, 'Corpo Docente'),

    // ── Page title ──────────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 52,
        fontFamily: heading,
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: 10,
      },
    }, 'Palestrantes'),

    // ── Accent underline ────────────────────────────────────
    h('div', {
      style: {
        width: 56,
        height: 4,
        backgroundColor: primary,
        borderRadius: 2,
        marginBottom: 16,
      },
    }),

    // ── Sub-heading ─────────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 16,
        fontFamily: body,
        color: '#ffffffaa',
        marginBottom: 36,
      },
    }, 'Conheça os profissionais que conduzirão o curso.'),

    // ── Instructor cards ────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        flex: 1,
      },
    },
      ...instructors.map((inst) => {
        const photoSrc = getImageSrc(ctx.imageCache, inst.photo_url, ctx.siteBaseUrl);
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 28,
            padding: '20px 28px',
            borderRadius: 16,
            backgroundColor: `${ds.color_surface}cc`,
            border: `1px solid ${primary}33`,
          },
        },
          // Square photo — no circle clip
          photoSrc
            ? h('img', {
                src: photoSrc,
                width: 120,
                height: 140,
                style: {
                  borderRadius: 8,
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: `2px solid ${primary}44`,
                },
              })
            : h('div', {
                style: {
                  width: 120,
                  height: 140,
                  borderRadius: 8,
                  backgroundColor: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                  fontFamily: heading,
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0,
                },
              }, inst.name.charAt(0)),

          // Name / role / bio
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              flex: 1,
            },
          },
            h('span', {
              style: { fontSize: 26, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
            }, inst.name),

            inst.role
              ? h('span', {
                  style: { fontSize: 15, fontFamily: body, fontWeight: 600, color: accent },
                }, inst.role)
              : null,

            inst.bio
              ? h('span', {
                  style: { fontSize: 14, fontFamily: body, color: '#ffffffaa', lineHeight: 1.5 },
                }, inst.bio)
              : null,
          ),
        );
      }),
    ),

    // ── Footer ──────────────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 16,
        borderTop: `1px solid ${primary}22`,
        marginTop: 16,
        fontSize: 11,
        fontFamily: body,
        color: '#ffffff33',
        textTransform: 'uppercase',
        letterSpacing: 2,
      },
    }, company.company_name),
  );
}
