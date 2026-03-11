'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { createUser, updateUserRole, deleteUser } from '@/lib/actions/users';
import { cn } from '@/lib/utils';
import { ROLE_LABELS, ROLE_COLORS, ROLE_ORDER } from '@/types/user-roles';
import type { AdminUser } from '@/lib/actions/users';
import type { UserRole } from '@/types/user-roles';

interface Props {
  initialUsers: AdminUser[];
}

export default function UserManagement({ initialUsers }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New user form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('consultor');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    if (!email.trim() || !password.trim()) return;
    setMessage(null);
    startTransition(async () => {
      const result = await createUser(email.trim(), password, role);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: `Usuário ${email} criado com sucesso!` });
        setUsers([
          ...users,
          {
            id: crypto.randomUUID(),
            email: email.trim(),
            role,
            created_at: new Date().toISOString(),
            last_sign_in_at: null,
          },
        ]);
        setEmail('');
        setPassword('');
        setRole('consultor');
        setShowForm(false);
      }
    });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      }
    });
  };

  const handleDelete = (userId: string, userEmail: string) => {
    if (!confirm(`Excluir o usuário ${userEmail}? Esta ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setUsers(users.filter((u) => u.id !== userId));
        setMessage({ type: 'success', text: `Usuário ${userEmail} removido.` });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Create user card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Novo Usuário</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4 mr-1" />
            {showForm ? 'Cancelar' : 'Criar'}
          </Button>
        </CardHeader>
        {showForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label>Perfil de acesso</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_ORDER.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCreate}
              disabled={isPending || !email.trim() || !password.trim()}
            >
              {isPending ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
              ) : (
                'Criar usuário'
              )}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* User list */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum usuário encontrado.</p>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <p className="text-xs text-gray-400">
                  Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  {user.last_sign_in_at
                    ? ` · Último login: ${new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}`
                    : ' · Nunca acessou'}
                </p>
              </div>
              <Select
                value={user.role}
                onValueChange={(v) => handleRoleChange(user.id, v as UserRole)}
                disabled={isPending}
              >
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_ORDER.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                ROLE_COLORS[user.role]
              )}>
                {ROLE_LABELS[user.role]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(user.id, user.email)}
                disabled={isPending}
                className="text-gray-400 hover:text-red-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
