/**
 * User role hierarchy for the Plenum admin system.
 * Order (ascending): consultor < gerente < admin < dev
 */
export type UserRole = 'consultor' | 'gerente' | 'admin' | 'dev';

/** Ordered from lowest to highest privilege */
export const ROLE_ORDER: UserRole[] = ['consultor', 'gerente', 'admin', 'dev'];

/** Returns true if userRole meets or exceeds minRole */
export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(minRole);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  consultor: 'Consultor',
  gerente:   'Gerente',
  admin:     'Administrador',
  dev:       'Desenvolvedor',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  consultor: 'bg-gray-100 text-gray-600',
  gerente:   'bg-blue-100 text-blue-700',
  admin:     'bg-purple-100 text-purple-700',
  dev:       'bg-orange-100 text-orange-700',
};
