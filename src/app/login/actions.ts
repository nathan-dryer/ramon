'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, APP_PASSWORD, AUTH_COOKIE_VALUE } from '@/lib/authConstants';

export async function login(password: string) {
  if (password === APP_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    redirect('/scrapbook');
  } else {
    return { error: 'Invalid password. Please try again.' };
  }
}
