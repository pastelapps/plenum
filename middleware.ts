import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { type UserRole, hasMinRole } from '@/types/user-roles';

/**
 * Route access matrix — routes not listed default to 'consultor' (any authenticated user).
 * Hierarchy: consultor < gerente < admin < dev
 */
const ROUTE_ACCESS: Array<{ prefix: string; minRole: UserRole }> = [
  { prefix: '/admin/configuracoes',  minRole: 'admin'   },
  { prefix: '/admin/leads',          minRole: 'gerente' },
  { prefix: '/admin/cursos/novo',    minRole: 'gerente' },
  { prefix: '/admin/cursos/',        minRole: 'gerente' }, // edit/turmas sub-routes
];

function requiredRole(pathname: string): UserRole {
  for (const rule of ROUTE_ACCESS) {
    if (pathname.startsWith(rule.prefix)) return rule.minRole;
  }
  return 'consultor';
}

/**
 * Middleware that:
 * 1. Refreshes Supabase auth session on every request
 * 2. Protects /admin/* routes (except /admin/login) — redirects to login if not authenticated
 * 3. Enforces role-based access: redirects to /admin if role is insufficient
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // ── Auth guard ─────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // ── Role guard (only for restricted routes) ────────────────────────
    const minRole = requiredRole(pathname);
    if (minRole !== 'consultor') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Users without a profile are treated as 'dev' (pre-existing admins)
      const userRole: UserRole = (profile?.role as UserRole) ?? 'dev';

      if (!hasMinRole(userRole, minRole)) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }
  }

  // Already logged in → skip login page
  if (pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm)$).*)',
  ],
};
