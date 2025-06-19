export const AUTH_COOKIE_NAME = 'ramon_celebration_auth';

// IMPORTANT: In a real application, this password MUST be stored securely as an environment variable.
// For example, process.env.APP_PASSWORD
// For this exercise, it's hardcoded but with a strong recommendation for secure handling.
export const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || 'RAMON50';
export const AUTH_COOKIE_VALUE = 'user_is_authenticated_for_ramon_50th';
