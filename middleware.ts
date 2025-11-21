import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyToken(token: string): Promise<boolean> {
  try {
    if (!token || !JWT_SECRET) {
      console.log('[Middleware] Missing token or JWT_SECRET');
      return false;
    }
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const isValid = !!payload && typeof payload === 'object' && 'userId' in payload;
    if (!isValid) {
      console.log('[Middleware] Token decoded but missing userId:', payload);
    }
    return isValid;
  } catch (error: any) {
    console.log('[Middleware] Token verification error:', error.message);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page without authentication
  if (pathname === '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;
    // If already authenticated, redirect to admin dashboard
    if (token && await verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow access to login page
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    
    // Debug: log all cookies
    const allCookies = request.cookies.getAll();
    console.log('[Middleware] All cookies:', allCookies.map(c => c.name));
    console.log('[Middleware] Auth token cookie:', token ? 'Found' : 'Not found');
    console.log('[Middleware] JWT_SECRET exists:', !!JWT_SECRET);

    if (!token) {
      console.log('[Middleware] No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      console.log('[Middleware] Invalid token, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    console.log('[Middleware] Token valid, allowing access to:', pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
