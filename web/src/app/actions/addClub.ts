'use server'

import { supabaseServer } from "@/lib/supabase-server";

export async function submitClub(formData: FormData) {
  const name = formData.get('name') as string;
  const organizer = formData.get('organizer') as string;
  const location = formData.get('location') as string;
  const pillar = formData.get('pillar') as string;
  const capacity = parseInt(formData.get('capacity') as string) || 0;
  const description = formData.get('description') as string;

  if (!name || !location || !pillar) {
    return { error: 'Missing required fields' };
  }

  // 1. Find a matching school for the location/school input
  // We use ilike to do a fuzzy search on either the school name or city
  const { data: schools } = await supabaseServer
    .from('schools')
    .select('id')
    .or(`name.ilike.%${location}%,city.ilike.%${location}%`)
    .limit(1);

  if (!schools || schools.length === 0) {
    return { error: `We couldn't find a public school or city matching "${location}" in our database. Try a specific city like "San Jose" or "San Francisco".` };
  }

  const school_id = schools[0].id;

  // 2. Insert the new club into the database
  const { error: insertError } = await supabaseServer
    .from('clubs')
    .insert({
      school_id,
      name,
      pillar,
      type: `Organizer: ${organizer}`,
      description,
      members_count: capacity,
      age_range: 'All Ages', // Default placeholder
      meeting_time: 'TBD'    // Default placeholder
    });

  if (insertError) {
    console.error('Insert error:', insertError);
    return { error: 'Failed to save the club to the database. Please try again.' };
  }

  return { success: true };
}
