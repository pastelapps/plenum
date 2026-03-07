import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getCheckIcon } from '../icons';
import type { FontData } from '../types';

export function renderClosing(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, company, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

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
    h('div', {
      style: {
        display: 'flex',
        fontSize: 36,
        fontFamily: heading,
        fontWeight: 700,
        color: primary,
        marginBottom: 12,
        borderBottom: `3px solid ${primary}`,
        paddingBottom: 16,
      },
    }, course.investment_heading || 'Garanta sua Vaga'),

    course.investment_subtitle
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 18,
            fontFamily: body,
            color: '#ffffffcc',
            marginBottom: 24,
            lineHeight: 1.4,
          },
        }, course.investment_subtitle)
      : null,

    ...(course.included_items && course.included_items.length > 0
      ? [
          h('div', {
            style: { display: 'flex', fontSize: 22, fontFamily: heading, fontWeight: 700, color: '#ffffff', marginBottom: 16 },
          }, 'O que está incluso:'),
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 } },
            ...(course.included_items || []).map((item) =>
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
                getCheckIcon(24, primary),
                h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, item.text),
              ),
            ),
          ),
        ]
      : []),

    ...(course.testimonials && course.testimonials.length > 0
      ? [
          h('div', {
            style: {
              display: 'flex',
              fontSize: 24,
              fontFamily: heading,
              fontWeight: 700,
              color: primary,
              marginBottom: 16,
              marginTop: 8,
            },
          }, 'Depoimentos'),
          h('div', { style: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' } },
            ...course.testimonials.slice(0, 4).map((t) =>
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 12,
                  backgroundColor: `${ds.color_surface}cc`,
                  border: `1px solid ${primary}22`,
                },
              },
                t.thumbnail_url
                  ? h('img', {
                      src: ctx.imageCache.get(t.thumbnail_url) ??
                        (t.thumbnail_url.startsWith('/') ? `${ctx.siteBaseUrl}${t.thumbnail_url}` : t.thumbnail_url),
                      width: 48,
                      height: 48,
                      style: { borderRadius: '50%', objectFit: 'cover' },
                    })
                  : h('div', {
                      style: {
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: heading,
                      },
                    }, t.name.charAt(0)),
                h('div', { style: { display: 'flex', flexDirection: 'column' } },
                  h('span', { style: { fontSize: 15, fontFamily: heading, fontWeight: 600, color: '#ffffff' } }, t.name),
                  t.role
                    ? h('span', { style: { fontSize: 12, fontFamily: body, color: '#ffffffaa' } }, t.role)
                    : null,
                ),
              ),
            ),
          ),
        ]
      : []),

    ...(course.partner_logos && course.partner_logos.length > 0
      ? [
          h('div', {
            style: {
              display: 'flex',
              fontSize: 18,
              fontFamily: heading,
              fontWeight: 600,
              color: '#ffffff88',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            },
          }, 'Parceiros'),
          h('div', {
            style: { display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 28 },
          },
            ...course.partner_logos.map((logo) => {
              const imgSrc = logo.url
                ? (ctx.imageCache.get(logo.url) ??
                    (logo.url.startsWith('/') ? `${ctx.siteBaseUrl}${logo.url}` : logo.url))
                : '';
              return imgSrc
                ? h('img', {
                    src: imgSrc,
                    width: logo.width || 120,
                    height: logo.height || 48,
                    style: { objectFit: 'contain' },
                  })
                : h('span', {
                    style: { fontSize: 14, fontFamily: body, color: '#ffffff88' },
                  }, logo.name);
            }),
          ),
        ]
      : []),

    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 10 } }),

    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '24px 0',
        borderTop: `1px solid ${primary}33`,
      },
    },
      h('span', { style: { fontSize: 20, fontFamily: heading, fontWeight: 700, color: '#ffffff' } }, company.company_name),
      company.website
        ? h('span', { style: { fontSize: 14, fontFamily: body, color: primary } }, company.website)
        : null,
      company.phones && company.phones.length > 0
        ? h('span', { style: { fontSize: 13, fontFamily: body, color: '#ffffffaa' } },
            company.phones.map((p) => `${p.label}: ${p.number}`).join(' | '))
        : null,
      company.emails && company.emails.length > 0
        ? h('span', { style: { fontSize: 13, fontFamily: body, color: '#ffffffaa' } },
            company.emails.map((e) => e.email).join(' | '))
        : null,
      company.address
        ? h('span', {
            style: { fontSize: 12, fontFamily: body, color: '#ffffff77', textAlign: 'center', maxWidth: 600 },
          }, company.address)
        : null,
    ),
  );
}
