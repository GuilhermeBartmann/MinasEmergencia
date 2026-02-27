import { createHmac, timingSafeEqual } from 'node:crypto';

const IS_DEV = process.env.NODE_ENV !== 'production';

// In development, fall back to hardcoded defaults so other devs need zero config.
// In production these MUST be set via environment variables.
const DEV_USERNAME = 'dev';
const DEV_PASSWORD = 'dev';
const DEV_SECRET   = 'devdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdevdev';

function getSecret(): Buffer {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    if (IS_DEV) return Buffer.from(DEV_SECRET, 'utf8');
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }
  return Buffer.from(secret, 'hex');
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlDecode(str: string): string {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function hmacSign(payload: string, secret: Buffer): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function signToken(username: string): string {
  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    sub: username,
    iat: now,
    exp: now + 86400, // 24h
  };

  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = hmacSign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getSecret();
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) return null;

    const expectedSignature = hmacSign(encodedPayload, secret);

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) return null;

    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payload: TokenPayload = JSON.parse(base64urlDecode(encodedPayload));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || (IS_DEV ? DEV_USERNAME : '');
  const expectedPassword = process.env.ADMIN_PASSWORD || (IS_DEV ? DEV_PASSWORD : '');

  if (!expectedUsername || !expectedPassword) return false;

  try {
    const usernameMatch = timingSafeEqual(
      Buffer.from(username),
      Buffer.from(expectedUsername)
    );
    const passwordMatch = timingSafeEqual(
      Buffer.from(password),
      Buffer.from(expectedPassword)
    );
    return usernameMatch && passwordMatch;
  } catch {
    return false;
  }
}
