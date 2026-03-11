import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../lib/types.ts';
import { getFontFamily } from '../lib/fonts.ts';
import type { FontData } from '../lib/types.ts';

/**
 * Page 1 — Cover
 * Large company logo, category label, title with colored parts,
 * subtitle, instructor card, bottom info bar
 */
export function renderCover(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, instructors, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent = ds.color_accent || ds.color_primary_light;
  const instructor = instructors[0];

  // Format date range
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  // Calculate total hours from program_days
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

  // Build title parts
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
    // Company Logo / Name at top
    company.logo_url
      ? h('img', {
          src: company.logo_url.startsWith('/') ? `${ctx.siteBaseUrl}${company.logo_url}` : company.logo_url,
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

    // Spacer
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 40 } }),

    // Category label ("IMERSÃO")
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

    // Title with colored parts
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
            fontSize: 52,
            fontFamily: heading,
            fontWeight: 700,
            color: part.color === 'accent' ? accent : '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15,
          },
        }, part.text),
      ),
    ),

    // Subtitle
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

    // Instructor Card
    instructor
      ? h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            alignSelf: 'center',
            padding: '16px 32px',
            borderRadius: 16,
            backgroundColor: `${ds.color_surface}cc`,
            border: `1px solid ${ds.color_primary}33`,
            marginBottom: 40,
          },
        },
          instructor.photo_url
            ? h('img', {
                src: instructor.photo_url.startsWith('/') ? `${ctx.siteBaseUrl}${instructor.photo_url}` : instructor.photo_url,
                width: 72,
                height: 72,
                style: { borderRadius: '50%', objectFit: 'cover' },
              })
            : h('div', {
                style: {
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontFamily: heading,
                  fontWeight: 700,
                  color: '#ffffff',
                },
              }, instructor.name.charAt(0)),
          h('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 4 },
          },
            h('span', {
              style: { fontSize: 12, fontFamily: body, color: '#ffffff88', textTransform: 'uppercase', letterSpacing: 2 },
            }, 'Palestrante'),
            h('span', {
              style: { fontSize: 22, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
            }, instructor.name),
            instructor.role
              ? h('span', {
                  style: { fontSize: 14, fontFamily: body, color: '#ffffffaa' },
                }, instructor.role)
              : null,
          ),
        )
      : h('div', { style: { marginBottom: 40 } }),

    // Spacer
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 20 } }),

    // Bottom info bar
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
      // Carga Horária
      _infoColumn('Carga Horária', totalHours, body, primary),
      // Local
      _infoColumn('Local', courseDate.location_venue || 'A definir', body, primary),
      // Data
      _infoColumn('Data', dateStr, body, primary),
    ),
  );
}

function _infoColumn(label: string, value: string, fontFamily: string, accentColor: string): SatoriNode {
  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      gap: 6,
    },
  },
    h('span', {
      style: { fontSize: 12, fontFamily, color: '#ffffff88', textTransform: 'uppercase', letterSpacing: 1.5 },
    }, label),
    h('span', {
      style: { fontSize: 18, fontFamily, fontWeight: 700, color: accentColor, textAlign: 'center' },
    }, value),
  );
}
