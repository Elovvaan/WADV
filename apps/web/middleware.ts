import { NextResponse, type NextRequest } from 'next/server';
import { authCookieName, decodeSession, env } from '@wadv/lib';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookieName)?.value;
  const session = decodeSession(token, env.authSecret);
  if (!session) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
