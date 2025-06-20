export const AUTH_COOKIE_NAME = 'ramon_celebration_auth';

/**
 * IMPORTANT:
 * Do NOT expose the application password with a `NEXT_PUBLIC_` prefix – that would ship it to the browser.
 * Always read it from a server-only environment variable (e.g. in `.env.local`):
 *
 *   APP_PASSWORD="super-secret"
 *
 * During local development a fallback value is provided, but **must** be overridden
 * in production environments.
 */
export const APP_PASSWORD = process.env.APP_PASSWORD || 'RAMON50_DEV_ONLY';
export const AUTH_COOKIE_VALUE = 'user_is_authenticated_for_ramon_50th';
