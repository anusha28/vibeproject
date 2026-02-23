import { createClient } from '@supabase/supabase-js';

// By NOT using the NEXT_PUBLIC_ prefix, Next.js ensures these variables 
// are strictly securely locked to the server environment and never exposed to the browser.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// This client should ONLY be used in React Server Components or Server Actions
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
