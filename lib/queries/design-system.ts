import { createClient } from '@/lib/supabase/server';
import type { DesignSystem } from '@/types/design-system';

/**
 * Get a design system by ID.
 */
export async function getDesignSystem(id: string): Promise<DesignSystem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('design_systems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as DesignSystem;
}

/**
 * Get the default design system (is_default = true).
 * Fallback if a course doesn't have a specific design system assigned.
 */
export async function getDefaultDesignSystem(): Promise<DesignSystem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('design_systems')
    .select('*')
    .eq('is_default', true)
    .single();

  if (error) {
    console.error('Error fetching default design system:', error);
    return null;
  }

  return data as unknown as DesignSystem;
}

/**
 * Get all design systems (for admin listing/selection).
 */
export async function getAllDesignSystems(): Promise<DesignSystem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('design_systems')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching design systems:', error);
    return [];
  }

  return (data || []) as unknown as DesignSystem[];
}
