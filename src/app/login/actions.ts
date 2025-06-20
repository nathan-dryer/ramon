
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, APP_PASSWORD, AUTH_COOKIE_VALUE } from '@/lib/authConstants';
import { isPasswordEnabled } from '@/lib/password-state';

// Define the state type for useFormState
interface LoginFormState {
  error: string | null;
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const passwordRequired = await isPasswordEnabled();

  if (!passwordRequired) {
    (await cookies()).set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    });
    redirect('/scrapbook');
  }

  const password = formData.get('password');

  if (typeof password !== 'string' || password.trim() === '') {
    return { error: 'Password is required.' };
  }

  if (password.toLowerCase() === APP_PASSWORD.toLowerCase()) {
    (await cookies()).set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
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
