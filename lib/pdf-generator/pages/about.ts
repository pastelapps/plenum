import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

export function renderAbout(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;

  const cards = course.about_cards || [];
  const rows: typeof cards[] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

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
    course.about_heading
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 40,
            fontFamily: heading,
            fontWeight: 700,
            color: primary,
            marginBottom: 16,
            borderBottom: `3px solid ${primary}`,
            paddingBottom: 16,
          },
        }, course.about_heading)
      : null,

    course.about_subheading
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 20,
            fontFamily: body,
            fontWeight: 400,
            color: '#ffffffcc',
            lineHeight: 1.5,
            marginBottom: 40,
          },
        }, course.about_subheading)
      : null,

    ...rows.map((row) =>
      h('div', { style: { display: 'flex', gap: 20, marginBottom: 20 } },
        ...row.map((card) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '28px 24px',
              borderRadius: 16,
              backgroundColor: `${ds.color_surface}cc`,
              border: `1px solid ${primary}22`,
              gap: 12,
            },
          },
            h('div', { style: { display: 'flex' } }, getIcon(card.icon, 36, primary)),
            h('span', {
              style: { fontSize: 20, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
            }, card.title),
            h('span', {
              style: { fontSize: 16, fontFamily: body, color: '#ffffffbb', lineHeight: 1.45 },
            }, card.description),
          ),
        ),
        row.length === 1 ? h('div', { style: { flex: 1 } }) : null,
      ),
    ),
  );
}
