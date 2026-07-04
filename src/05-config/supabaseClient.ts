import { createClient } from '@supabase/supabase-js';
import { Database } from '../04-types/supabase';
import { env } from './env';

const SUPABASE_REQUEST_TIMEOUT_MS = 5000;

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SUPABASE_REQUEST_TIMEOUT_MS);

  if (init?.signal) {
    if (init.signal.aborted) {
      controller.abort();
    } else {
      init.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Supabase request timed out after ${SUPABASE_REQUEST_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseKey, {
  global: {
    fetch: fetchWithTimeout,
  },
});
