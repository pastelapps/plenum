import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listUsers } from '@/lib/actions/users';
import UserManagement from '@/components/admin/UserManagement';
import type { UserRole } from '@/types/user-roles';

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role ?? 'consultor') as UserRole;

  // Only devs can access this page
  if (role !== 'dev') redirect('/admin');

  const { data: users, error } = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os usuários com acesso ao painel administrativo.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500">Erro ao carregar usuários: {error}</p>
      )}

      <UserManagement initialUsers={users} />
    </div>
  );
}
