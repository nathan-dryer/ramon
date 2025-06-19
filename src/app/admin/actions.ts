
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = 'natewashere';
const ADMIN_COOKIE_NAME = 'admin_auth';
const ADMIN_COOKIE_VALUE = 'admin_is_authenticated';

interface AdminLoginFormState {
  error: string | null;
  success?: boolean;
}

export async function adminLogin(prevState: AdminLoginFormState, formData: FormData): Promise<AdminLoginFormState> {
  const password = formData.get('password') as string;

  // Make password check case-insensitive
  if (password && password.toLowerCase() === ADMIN_PASSWORD) { // ADMIN_PASSWORD is already lowercase
    cookies().set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });
    return { error: null, success: true };
  } else {
    return { error: 'Invalid admin password.', success: false };
  }
}

export async function logoutAdmin() {
  cookies().set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
  });
  redirect('/login'); // Redirect to login page after admin logout
}
