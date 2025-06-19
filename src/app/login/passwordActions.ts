
'use server';

import { setPasswordEnabled } from '@/lib/password-state';
import { revalidatePath } from 'next/cache';

export async function updatePasswordSetting(enabled: boolean) {
  await setPasswordEnabled(enabled);
  revalidatePath('/login'); // Revalidate login page to reflect new password requirement state
}
