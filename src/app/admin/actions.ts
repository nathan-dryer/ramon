
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = 'natewashere';
const ADMIN_COOKIE_NAME = 'admin_auth';
const ADMIN_COOKIE_VALUE = 'admin_is_authenticated';

interface AdminLoginFormState {
  error: string | null;
}

export async function adminLogin(prevState: AdminLoginFormState, formData: FormData): Promise<AdminLoginFormState> {
  const password = formData.get('password') as string;

  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/admin',
      sameSite: 'lax',
    });
    redirect('/admin/dashboard');
  } else {
    return { error: 'Invalid admin password.' };
  }
}

export async function logoutAdmin() {
  cookies().set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/admin',
    sameSite: 'lax',
  });
  redirect('/admin');
}
