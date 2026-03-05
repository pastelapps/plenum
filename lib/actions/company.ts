'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Update company settings.
 */
export async function updateCompanySettings(data: Record<string, unknown>) {
  const supabase = await createClient();

  // Get existing company settings ID
  const { data: existing } = await supabase
    .from('company_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('company_settings')
      .update(data as any)
      .eq('id', existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from('company_settings')
      .insert(data as any);

    if (error) return { error: error.message };
  }

  revalidatePath('/admin/configuracoes');
  revalidatePath('/cursos');
  return { success: true };
}
