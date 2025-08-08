import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  
  // Only protect dashboard routes
  if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/api/dashboard')) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // For API routes, return 401
    if (pathname.startsWith('/api/dashboard')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For dashboard pages, redirect to login
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*']
};
