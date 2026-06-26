import { createClient } from '@supabase/supabase-js';
import { Database } from '../04-types/supabase';
import { env } from './env'; // Импортируем из конфига

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseKey);