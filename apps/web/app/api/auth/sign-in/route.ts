import { NextResponse } from 'next/server';
import { encodeSession, authCookieName, env, prisma } from '@wadv/lib';

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.passwordHash !== password) {
    return NextResponse.redirect(new URL('/auth/sign-in?error=invalid', request.url));
  }

  const response = NextResponse.redirect(new URL('/app', request.url));
  response.cookies.set(authCookieName, encodeSession(user.id, env.authSecret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });
  return response;
}
