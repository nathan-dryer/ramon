'use server';
import fs from 'fs/promises';
import path from 'path';

const stateFilePath = path.join(process.cwd(), 'password-state.json');

export async function isPasswordEnabled(): Promise<boolean> {
  try {
    const content = await fs.readFile(stateFilePath, 'utf-8');
    const { enabled } = JSON.parse(content);
    return enabled;
  } catch (error) {
    // If the file doesn't exist or is invalid, default to enabled
    return true;
  }
}

export async function setPasswordEnabled(enabled: boolean): Promise<void> {
  await fs.writeFile(stateFilePath, JSON.stringify({ enabled }));
}
