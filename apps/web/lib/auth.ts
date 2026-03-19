import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authCookieName, decodeSession, env, prisma } from '@wadv/lib';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  const session = decodeSession(token, env.authSecret);
  if (!session) {
    return null;
  }

  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  return user;
}
