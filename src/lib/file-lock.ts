const DEFAULT_LOCK_TIMEOUT = 5000; // 5 seconds
const RETRY_DELAY = 50; // 50 milliseconds

// In-memory store for active file locks
const lockedFilePaths = new Set<string>();

/**
 * Acquires a lock for a given file path.
 * Uses a polling mechanism with a timeout.
 * @param filePath The path of the file to lock.
 * @param timeoutMs The maximum time to wait for the lock in milliseconds.
 * @returns A Promise that resolves when the lock is acquired.
 * @throws Error if the lock cannot be acquired within the timeout.
 */
async function acquireLock(filePath: string, timeoutMs: number = DEFAULT_LOCK_TIMEOUT): Promise<void> {
  const startTime = Date.now();

  while (lockedFilePaths.has(filePath)) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout: Could not acquire lock for ${filePath} within ${timeoutMs}ms.`);
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  lockedFilePaths.add(filePath);
}

/**
 * Releases a lock for a given file path.
 * @param filePath The path of the file to release the lock for.
 */
function releaseLock(filePath: string): void {
  lockedFilePaths.delete(filePath);
}

/**
 * A higher-order function that executes an operation while holding a lock for a file.
 * Ensures the lock is released even if the operation fails.
 * @param filePath The path of the file to lock.
 * @param operation A function that returns a Promise, representing the operation to perform.
 * @param timeoutMs The maximum time to wait for the lock in milliseconds.
 * @returns A Promise that resolves with the result of the operation.
 * @template T The return type of the operation.
 */
export async function withLock<T>(
  filePath: string,
  operation: () => Promise<T>,
  timeoutMs: number = DEFAULT_LOCK_TIMEOUT
): Promise<T> {
  await acquireLock(filePath, timeoutMs);
  try {
    const result = await operation();
    return result;
  } finally {
    releaseLock(filePath);
  }
}

/**
 * Checks if a specific file is currently locked.
 * Primarily for testing or debugging purposes.
 * @param filePath The path of the file to check.
 * @returns True if the file is locked, false otherwise.
 */
export async function isLocked(filePath: string): Promise<boolean> {
  return lockedFilePaths.has(filePath);
}
