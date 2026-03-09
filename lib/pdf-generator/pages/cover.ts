import { h, getImageSrc, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import type { FontData } from '../types';

export function renderCover(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, instructors, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent = ds.color_accent || ds.color_primary_light;
  const instructor = instructors[0];

  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

  const titleParts = course.title_parts && course.title_parts.length > 0
    ? course.title_parts
    : [{ text: course.title, color: 'white' as const }];

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: ds.color_background,
      padding: PAD,
      position: 'relative',
    },
  },
    getImageSrc(ctx.imageCache, company.logo_url, ctx.siteBaseUrl)
      ? h('img', {
          src: getImageSrc(ctx.imageCache, company.logo_url, ctx.siteBaseUrl)!,
          width: 280,
          height: 80,
          style: { objectFit: 'contain', alignSelf: 'center', marginTop: 30 },
        })
      : h('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: 30,
            fontSize: 36,
            fontFamily: heading,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: 4,
          },
        }, company.company_name.toUpperCase()),

    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 40 } }),

    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: 56,
        fontFamily: heading,
        fontWeight: 800,
        color: primary,
        letterSpacing: 8,
        textTransform: 'uppercase',
        marginBottom: 20,
      },
    }, (course.category_label || 'IMERSÃO').toUpperCase()),

    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
      },
    },
      ...titleParts.map((part) =>
        h('span', {
          style: {
            fontSize: 64,
            fontFamily: heading,
            fontWeight: 800,
            color: part.color === 'accent' ? accent : '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
          },
        }, part.text),
      ),
    ),

    course.subtitle
      ? h('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            fontSize: 24,
            fontFamily: body,
            fontWeight: 400,
            color: '#ffffffcc',
            textAlign: 'center',
            marginBottom: 40,
            paddingLeft: 40,
            paddingRight: 40,
            lineHeight: 1.4,
          },
        }, course.subtitle)
      : h('div', { style: { marginBottom: 40 } }),

    instructor
      ? h('div', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 40,
            alignSelf: 'center',
            padding: '28px 44px',
            borderRadius: 20,
            backgroundColor: `${ds.color_surface}bb`,
            border: `1px solid ${primary}33`,
            marginBottom: 32,
          },
        },
          // Large portrait photo — square, no circle clip
          getImageSrc(ctx.imageCache, instructor.photo_url, ctx.siteBaseUrl)
            ? h('img', {
                src: getImageSrc(ctx.imageCache, instructor.photo_url, ctx.siteBaseUrl)!,
                width: 260,
                height: 310,
                style: { borderRadius: 12, objectFit: 'cover', flexShrink: 0 },
              })
            : h('div', {
                style: {
                  width: 260,
                  height: 310,
                  borderRadius: 12,
                  backgroundColor: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 100,
                  fontFamily: heading,
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0,
                },
              }, instructor.name.charAt(0)),
          // Name + role — large and expressive
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 } },
            h('span', {
              style: { fontSize: 13, fontFamily: body, color: '#ffffff55', textTransform: 'uppercase', letterSpacing: 3 },
            }, 'Palestrante'),
            h('span', {
              style: { fontSize: 52, fontFamily: heading, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 },
            }, instructor.name),
            instructor.role
              ? h('span', {
                  style: { fontSize: 24, fontFamily: body, color: primary, marginTop: 4 },
                }, instructor.role)
              : null,
            instructor.bio
              ? h('span', {
                  style: { fontSize: 15, fontFamily: body, color: '#ffffffaa', lineHeight: 1.55, marginTop: 8 },
                }, instructor.bio.length > 130 ? instructor.bio.slice(0, 130) + '…' : instructor.bio)
              : null,
          ),
        )
      : h('div', { style: { marginBottom: 40 } }),

    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 20 } }),

    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '24px 32px',
        borderRadius: 20,
        backgroundColor: `${ds.color_surface}dd`,
        border: `1px solid ${ds.color_primary}22`,
      },
    },
      _infoColumn('Carga Horária', totalHours, body, primary),
      _infoColumn('Local', courseDate.location_venue || 'A definir', body, primary),
      _infoColumn('Data', dateStr, body, primary),
    ),
  );
}

function _infoColumn(label: string, value: string, fontFamily: string, accentColor: string): SatoriNode {
  return h('div', {
    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 6 },
  },
    h('span', {
      style: { fontSize: 12, fontFamily, color: '#ffffff88', textTransform: 'uppercase', letterSpacing: 1.5 },
    }, label),
    h('span', {
      style: { fontSize: 18, fontFamily, fontWeight: 700, color: accentColor, textAlign: 'center' },
    }, value),
  );
}
