import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, signToken } from '@/lib/admin/auth';
import { COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/admin/session';

/**
 * POST /api/admin/auth
 * Validates credentials and sets admin_session cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      // Constant-time-like delay to prevent timing attacks
      await new Promise(r => setTimeout(r, 200));
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken(username);

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/auth
 * Clears the admin_session cookie (logout)
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
