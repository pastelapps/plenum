import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode, type ProgramDay } from '../lib/types.ts';
import { getFontFamily } from '../lib/fonts.ts';
import { getCheckIcon } from '../lib/icons.ts';
import type { FontData } from '../lib/types.ts';

const MAX_DAYS_PER_PAGE = 2;

/**
 * Pages 4+ — Programação
 * White background, instructor card (first page only),
 * program days with topics. Returns multiple pages if needed.
 */
export function renderProgram(ctx: PdfContext, fonts: FontData[]): SatoriNode[] {
  const { courseDate, instructors, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const instructor = instructors[0];

  const days = courseDate.program_days || [];
  if (days.length === 0) return [];

  // Split days into pages
  const pages: SatoriNode[] = [];
  for (let i = 0; i < days.length; i += MAX_DAYS_PER_PAGE) {
    const chunk = days.slice(i, i + MAX_DAYS_PER_PAGE);
    const isFirstPage = i === 0;
    pages.push(_programPage(chunk, isFirstPage, instructor, heading, body, primary, ds, ctx));
  }

  return pages;
}

function _programPage(
  days: ProgramDay[],
  showInstructor: boolean,
  instructor: { name: string; role: string | null; photo_url: string | null } | undefined,
  heading: string,
  body: string,
  primary: string,
  ds: { color_surface: string },
  ctx: PdfContext,
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
    // Instructor card (first program page only)
    showInstructor && instructor
      ? h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 24px',
            borderRadius: 16,
            backgroundColor: '#f8f9fa',
            border: `1px solid ${primary}22`,
            marginBottom: 24,
          },
        },
          instructor.photo_url
            ? h('img', {
                src: ctx.imageCache.get(instructor.photo_url) ??
                  (instructor.photo_url.startsWith('/') ? `${ctx.siteBaseUrl}${instructor.photo_url}` : instructor.photo_url),
                width: 56,
                height: 56,
                style: { borderRadius: '50%', objectFit: 'cover' },
              })
            : h('div', {
                style: {
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: heading,
                },
              }, instructor.name.charAt(0)),
          h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('span', { style: { fontSize: 18, fontFamily: heading, fontWeight: 700, color: '#1a1a1a' } }, instructor.name),
            instructor.role
              ? h('span', { style: { fontSize: 13, fontFamily: body, color: '#666666' } }, instructor.role)
              : null,
          ),
        )
      : null,

    // "Programação" heading
    showInstructor
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 36,
            fontFamily: heading,
            fontWeight: 700,
            color: primary,
            marginBottom: 24,
            borderBottom: `3px solid ${primary}`,
            paddingBottom: 12,
          },
        }, 'Programação')
      : null,

    // Days
    ...days.map((day) =>
      h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 28,
        },
      },
        // Day tag + time
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          },
        },
          h('span', {
            style: {
              fontSize: 14,
              fontFamily: body,
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: primary,
              padding: '6px 14px',
              borderRadius: 8,
            },
          }, day.tag),
          h('span', {
            style: { fontSize: 14, fontFamily: body, color: '#888888' },
          }, day.time),
        ),

        // Module title
        h('div', {
          style: {
            display: 'flex',
            fontSize: 22,
            fontFamily: heading,
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 8,
            marginTop: 8,
          },
        }, day.title),

        // Description
        day.description
          ? h('div', {
              style: {
                display: 'flex',
                fontSize: 14,
                fontFamily: body,
                color: '#555555',
                marginBottom: 12,
                lineHeight: 1.4,
              },
            }, day.description)
          : null,

        // Topics
        ...day.topics.map((topic) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 8,
            },
          },
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              },
            },
              getCheckIcon(20, primary),
              h('span', {
                style: { fontSize: 15, fontFamily: body, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 },
              }, topic.text),
            ),
            // Subtopics
            ...(topic.children || []).map((child) =>
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginLeft: 30,
                  marginTop: 4,
                },
              },
                h('div', {
                  style: { width: 6, height: 6, borderRadius: '50%', backgroundColor: primary, marginTop: 6, flexShrink: 0 },
                }),
                h('span', {
                  style: { fontSize: 13, fontFamily: body, color: '#444444', lineHeight: 1.3 },
                }, child),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
