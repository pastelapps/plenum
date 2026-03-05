// =============================================================
// Design System Types
// =============================================================

export interface ShaderColors {
  colorbends: [string, string];
  grainient: [string, string, string];
  glowing_effect: [string, string, string, string];
}

export interface ProgramCardColors {
  gradient_from: string;
  gradient_to: string;
  border: string;
  opacity: number;
}

export interface FontUrl {
  weight: number;
  url: string;
  format: 'opentype' | 'woff2' | 'woff' | 'truetype';
}

export interface DesignSystem {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;

  // Colors: Primary (Accent)
  color_primary: string;
  color_primary_hover: string;
  color_primary_light: string;

  // Colors: Backgrounds
  color_background: string;
  color_background_alt: string;
  color_background_deep: string;
  color_surface: string;
  color_surface_alt: string;

  // Colors: Accent / Others
  color_accent: string | null;
  color_whatsapp: string | null;

  // Colors: Hero Gradient
  color_hero_gradient_mid: string;

  // Colors: Shaders WebGL
  shader_colors: ShaderColors;

  // Colors: Program Card
  color_program_card: ProgramCardColors;

  // Fonts
  font_heading: string;
  font_body: string;
  font_heading_weights: number[];
  font_body_weights: number[];
  font_heading_urls: FontUrl[];
  font_body_urls: FontUrl[];

  // Metadata
  created_at: string;
  updated_at: string;
}

// Insert type (omit auto-generated fields)
export type DesignSystemInsert = Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>;

// Update type (all fields optional except id)
export type DesignSystemUpdate = Partial<Omit<DesignSystem, 'id' | 'created_at' | 'updated_at'>>;
