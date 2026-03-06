// =============================================================
// Database Types — Supabase Schema Mapping
// =============================================================
// This file provides a Database type that maps to the Supabase
// schema for type-safe queries. It's used by the Supabase client.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      company_settings: {
        Row: {
          id: string;
          company_name: string;
          address: string | null;
          phones: Json;
          emails: Json;
          website: string | null;
          cancellation_policy: string | null;
          payment_info: Json;
          logo_url: string | null;
          logo_dark_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name?: string;
          address?: string | null;
          phones?: Json;
          emails?: Json;
          website?: string | null;
          cancellation_policy?: string | null;
          payment_info?: Json;
          logo_url?: string | null;
          logo_dark_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          address?: string | null;
          phones?: Json;
          emails?: Json;
          website?: string | null;
          cancellation_policy?: string | null;
          payment_info?: Json;
          logo_url?: string | null;
          logo_dark_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      design_systems: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          color_primary: string;
          color_primary_hover: string;
          color_primary_light: string;
          color_background: string;
          color_background_alt: string;
          color_background_deep: string;
          color_surface: string;
          color_surface_alt: string;
          color_accent: string | null;
          color_whatsapp: string | null;
          color_hero_gradient_mid: string;
          shader_colors: Json;
          color_program_card: Json;
          font_heading: string;
          font_body: string;
          font_heading_weights: Json;
          font_body_weights: Json;
          font_heading_urls: Json;
          font_body_urls: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          color_primary?: string;
          color_primary_hover?: string;
          color_primary_light?: string;
          color_background?: string;
          color_background_alt?: string;
          color_background_deep?: string;
          color_surface?: string;
          color_surface_alt?: string;
          color_accent?: string | null;
          color_whatsapp?: string | null;
          color_hero_gradient_mid?: string;
          shader_colors?: Json;
          color_program_card?: Json;
          font_heading?: string;
          font_body?: string;
          font_heading_weights?: Json;
          font_body_weights?: Json;
          font_heading_urls?: Json;
          font_body_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_default?: boolean;
          color_primary?: string;
          color_primary_hover?: string;
          color_primary_light?: string;
          color_background?: string;
          color_background_alt?: string;
          color_background_deep?: string;
          color_surface?: string;
          color_surface_alt?: string;
          color_accent?: string | null;
          color_whatsapp?: string | null;
          color_hero_gradient_mid?: string;
          shader_colors?: Json;
          color_program_card?: Json;
          font_heading?: string;
          font_body?: string;
          font_heading_weights?: Json;
          font_body_weights?: Json;
          font_heading_urls?: Json;
          font_body_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      instructors: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          bio: string | null;
          photo_url: string | null;
          social_links: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          social_links?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          social_links?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          status: string;
          modality: string;
          design_system_id: string | null;
          title: string;
          subtitle: string | null;
          category_label: string | null;
          title_parts: Json | null;
          hero_badges: Json;
          about_heading: string | null;
          about_subheading: string | null;
          about_description: string | null;
          about_cards: Json;
          audience_heading: string | null;
          audience_cards: Json;
          audience_images: Json;
          program_heading: string | null;
          program_description: string | null;
          investment_heading: string | null;
          investment_subtitle: string | null;
          included_items: Json;
          background_image_url: string | null;
          testimonials: Json;
          partner_logos: Json;
          whatsapp_number: string | null;
          whatsapp_message: string | null;
          folder_pdf_url: string | null;
          hero_frames_path: string | null;
          hero_frame_count: number | null;
          hero_frame_ext: string | null;
          section_backgrounds: Json;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          status?: string;
          modality?: string;
          design_system_id?: string | null;
          title: string;
          subtitle?: string | null;
          category_label?: string | null;
          title_parts?: Json | null;
          hero_badges?: Json;
          about_heading?: string | null;
          about_subheading?: string | null;
          about_description?: string | null;
          about_cards?: Json;
          audience_heading?: string | null;
          audience_cards?: Json;
          audience_images?: Json;
          program_heading?: string | null;
          program_description?: string | null;
          investment_heading?: string | null;
          investment_subtitle?: string | null;
          included_items?: Json;
          background_image_url?: string | null;
          testimonials?: Json;
          partner_logos?: Json;
          whatsapp_number?: string | null;
          whatsapp_message?: string | null;
          folder_pdf_url?: string | null;
          hero_frames_path?: string | null;
          hero_frame_count?: number | null;
          hero_frame_ext?: string | null;
          section_backgrounds?: Json;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          status?: string;
          modality?: string;
          design_system_id?: string | null;
          title?: string;
          subtitle?: string | null;
          category_label?: string | null;
          title_parts?: Json | null;
          hero_badges?: Json;
          about_heading?: string | null;
          about_subheading?: string | null;
          about_description?: string | null;
          about_cards?: Json;
          audience_heading?: string | null;
          audience_cards?: Json;
          audience_images?: Json;
          program_heading?: string | null;
          program_description?: string | null;
          investment_heading?: string | null;
          investment_subtitle?: string | null;
          included_items?: Json;
          background_image_url?: string | null;
          testimonials?: Json;
          partner_logos?: Json;
          whatsapp_number?: string | null;
          whatsapp_message?: string | null;
          folder_pdf_url?: string | null;
          hero_frames_path?: string | null;
          hero_frame_count?: number | null;
          hero_frame_ext?: string | null;
          section_backgrounds?: Json;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'courses_design_system_id_fkey';
            columns: ['design_system_id'];
            isOneToOne: false;
            referencedRelation: 'design_systems';
            referencedColumns: ['id'];
          },
        ];
      };
      course_dates: {
        Row: {
          id: string;
          course_id: string;
          instructor_ids: string[];
          start_date: string;
          end_date: string;
          label: string | null;
          location_venue: string | null;
          location_address: string | null;
          location_map_embed: string | null;
          location_extra: Json;
          program_days: Json;
          max_students: number | null;
          status: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          instructor_ids?: string[];
          start_date: string;
          end_date: string;
          label?: string | null;
          location_venue?: string | null;
          location_address?: string | null;
          location_map_embed?: string | null;
          location_extra?: Json;
          program_days?: Json;
          max_students?: number | null;
          status?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          instructor_ids?: string[];
          start_date?: string;
          end_date?: string;
          label?: string | null;
          location_venue?: string | null;
          location_address?: string | null;
          location_map_embed?: string | null;
          location_extra?: Json;
          program_days?: Json;
          max_students?: number | null;
          status?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'course_dates_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          course_id: string | null;
          course_date_id: string | null;
          form_type: string;
          nome: string;
          email: string | null;
          whatsapp: string | null;
          estado: string | null;
          cidade: string | null;
          orgao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          course_date_id?: string | null;
          form_type: string;
          nome: string;
          email?: string | null;
          whatsapp?: string | null;
          estado?: string | null;
          cidade?: string | null;
          orgao?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string | null;
          course_date_id?: string | null;
          form_type?: string;
          nome?: string;
          email?: string | null;
          whatsapp?: string | null;
          estado?: string | null;
          cidade?: string | null;
          orgao?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_course_date_id_fkey';
            columns: ['course_date_id'];
            isOneToOne: false;
            referencedRelation: 'course_dates';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
