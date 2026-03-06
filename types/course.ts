// =============================================================
// Course & Related Types
// =============================================================

import type { DesignSystem } from './design-system';

// --- Title Parts (Hero) ---
export interface TitlePart {
  text: string;
  color: 'white' | 'accent';
}

// --- Hero Badge ---
export interface HeroBadge {
  icon: string;      // Lucide icon name (e.g. "MapPin", "Users")
  label: string;     // Description text
  value: string;     // Display value or "dropdown" for turma selector
}

// --- About Card ---
export interface AboutCard {
  icon: string;        // Lucide icon name
  title: string;
  description: string;
}

// --- Audience Card ---
export interface AudienceCard {
  icon: string;
  title: string;
  description: string;
}

// --- Audience Image ---
export interface AudienceImage {
  url: string;
  alt: string;
}

// --- Included Item (Investment) ---
export interface IncludedItem {
  icon: string;
  text: string;
}

// --- Testimonial ---
export interface Testimonial {
  name: string;
  role?: string;
  thumbnail_url: string;
  youtube_id: string;
}

// --- Partner Logo ---
export interface PartnerLogo {
  name: string;
  url: string;     // Image URL
  width?: number;
  height?: number;
}

// --- Section Backgrounds ---
export interface SectionBackgrounds {
  investment?: string;
  testimonials?: string;
  folder?: string;
  [key: string]: string | undefined;
}

// --- Main Course Type ---
export interface Course {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  modality: 'presencial' | 'online' | 'hibrido';
  design_system_id: string | null;

  // Hero
  title: string;
  subtitle: string | null;
  category_label: string | null;
  title_parts: TitlePart[] | null;
  hero_badges: HeroBadge[];

  // About
  about_heading: string | null;
  about_subheading: string | null;
  about_description: string | null;
  about_cards: AboutCard[];

  // Target Audience
  audience_heading: string | null;
  audience_cards: AudienceCard[];
  audience_images: AudienceImage[];

  // Program (labels only; actual program_days are in course_dates)
  program_heading: string | null;
  program_description: string | null;

  // Investment
  investment_heading: string | null;
  investment_subtitle: string | null;
  included_items: IncludedItem[];
  background_image_url: string | null;
  product_image_url: string | null;

  // Testimonials
  testimonials: Testimonial[];

  // Partner Logos
  partner_logos: PartnerLogo[];

  // WhatsApp
  whatsapp_number: string | null;
  whatsapp_message: string | null;

  // Cover image (used on main site listing)
  cover_image_url: string | null;

  // PDF
  folder_pdf_url: string | null;

  // Hero Frames (animation)
  hero_frames_path: string | null;
  hero_frame_count: number | null;
  hero_frame_ext: string | null;

  // Section Backgrounds
  section_backgrounds: SectionBackgrounds;

  // SEO
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

// Insert type
export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at'>;

// Update type
export type CourseUpdate = Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>;

// --- Instructor (referenced from instructors table) ---
export interface Instructor {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  social_links: SocialLink[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  platform: string;     // "instagram", "linkedin", "twitter", etc.
  url: string;
  handle: string;
}

export type InstructorInsert = Omit<Instructor, 'id' | 'created_at' | 'updated_at'>;
export type InstructorUpdate = Partial<Omit<Instructor, 'id' | 'created_at' | 'updated_at'>>;

// --- Program Day (inside course_dates.program_days JSONB) ---
export interface ProgramTopic {
  text: string;
  children: string[];
}

export interface ProgramDay {
  tag: string;          // "Dia 1 — Terça, 10/03"
  time: string;         // "14:00 às 18:00"
  title: string;        // Module title
  description: string;  // Brief description
  topics: ProgramTopic[];
}

// --- Location Extra (inside course_dates.location_extra JSONB) ---
export interface LocationExtra {
  label: string;
  value: string;
  icon?: string;
}

// --- Course Date (turma) ---
export interface CourseDate {
  id: string;
  course_id: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  label: string | null;
  location_venue: string | null;
  location_address: string | null;
  location_map_embed: string | null;
  location_extra: LocationExtra[];
  program_days: ProgramDay[];
  max_students: number | null;
  status: 'open' | 'closed' | 'cancelled' | 'paused';
  sort_order: number;
  created_at: string;
}

export type CourseDateInsert = Omit<CourseDate, 'id' | 'created_at'>;
export type CourseDateUpdate = Partial<Omit<CourseDate, 'id' | 'created_at'>>;

// --- Course Date with Instructor (JOIN result) ---
export interface CourseDateWithInstructor extends CourseDate {
  instructor: Instructor;
}

// --- Full Course (with all relations) ---
export interface CourseWithRelations extends Course {
  design_system: DesignSystem | null;
  dates: CourseDateWithInstructor[];
}
