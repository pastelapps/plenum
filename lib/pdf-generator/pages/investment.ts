import { h, PAGE_W, PAGE_H, PAD, type PdfContext, type SatoriNode } from '../types';
import { getFontFamily } from '../fonts';
import { getCheckIcon } from '../icons';
import { PAYMENT_INFO, CANCELLATION_POLICY } from '../config';
import type { FontData } from '../types';

/**
 * Page 10 — Investimento
 * Two-column layout: included items + payment data on the left,
 * "Consulte" price card on the right.
 */
export function renderInvestment(ctx: PdfContext, fonts: FontData[]): SatoriNode {
  const { course, ds, company } = ctx;
  const heading = getFontFamily(ds, 'heading', fonts);
  const body    = getFontFamily(ds, 'body', fonts);
  const primary = ds.color_primary;
  const accent  = ds.color_accent || ds.color_primary_light || primary;

  const cancelText = company.cancellation_policy || CANCELLATION_POLICY;
  const payRows = PAYMENT_INFO.filter((p) => p.value.trim() !== '');

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

    // ── Section label ───────────────────────────────────────
    h('div', {
      style: {
        display: 'flex',
        fontSize: 12,
        fontFamily: body,
        color: primary,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 6,
      },
    }, 'Valores e Condições'),

    // ── Page title ──────────────────────────────────────────
    h('div', {
      style: { display: 'flex', fontSize: 64, fontFamily: heading, fontWeight: 800, color: '#ffffff', marginBottom: 8 },
    }, course.investment_heading || 'Investimento'),

    // ── Accent underline ────────────────────────────────────
    h('div', { style: { width: 56, height: 4, backgroundColor: primary, borderRadius: 2, marginBottom: 14 } }),

    // ── Description ─────────────────────────────────────────
    h('div', {
      style: { display: 'flex', fontSize: 16, fontFamily: body, color: '#ffffffaa', marginBottom: 36 },
    }, course.investment_subtitle || 'Condições especiais para inscrições antecipadas'),

    // ── Two-column body ─────────────────────────────────────
    h('div', {
      style: { display: 'flex', flexDirection: 'row', gap: 44, flex: 1, alignItems: 'flex-start' },
    },

      // ── Left column (60 %) ─────────────────────────────
      h('div', {
        style: { display: 'flex', flexDirection: 'column', flex: 3 },
      },

        // "O que está incluso"
        h('div', {
          style: {
            display: 'flex',
            fontSize: 13,
            fontFamily: body,
            fontWeight: 700,
            color: primary,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 16,
          },
        }, 'O que está incluso'),

        h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 40 },
        },
          ...(course.included_items || []).map((item) =>
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
              getCheckIcon(24, primary),
              h('span', { style: { fontSize: 16, fontFamily: body, color: '#ffffffdd' } }, item.text),
            ),
          ),
        ),

        // "Dados para pagamento" (only when there are rows with values)
        payRows.length > 0
          ? h('div', {
              style: { display: 'flex', flexDirection: 'column' },
            },
              h('div', {
                style: {
                  display: 'flex',
                  fontSize: 13,
                  fontFamily: body,
                  fontWeight: 700,
                  color: primary,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  marginBottom: 16,
                },
              }, 'Dados para Pagamento'),

              h('div', {
                style: { display: 'flex', flexDirection: 'column', gap: 14 },
              },
                ...payRows.map((p) =>
                  h('div', {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      paddingBottom: 10,
                      borderBottom: `1px solid ${primary}18`,
                    },
                  },
                    h('span', {
                      style: { fontSize: 14, fontFamily: body, color: '#ffffff66', width: 110 },
                    }, p.label),
                    h('span', {
                      style: { fontSize: 14, fontFamily: body, color: '#ffffffdd', flex: 1 },
                    }, p.value),
                  ),
                ),
              ),
            )
          : null,
      ),

      // ── Right column (40 %) — price card ───────────────
      h('div', {
        style: { display: 'flex', flexDirection: 'column', flex: 2 },
      },
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '36px 28px',
            borderRadius: 20,
            backgroundColor: `${ds.color_surface}cc`,
            border: `1px solid ${primary}44`,
            gap: 10,
          },
        },
          h('span', {
            style: {
              fontSize: 11,
              fontFamily: body,
              color: '#ffffff88',
              textTransform: 'uppercase',
              letterSpacing: 3,
            },
          }, 'Investimento Individual'),

          h('span', {
            style: { fontSize: 60, fontFamily: heading, fontWeight: 900, color: primary, lineHeight: 1.1 },
          }, 'Consulte'),

          h('span', {
            style: { fontSize: 14, fontFamily: body, color: '#ffffff88' },
          }, 'valores e condições'),

          h('div', {
            style: { width: '80%', height: 1, backgroundColor: `${primary}33`, marginTop: 10, marginBottom: 10 },
          }),

          h('span', {
            style: { fontSize: 14, fontFamily: body, color: accent, textAlign: 'center', lineHeight: 1.55 },
          }, 'Descontos especiais para grupos e inscrições antecipadas'),
        ),
      ),
    ),

    // ── Footer: cancellation policy + company name ──────────
    h('div', { style: { flexGrow: 1, display: 'flex', minHeight: 16 } }),
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingTop: 20,
        borderTop: `1px solid ${primary}22`,
      },
    },
      h('span', {
        style: { fontSize: 12, fontFamily: body, color: '#ffffff55', textAlign: 'center' },
      }, cancelText),
      h('div', {
        style: { display: 'flex', justifyContent: 'flex-end' },
      },
        h('span', {
          style: { fontSize: 11, fontFamily: body, color: '#ffffff33', textTransform: 'uppercase', letterSpacing: 2 },
        }, company.company_name),
      ),
    ),
  );
}
