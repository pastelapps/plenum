import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode, type ProgramDay } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

/** One day per page — matches reference PDF layout */
const MAX_DAYS_PER_PAGE = 1;

export function renderProgram(ctx: PdfContext, fonts: FontData[]): SatoriNode[] {
  const { courseDate, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const days = courseDate.program_days || [];
  if (days.length === 0) return [];

  const pages: SatoriNode[] = [];
  for (let i = 0; i < days.length; i += MAX_DAYS_PER_PAGE) {
    const chunk = days.slice(i, i + MAX_DAYS_PER_PAGE);
    pages.push(_programPage(chunk, heading, body, primary));
  }
  return pages;
}

function _programPage(
  days: ProgramDay[],
  heading: string,
  body: string,
  primary: string,
): SatoriNode {
  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: '#ffffff',
      padding: PAD,
    },
  },

    // ── Breadcrumb label ─────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 11,
        fontFamily: body,
        color: '#aaaaaa',
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginBottom: 24,
      },
    }, 'Programação'),

    // ── Days ─────────────────────────────────────────────
    ...days.map((day, idx) =>
      h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          marginBottom: idx < days.length - 1 ? 52 : 0,
        },
      },

        // Day badge + time row
        h('div', {
          style: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
        },
          h('span', {
            style: {
              display: 'flex',
              fontSize: 13,
              fontFamily: body,
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: primary,
              padding: '7px 18px',
              borderRadius: 6,
              letterSpacing: 1,
            },
          }, day.tag),
          day.time
            ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                getIcon('Clock', 16, '#999999'),
                h('span', { style: { fontSize: 14, fontFamily: body, color: '#999999' } }, day.time),
              )
            : null,
        ),

        // Day title — large and bold (main typography fix)
        h('div', {
          style: {
            display: 'flex',
            fontSize: 64,
            fontFamily: heading,
            fontWeight: 800,
            color: '#1a1a1a',
            lineHeight: 1.05,
            marginBottom: 14,
          },
        }, day.title),

        // Day description
        day.description
          ? h('div', {
              style: {
                display: 'flex',
                fontSize: 17,
                fontFamily: body,
                color: '#666666',
                lineHeight: 1.55,
                marginBottom: 14,
              },
            }, day.description)
          : null,

        // Accent line
        h('div', {
          style: {
            width: 44,
            height: 4,
            backgroundColor: primary,
            borderRadius: 2,
            marginBottom: 32,
          },
        }),

        // Topic group cards
        h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: 18 },
        },
          ...day.topics.map((topic) =>
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: '22px 28px',
                borderRadius: 12,
                backgroundColor: '#f7f8fa',
                border: `1px solid ${primary}22`,
              },
            },
              // Topic title
              h('span', {
                style: {
                  fontSize: 17,
                  fontFamily: heading,
                  fontWeight: 700,
                  color: '#1a1a1a',
                },
              }, topic.text),

              // Bullet children
              ...(topic.children || []).map((child) =>
                h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 11 } },
                  h('div', {
                    style: {
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: primary,
                      flexShrink: 0,
                      marginTop: 7,
                    },
                  }),
                  h('span', {
                    style: { fontSize: 14, fontFamily: body, color: '#555555', lineHeight: 1.45 },
                  }, child),
                ),
              ),
            ),
          ),
        ),
      ),
    ),

    // ── Footer ───────────────────────────────────────────
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 16 } }),
    h('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTop: `1px solid #e8e8e8`,
        fontSize: 11,
        fontFamily: body,
        color: '#cccccc',
        textTransform: 'uppercase',
        letterSpacing: 2,
      },
    },
      h('span', {}, days[0]?.tag || ''),
      h('span', {}, ''),
    ),
  );
}
