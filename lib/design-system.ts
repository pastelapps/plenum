import type { DesignSystem, FontUrl } from '@/types/design-system';

/**
 * Convert hex color to rgba string.
 */
function hexToRGBA(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Generates CSS Custom Properties string from a DesignSystem object.
 * Used by DesignSystemProvider to inject styles into the page.
 */
export function generateCSSVars(ds: DesignSystem): string {
  const p = ds.color_primary;
  return `
    :root {
      /* Colors: Primary */
      --ds-primary: ${p};
      --ds-primary-hover: ${ds.color_primary_hover};
      --ds-primary-light: ${ds.color_primary_light};

      /* Colors: Primary with opacity */
      --ds-primary-4: ${hexToRGBA(p, 0.04)};
      --ds-primary-5: ${hexToRGBA(p, 0.05)};
      --ds-primary-6: ${hexToRGBA(p, 0.06)};
      --ds-primary-8: ${hexToRGBA(p, 0.08)};
      --ds-primary-10: ${hexToRGBA(p, 0.10)};
      --ds-primary-12: ${hexToRGBA(p, 0.12)};
      --ds-primary-15: ${hexToRGBA(p, 0.15)};
      --ds-primary-20: ${hexToRGBA(p, 0.20)};
      --ds-primary-25: ${hexToRGBA(p, 0.25)};
      --ds-primary-30: ${hexToRGBA(p, 0.30)};
      --ds-primary-40: ${hexToRGBA(p, 0.40)};
      --ds-primary-50: ${hexToRGBA(p, 0.50)};

      /* Colors: Backgrounds */
      --ds-background: ${ds.color_background};
      --ds-background-alt: ${ds.color_background_alt};
      --ds-background-deep: ${ds.color_background_deep};
      --ds-surface: ${ds.color_surface};
      --ds-surface-alt: ${ds.color_surface_alt};

      /* Colors: Accent */
      --ds-accent: ${ds.color_accent || '#e1ff69'};
      --ds-whatsapp: ${ds.color_whatsapp || '#25D366'};

      /* Colors: Hero Gradient */
      --ds-hero-gradient-mid: ${ds.color_hero_gradient_mid};

      /* Fonts */
      --ds-font-heading: '${ds.font_heading}', system-ui, sans-serif;
      --ds-font-body: '${ds.font_body}', system-ui, sans-serif;
    }
  `;
}

/**
 * Generates @font-face declarations from font URLs.
 */
export function generateFontFaces(ds: DesignSystem): string {
  const faces: string[] = [];

  // Heading font faces
  if (ds.font_heading_urls && ds.font_heading_urls.length > 0) {
    ds.font_heading_urls.forEach((font: FontUrl) => {
      faces.push(`
        @font-face {
          font-family: '${ds.font_heading}';
          src: url('${font.url}') format('${font.format}');
          font-weight: ${font.weight};
          font-style: normal;
          font-display: swap;
        }
      `);
    });
  }

  // Body font faces
  if (ds.font_body_urls && ds.font_body_urls.length > 0) {
    ds.font_body_urls.forEach((font: FontUrl) => {
      faces.push(`
        @font-face {
          font-family: '${ds.font_body}';
          src: url('${font.url}') format('${font.format}');
          font-weight: ${font.weight};
          font-style: normal;
          font-display: swap;
        }
      `);
    });
  }

  return faces.join('\n');
}

/**
 * Extracts shader colors from design system for WebGL components.
 */
export function getShaderColors(ds: DesignSystem) {
  const defaults = {
    colorbends: ['#007bff', '#4097bf'] as [string, string],
    grainient: ['#030d1f', '#378bae', '#030d1f'] as [string, string, string],
    glowing_effect: ['#5b9cf6', '#4aaee0', '#2979e8', '#60b8f5'] as [string, string, string, string],
  };

  if (!ds.shader_colors) return defaults;

  return {
    colorbends: ds.shader_colors.colorbends || defaults.colorbends,
    grainient: ds.shader_colors.grainient || defaults.grainient,
    glowing_effect: ds.shader_colors.glowing_effect || defaults.glowing_effect,
  };
}

/**
 * Extracts program card colors from design system.
 */
export function getProgramCardColors(ds: DesignSystem) {
  const defaults = {
    gradient_from: '#0d2854',
    gradient_to: '#091a38',
    border: '#1e4a8a',
    opacity: 0.7,
  };

  if (!ds.color_program_card) return defaults;

  return {
    gradient_from: ds.color_program_card.gradient_from || defaults.gradient_from,
    gradient_to: ds.color_program_card.gradient_to || defaults.gradient_to,
    border: ds.color_program_card.border || defaults.border,
    opacity: ds.color_program_card.opacity ?? defaults.opacity,
  };
}
