'use server';
import fs from 'fs/promises';
import path from 'path';

const stateFilePath = path.join(process.cwd(), 'password-state.json');

export async function isPasswordEnabled(): Promise<boolean> {
  return false; // Always return false to disable password protection
}

export async function setPasswordEnabled(enabled: boolean): Promise<void> {
  // This function is now a no-op as password state is fixed
  // but we keep it to avoid breaking imports immediately.
  // Consider removing it in a follow-up refactor.
  await Promise.resolve();
}
