'use server';

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/user-roles';

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
}

/** List all users with their roles (dev-only). */
export async function listUsers(): Promise<{ data: AdminUser[]; error?: string }> {
  try {
    const admin = getAdminClient();
    const { data: { users }, error } = await admin.auth.admin.listUsers({ perPage: 200 });
    if (error) return { data: [], error: error.message };

    // Fetch roles from profiles
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, role');

    const roleMap: Record<string, UserRole> = {};
    for (const p of profiles ?? []) {
      if (p.id && p.role) roleMap[p.id] = p.role as UserRole;
    }

    const result: AdminUser[] = users.map((u) => ({
      id: u.id,
      email: u.email ?? '',
      role: roleMap[u.id] ?? 'consultor',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }));

    return { data: result };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Erro desconhecido' };
  }
}

/** Create a new user and set their role. */
export async function createUser(
  email: string,
  password: string,
  role: UserRole
): Promise<{ error?: string }> {
  try {
    const admin = getAdminClient();

    const { data: { user }, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) return { error: createError.message };
    if (!user) return { error: 'Usuário não criado' };

    // Upsert profile with role
    const { error: profileError } = await admin
      .from('profiles')
      .upsert({ id: user.id, role }, { onConflict: 'id' });

    if (profileError) return { error: profileError.message };

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
  }
}

/** Update the role of an existing user. */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ error?: string }> {
  try {
    const admin = getAdminClient();
    const { error } = await admin
      .from('profiles')
      .upsert({ id: userId, role }, { onConflict: 'id' });

    return error ? { error: error.message } : {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
  }
}

/** Delete a user (dev-only). */
export async function deleteUser(userId: string): Promise<{ error?: string }> {
  try {
    const admin = getAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    return error ? { error: error.message } : {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
  }
}
