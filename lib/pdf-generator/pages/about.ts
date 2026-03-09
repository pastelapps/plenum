import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getIcon } from '../icons';
import type { FontData } from '../types';

export function renderAbout(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, ds } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
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
    }, 'Conteúdo'),

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
    }, course.about_heading || 'Sobre o Curso'),

    // ── Accent underline ─────────────────────────────────
    h('div', { style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 20 } }),

    // ── Sub-heading ──────────────────────────────────────
    course.about_subheading
      ? h('div', {
          style: {
            display: 'flex',
            fontSize: 17,
            fontFamily: body,
            color: '#ffffffcc',
            lineHeight: 1.6,
            marginBottom: 44,
          },
        }, course.about_subheading)
      : h('div', { style: { marginBottom: 28 } }),

    // ── Cards grid (2 per row) ────────────────────────────
    ...rows.map((row) =>
      h('div', { style: { display: 'flex', gap: 24, marginBottom: 24 } },
        ...row.map((card) =>
          h('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '32px 28px',
              borderRadius: 16,
              backgroundColor: `${ds.color_surface}cc`,
              border: `1px solid ${primary}22`,
              gap: 14,
            },
          },
            h('div', { style: { display: 'flex' } }, getIcon(card.icon, 36, primary)),
            h('span', {
              style: { fontSize: 20, fontFamily: heading, fontWeight: 700, color: '#ffffff' },
            }, card.title),
            h('span', {
              style: { fontSize: 16, fontFamily: body, color: '#ffffffbb', lineHeight: 1.55 },
            }, card.description),
          ),
        ),
        row.length === 1 ? h('div', { style: { flex: 1 } }) : null,
      ),
    ),
  );
}
