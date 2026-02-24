'use server'

import { supabaseServer } from "@/lib/supabase-server";

export async function searchSchoolsAndLocations(query: string) {
  // Only search if the user has typed at least 2 characters
  if (!query || query.length < 2) return { schools: [], locations: [] };

  // 1. Query Supabase for schools matching the name
  const { data: schools } = await supabaseServer
    .from('schools')
    .select('id, name, city, state, slug')
    .ilike('name', `%${query}%`)
    .limit(5);

  // 2. Query Supabase for unique cities (locations)
  const { data: citiesData } = await supabaseServer
    .from('schools')
    .select('city, state')
    .ilike('city', `%${query}%`)
    .limit(20);

  // Filter unique cities
  const uniqueLocations: any[] = [];
  const seen = new Set();
  
  if (citiesData) {
    for (const loc of citiesData) {
      if (loc.city && !seen.has(loc.city)) {
        seen.add(loc.city);
        uniqueLocations.push({ 
          city: loc.city, 
          state: loc.state, 
          slug: loc.city.toLowerCase().replace(/\s+/g, '-') 
        });
        if (uniqueLocations.length >= 5) break; // Limit to 5 unique cities
      }
    }
  }

  return { 
    schools: schools || [], 
    locations: uniqueLocations 
  };
}
