'use server';
import fs from 'fs/promises';
import path from 'path';

const stateFilePath = path.join(process.cwd(), 'password-state.json');

export async function isPasswordEnabled(): Promise<boolean> {
  try {
    // Try to read the JSON file first
    const content = await fs.readFile(stateFilePath, 'utf-8');
    const { enabled } = JSON.parse(content);
    return enabled;
  } catch (error) {
    // If file doesn't exist or is invalid, check environment variable
    const envVar = process.env.PASSWORD_PROTECTION_DEFAULT_ENABLED;
    // Default to true (enabled) if envVar is not explicitly "false"
    if (envVar && envVar.toLowerCase() === 'false') {
      return false;
    }
    return true; // Default to enabled
  }
}

export async function setPasswordEnabled(enabled: boolean): Promise<void> {
  // Ensure the directory exists before writing, though process.cwd() should exist
  // For robustness, you might add directory creation if stateFilePath was deeper
  await fs.writeFile(stateFilePath, JSON.stringify({ enabled }));
}
