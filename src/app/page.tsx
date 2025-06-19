import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from '@/lib/authConstants';

export default function HomePage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME);

  if (authToken?.value === AUTH_COOKIE_VALUE) {
    redirect('/scrapbook');
  } else {
    redirect('/login');
  }
  // This return is technically unreachable due to redirects but satisfies Next.js page structure.
  return null;
}
