export const DB_REQUEST_TIMEOUT_MS = 5000;

export function withTimeout<T>(
  operation: PromiseLike<T>,
  label = 'Database request',
  timeoutMs = DB_REQUEST_TIMEOUT_MS,
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeout = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([Promise.resolve(operation), timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}
