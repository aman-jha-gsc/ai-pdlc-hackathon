import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

export const getSessionId = (): string => {
  const cookieStore = cookies();
  let sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    sessionId = nanoid();
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  return sessionId;
};