import { NextResponse } from 'next/server';
import { encodeSession, authCookieName, env, prisma } from '@wadv/lib';

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get('name') ?? '');
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: password,
      plan: 'FREE',
      creditsBalance: 250,
    },
  });

  const response = NextResponse.redirect(new URL('/app', request.url));
  response.cookies.set(authCookieName, encodeSession(user.id, env.authSecret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });
  return response;
}
