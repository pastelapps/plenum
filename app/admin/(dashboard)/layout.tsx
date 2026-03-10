import AdminShell from '@/components/admin/AdminShell';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/user-roles';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: UserRole = 'dev'; // fallback: existing users without a profile keep full access

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) {
      role = profile.role as UserRole;
    }
  }

  return <AdminShell role={role}>{children}</AdminShell>;
}
