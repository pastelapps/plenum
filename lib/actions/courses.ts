'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Create a new course.
 */
export async function createCourse(data: Record<string, unknown>) {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from('courses')
    .insert(data as any)
    .select('id, slug')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { data: result as unknown as { id: string; slug: string } };
}

/**
 * Update an existing course.
 */
export async function updateCourse(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('courses')
    .update(data as any)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath(`/cursos`);
  return { success: true };
}

/**
 * Create a course date (turma).
 */
export async function createCourseDate(data: Record<string, unknown>) {
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from('course_dates')
    .insert(data as any)
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: result as unknown as { id: string } };
}

/**
 * Update a course date.
 */
export async function updateCourseDate(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('course_dates')
    .update(data as any)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Delete a course date.
 */
export async function deleteCourseDate(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('course_dates')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Clone a course date (turma). Copies all data except dates (reset to today).
 */
export async function cloneCourseDate(sourceTurmaId: string) {
  const supabase = await createClient();

  // Fetch source turma
  const { data: source, error: fetchError } = await supabase
    .from('course_dates')
    .select('*')
    .eq('id', sourceTurmaId)
    .single();

  if (fetchError || !source) {
    return { error: fetchError?.message || 'Turma não encontrada' };
  }

  const today = new Date().toISOString().split('T')[0];
  const { id: _id, created_at: _ca, ...rest } = source as Record<string, unknown>;
  void _id; void _ca;

  const clone = {
    ...rest,
    label: `${(rest.label as string) || 'Turma'} (Cópia)`,
    start_date: today,
    end_date: today,
    status: 'open',
    sort_order: ((rest.sort_order as number) || 0) + 1,
  };

  const { data: result, error } = await supabase
    .from('course_dates')
    .insert(clone as any)
    .select('id')
    .single();

  if (error) return { error: error.message };

  revalidatePath('/admin');
  return { data: result as unknown as { id: string } };
}

/**
 * Toggle course date status (e.g. open ↔ paused).
 */
export async function toggleCourseDateStatus(id: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('course_dates')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin');
  revalidatePath('/cursos');
  return { success: true };
}

/**
 * Create/update instructor.
 */
export async function upsertInstructor(data: Record<string, unknown>) {
  const supabase = await createClient();

  if (data.id) {
    const { error } = await supabase
      .from('instructors')
      .update(data as any)
      .eq('id', data.id as string);
    if (error) return { error: error.message };
    return { data: { id: data.id as string } };
  }

  const { data: result, error } = await supabase
    .from('instructors')
    .insert(data as any)
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { data: result as unknown as { id: string } };
}

/**
 * Get all instructors.
 */
export async function getInstructors() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) return [];
  return data as unknown as Array<{
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    photo_url: string | null;
    social_links: Array<{ platform: string; url: string; handle: string }>;
    status: string;
  }>;
}

/**
 * Get all design systems.
 */
export async function getDesignSystems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('design_systems')
    .select('id, name, is_default')
    .order('name');

  if (error) return [];
  return data as unknown as Array<{ id: string; name: string; is_default: boolean }>;
}

/**
 * Trigger revalidation of a course page.
 */
export async function revalidateCoursePage(slug: string) {
  revalidatePath(`/cursos/${slug}`);
  revalidatePath('/');
}
