import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseKey) {
  console.error('❌ Missing or invalid Supabase environment variables.');
  console.error('Please update your .env.local file with real credentials before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Upsert School (Insert or Update if slug already exists)
  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .upsert({
      name: 'Lincoln High School',
      slug: 'lincoln-high-school',
      type: 'Public',
      address: '123 Education Way',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62701'
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (schoolError) {
    console.error('❌ Error inserting school:', schoolError);
    return;
  }
  
  console.log(`🏫 School ready: ${school.name} (ID: ${school.id})`);

  // 2. Prepare Clubs
  const clubs = [
    { school_id: school.id, pillar: 'stem', name: 'Robotics & Coding', type: 'Public', age_range: '10-14', meeting_time: 'Tue 4 PM', members_count: 12 },
    { school_id: school.id, pillar: 'stem', name: 'Math Olympiad', type: 'Public', age_range: '12-16', meeting_time: 'Thu 3:30 PM', members_count: 8 },
    { school_id: school.id, pillar: 'stem', name: 'Science Fair Prep', type: 'Public', age_range: '11-15', meeting_time: 'Wed 4:30 PM', members_count: 18 },
    { school_id: school.id, pillar: 'art', name: 'Painting Studio', type: 'Homeschool', age_range: '8-12', meeting_time: 'Wed 10 AM', members_count: 15 },
    { school_id: school.id, pillar: 'art', name: 'Digital Design', type: 'Public', age_range: '13-18', meeting_time: 'Mon 4 PM', members_count: 20 },
    { school_id: school.id, pillar: 'art', name: 'Pottery & Clay', type: 'Public', age_range: '10-14', meeting_time: 'Fri 3:30 PM', members_count: 10 },
    { school_id: school.id, pillar: 'drama', name: 'Shakespeare Troupe', type: 'Public', age_range: '14-18', meeting_time: 'Fri 5 PM', members_count: 25 },
    { school_id: school.id, pillar: 'drama', name: 'Improv Comedy', type: 'Public', age_range: '11-15', meeting_time: 'Tue 3:30 PM', members_count: 14 },
    { school_id: school.id, pillar: 'sport', name: 'Outdoor Explorers', type: 'Homeschool', age_range: '6-10', meeting_time: 'Thu 10 AM', members_count: 8 },
    { school_id: school.id, pillar: 'sport', name: 'Varsity Track Prep', type: 'Public', age_range: '14-18', meeting_time: 'Mon-Wed 4 PM', members_count: 30 }
  ];

  // Optional: Clean up existing clubs for this school to avoid duplicates during repeated testing
  await supabase.from('clubs').delete().eq('school_id', school.id);

  // 3. Insert Clubs
  const { data: insertedClubs, error: clubsError } = await supabase
    .from('clubs')
    .insert(clubs)
    .select();

  if (clubsError) {
    console.error('❌ Error inserting clubs:', clubsError);
    return;
  }

  console.log(`✨ Successfully seeded ${insertedClubs.length} clubs into the database!`);
  console.log(`👉 You can now visit http://localhost:3001/school/lincoln-high-school to see them live.`);
}

seed().catch(console.error);
