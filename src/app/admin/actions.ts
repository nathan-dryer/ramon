
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Use environment variable for admin password, default if not set.
// Ensure it's lowercase for consistent comparison.
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'natewashere').toLowerCase();
const ADMIN_COOKIE_NAME = 'admin_auth';
const ADMIN_COOKIE_VALUE = 'admin_is_authenticated';

interface AdminLoginFormState {
  error: string | null;
  success?: boolean;
}

export async function adminLogin(prevState: AdminLoginFormState, formData: FormData): Promise<AdminLoginFormState> {
  const password = formData.get('password') as string;

  // Make password check case-insensitive
  // ADMIN_PASSWORD is already processed to lowercase above.
  if (password && password.toLowerCase() === ADMIN_PASSWORD) {
    cookies().set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/', 
      sameSite: 'lax',
    });
    return { error: null, success: true };
  } else {
    return { error: 'Invalid admin password.', success: false };
  }
}

interface AdminLogoutState {
    error?: string | null;
    success?: boolean;
}

export async function logoutAdmin(prevState: AdminLogoutState, formData: FormData): Promise<AdminLogoutState> {
  try {
    cookies().set(ADMIN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Expire the cookie
      path: '/', // Ensure cookie is cleared for the correct path
      sameSite: 'lax',
    });

    // Revalidate common paths that might be affected or navigated to
    revalidatePath('/login');
    revalidatePath('/scrapbook');
    revalidatePath('/admin/videos'); // If admin might be on this page
    
    return { success: true };
  } catch (e) {
    return { error: 'Logout failed. Please try again.' };
  }
}

