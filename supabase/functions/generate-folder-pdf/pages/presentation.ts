import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../lib/types.ts';
import { getFontFamily } from '../lib/fonts.ts';
import { getIcon } from '../lib/icons.ts';
import type { FontData } from '../lib/types.ts';

/**
 * Page 2 — Apresentação + Público-Alvo
 * Presentation text, audience cards, info bar
 */
export function renderPresentation(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  // Presentation text: use about_description, fallback to about_subheading
  const presentationText = course.about_description || course.about_subheading || '';

  // Date info
  const startDate = new Date(courseDate.start_date);
  const endDate = new Date(courseDate.end_date);
  const dateStr = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const totalHours = courseDate.program_days?.length ? `${courseDate.program_days.length * 4}h` : '20h';

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
    // "Apresentação" heading
    h('div', {
      style: {
        display: 'flex',
        fontSize: 40,
        fontFamily: heading,
        fontWeight: 700,
        color: primary,
        marginBottom: 24,
        borderBottom: `3px solid ${primary}`,
        paddingBottom: 16,
      },
    }, 'Apresentação'),

    // Presentation text
    presentationText
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 20,
            fontFamily: body,
            fontWeight: 400,
            color: '#ffffffdd',
            lineHeight: 1.6,
            marginBottom: 40,
          },
        }, presentationText)
      : null,

    // Info bar (carga horária, local, data)
    h('div', {
      style: {
        display: 'flex',
        gap: 16,
        padding: '20px 24px',
        borderRadius: 16,
        backgroundColor: `${ds.color_surface}cc`,
        marginBottom: 40,
      },
    },
      _infoPill('Carga Horária', totalHours, body),
      _infoPill('Local', courseDate.location_venue || 'A definir', body),
      _infoPill('Data', dateStr, body),
    ),

    // "Para Quem?" heading
    course.audience_cards && course.audience_cards.length > 0
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 32,
            fontFamily: heading,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 24,
          },
        }, 'Para Quem é Este Curso?')
      : null,

    // Audience cards — linear layout
    ...(course.audience_cards || []).map((card) =>
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          padding: '16px 20px',
          marginBottom: 12,
          borderRadius: 12,
          backgroundColor: `${ds.color_surface}88`,
          border: `1px solid ${primary}22`,
        },
      },
        h('div', {
          style: {
            display: 'flex',
            flexShrink: 0,
            marginTop: 2,
          },
        }, getIcon(card.icon, 28, primary)),
        h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: 4 },
        },
          h('span', {
            style: { fontSize: 18, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
          }, card.title),
          h('span', {
            style: { fontSize: 15, fontFamily: body, color: '#ffffffbb', lineHeight: 1.4 },
          }, card.description),
        ),
      ),
    ),
  );
}

function _infoPill(label: string, value: string, fontFamily: string): SatoriNode {
  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
  },
    h('span', {
      style: { fontSize: 11, fontFamily, color: '#ffffff77', textTransform: 'uppercase', letterSpacing: 1.5 },
    }, label),
    h('span', {
      style: { fontSize: 16, fontFamily, fontWeight: 600, color: '#ffffffdd' },
    }, value),
  );
}
