'use server'

import { supabaseServer } from "@/lib/supabase-server";

export async function searchSchools(query: string) {
  // Only search if the user has typed at least 2 characters
  if (!query || query.length < 2) return [];

  // Query Supabase for schools matching the name (case-insensitive)
  const { data, error } = await supabaseServer
    .from('schools')
    .select('id, name, city, state, slug')
    .ilike('name', `%${query}%`)
    .limit(5);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data || [];
}
