
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/authConstants';
// import { isPasswordEnabled } from '@/lib/password-state'; // No longer needed
// import { APP_PASSWORD } from '@/lib/authConstants'; // No longer needed for guest login

// Define the state type for useFormState
interface LoginFormState {
  error: string | null; // Though error will not be set anymore in this simplified version
}

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // const passwordRequired = await isPasswordEnabled(); // No longer needed, always false

  // if (!passwordRequired) { // This block will always execute
  (await cookies()).set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
  redirect('/scrapbook');
  // }

  // The following password check logic is now effectively dead code
  // because the redirect above will always happen first.
  // We can remove it.

  // const password = formData.get('password');

  // if (typeof password !== 'string' || password.trim() === '') {
  //   return { error: 'Password is required.' };
  // }

  // if (password.toLowerCase() === APP_PASSWORD.toLowerCase()) {
  //   (await cookies()).set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     maxAge: 60 * 60 * 24 * 7, // 1 week
  //     path: '/',
  //     sameSite: 'lax',
  //   });
  //   redirect('/scrapbook');
  // } else {
  //   return { error: 'Invalid password. Please try again.' };
  // }
}
