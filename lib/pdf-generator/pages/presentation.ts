import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

export function renderPresentation(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

  const presentationText = course.about_description || course.about_subheading || '';

  const startDate = new Date(courseDate.start_date);
  const endDate   = new Date(courseDate.end_date);
  const dateStr   = `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
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

    // ── Breadcrumb label ─────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 12,
        fontFamily: body,
        color: `${primary}99`,
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginBottom: 6,
      },
    }, 'O Curso'),

    // ── Page title ───────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 52,
        fontFamily: heading,
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: 10,
      },
    }, 'Apresentação'),

    // ── Accent underline ─────────────────────────────────
    h('div', { style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 24 } }),

    // ── Presentation text ────────────────────────────────
    presentationText
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 17,
            fontFamily: body,
            color: '#ffffffcc',
            lineHeight: 1.65,
            marginBottom: 36,
          },
        }, presentationText)
      : null,

    // ── Info bar ─────────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        gap: 0,
        borderRadius: 16,
        backgroundColor: `${ds.color_surface}cc`,
        border: `1px solid ${primary}22`,
        marginBottom: 44,
        overflow: 'hidden',
      },
    },
      _infoPill('Carga Horária', totalHours, body, primary, false),
      _infoPillDivider(primary),
      _infoPill('Local', courseDate.location_venue || 'A definir', body, primary, false),
      _infoPillDivider(primary),
      _infoPill('Data', dateStr, body, primary, true),
    ),

    // ── "Para Quem" section ──────────────────────────────
    course.audience_cards && course.audience_cards.length > 0
      ? h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
          },
        },
          h('div', {
            style: {
              display: 'flex',
              fontSize: 12,
              fontFamily: body,
              color: `${primary}99`,
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 6,
            },
          }, 'Público-Alvo'),
          h('div', {
            style: {
              display: 'flex',
              fontSize: 44,
              fontFamily: heading,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 10,
            },
          }, 'Para Quem é Este Curso?'),
          h('div', { style: { width: 56, height: 4, backgroundColor: accent, borderRadius: 2, marginBottom: 28 } }),

          h('div', {
            style: { display: 'flex', flexDirection: 'column', gap: 16 },
          },
            ...(course.audience_cards || []).map((card) =>
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  padding: '22px 28px',
                  borderRadius: 14,
                  backgroundColor: `${ds.color_surface}99`,
                  border: `1px solid ${primary}22`,
                },
              },
                h('div', { style: { display: 'flex', flexShrink: 0, marginTop: 2 } }, getIcon(card.icon, 30, primary)),
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
                  h('span', { style: { fontSize: 18, fontFamily: heading, fontWeight: 700, color: '#ffffff' } }, card.title),
                  h('span', { style: { fontSize: 15, fontFamily: body, color: '#ffffffbb', lineHeight: 1.5 } }, card.description),
                ),
              ),
            ),
          ),
        )
      : null,
  );
}

function _infoPill(label: string, value: string, fontFamily: string, primary: string, last: boolean): SatoriNode {
  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      gap: 6,
      padding: '20px 16px',
    },
  },
    h('span', { style: { fontSize: 11, fontFamily, color: '#ffffff55', textTransform: 'uppercase', letterSpacing: 2 } }, label),
    h('span', { style: { fontSize: 17, fontFamily, fontWeight: 700, color: '#ffffffdd', textAlign: 'center' } }, value),
  );
}

function _infoPillDivider(primary: string): SatoriNode {
  return h('div', {
    style: { width: 1, backgroundColor: `${primary}22`, alignSelf: 'stretch' },
  });
}
