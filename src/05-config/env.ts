import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const env = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
};

if (!env.supabaseUrl || !env.supabaseKey) {
  throw new Error('Missing required SUPABASE_URL or SUPABASE_KEY environment variable');
}
