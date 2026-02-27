import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, TokenPayload } from './auth';

export const COOKIE_NAME = 'admin_session';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 86400,
};

/**
 * For use in API route handlers — returns 401 if session is invalid.
 */
export function requireAdminSession(request: NextRequest): TokenPayload | NextResponse {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return payload;
}

/**
 * For use in Server Components — redirects to login if session is invalid.
 */
export async function getAdminSession(): Promise<TokenPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect('/administradores/login');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/administradores/login');
  }

  return payload;
}
