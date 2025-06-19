
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, APP_PASSWORD, AUTH_COOKIE_VALUE } from '@/lib/authConstants';

// Define the state type for useFormState
interface LoginFormState {
  error: string | null;
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const password = formData.get('password') as string;

  if (password === APP_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    redirect('/scrapbook'); // Redirect will be caught by Next.js, no explicit return needed after it for success
  } else {
    return { error: 'Invalid password. Please try again.' };
  }
}
