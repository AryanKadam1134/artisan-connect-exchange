
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Please provide your Supabase project URL. You can find it in your Supabase project settings -> API settings.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Please provide your Supabase anon key. You can find it in your Supabase project settings -> API settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
