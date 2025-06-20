
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin_auth';
const ADMIN_COOKIE_VALUE = 'admin_is_authenticated';

export async function isAdminAuthenticated(): Promise<boolean> {
  // `cookies()` must be awaited in Next.js 15+
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return adminCookie?.value === ADMIN_COOKIE_VALUE;
}
