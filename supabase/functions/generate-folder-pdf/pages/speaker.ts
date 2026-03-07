import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../lib/types.ts';
import { getFontFamily } from '../lib/fonts.ts';
import type { FontData } from '../lib/types.ts';

/**
 * Speaker Page — Palestrante
 * Large instructor card with photo, name, role, and bio
 */
export function renderSpeaker(ctx: PdfContext, fonts: FontData[]): SatoriNode | null {
  const { instructors, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const instructor = instructors[0];

  if (!instructor) return null;

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
    // Heading
    h('div', {
      style: {
        display: 'flex',
        fontSize: 36,
        fontFamily: heading,
        fontWeight: 700,
        color: primary,
        marginBottom: 32,
        borderBottom: `3px solid ${primary}`,
        paddingBottom: 16,
      },
    }, 'Palestrante'),

    // Speaker card
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '48px 40px',
        borderRadius: 24,
        backgroundColor: `${ds.color_surface}cc`,
        border: `1px solid ${primary}22`,
      },
    },
      // Photo
      instructor.photo_url
        ? h('img', {
            src: ctx.imageCache.get(instructor.photo_url) ??
              (instructor.photo_url.startsWith('/') ? `${ctx.siteBaseUrl}${instructor.photo_url}` : instructor.photo_url),
            width: 200,
            height: 200,
            style: { borderRadius: '50%', objectFit: 'cover', border: `4px solid ${primary}44` },
          })
        : h('div', {
            style: {
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 72,
              fontFamily: heading,
              fontWeight: 700,
              color: '#ffffff',
            },
          }, instructor.name.charAt(0)),

      // Name
      h('span', {
        style: {
          fontSize: 36,
          fontFamily: heading,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
        },
      }, instructor.name),

      // Role
      instructor.role
        ? h('span', {
            style: {
              fontSize: 18,
              fontFamily: body,
              color: primary,
              textAlign: 'center',
              marginTop: -8,
            },
          }, instructor.role)
        : null,

      // Bio
      instructor.bio
        ? h('div', {
            style: {
              display: 'flex',
              fontSize: 17,
              fontFamily: body,
              color: '#ffffffcc',
              lineHeight: 1.65,
              textAlign: 'center',
              maxWidth: 900,
              marginTop: 8,
            },
          }, instructor.bio)
        : null,
    ),

    // Additional instructors (if any)
    ...(ctx.instructors.length > 1
      ? ctx.instructors.slice(1).map((inst) =>
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '20px 28px',
              borderRadius: 16,
              backgroundColor: `${ds.color_surface}88`,
              border: `1px solid ${primary}11`,
              marginTop: 20,
            },
          },
            inst.photo_url
              ? h('img', {
                  src: ctx.imageCache.get(inst.photo_url) ??
                    (inst.photo_url.startsWith('/') ? `${ctx.siteBaseUrl}${inst.photo_url}` : inst.photo_url),
                  width: 64,
                  height: 64,
                  style: { borderRadius: '50%', objectFit: 'cover' },
                })
              : h('div', {
                  style: {
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontFamily: heading,
                    fontWeight: 700,
                    color: '#ffffff',
                  },
                }, inst.name.charAt(0)),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
              h('span', { style: { fontSize: 20, fontFamily: heading, fontWeight: 700, color: '#ffffff' } }, inst.name),
              inst.role ? h('span', { style: { fontSize: 14, fontFamily: body, color: '#ffffffaa' } }, inst.role) : null,
            ),
          ),
        )
      : []),
  );
}
