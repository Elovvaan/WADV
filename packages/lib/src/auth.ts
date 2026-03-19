import { createHmac } from 'node:crypto';

const COOKIE_NAME = 'wadv_session';

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function encodeSession(userId: string, secret: string) {
  const payload = Buffer.from(JSON.stringify({ userId })).toString('base64url');
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function decodeSession(token: string | undefined, secret: string) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (sign(payload, secret) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { userId: string };
  } catch {
    return null;
  }
}

export const authCookieName = COOKIE_NAME;
