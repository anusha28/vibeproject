import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 1. SECURE CONFIGURATION
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Bay Area target cities
const BAY_AREA_CITIES = ['San Francisco', 'Oakland', 'San Jose'];

function generateSlug(name: string, city: string, state: string) {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function fetchAndIngestBayAreaSchools() {
  console.log('🚀 Fetching public school data for the SF Bay Area...');
  
  let allRawSchools: any[] = [];

  try {
    // Fetch data for each target city
    for (const city of BAY_AREA_CITIES) {
      console.log(`Fetching schools for ${city}...`);
      // fips=06 is California
      const url = `https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/?fips=06&city_location=${encodeURIComponent(city.toUpperCase())}`;
      
      const response = await fetch(url);
      const json = await response.json();
      
      if (json && json.results) {
        allRawSchools = [...allRawSchools, ...json.results];
      }
    }

    // TRANSFORM DATA TO OUR SCHEMA
    const rawSchools = allRawSchools.map((school: any) => ({
      name: school.school_name,
      slug: generateSlug(school.school_name, school.city_location, school.state_location),
      type: 'Public',
      address: school.street_location,
      city: school.city_location,
      state: school.state_location,
      zip_code: school.zip_location,
    }));

    // Deduplicate array by slug
    const uniqueSlugs = new Set();
    const schoolsToInsert = [];
    
    for (const school of rawSchools) {
      if (!uniqueSlugs.has(school.slug) && school.slug) {
        uniqueSlugs.add(school.slug);
        schoolsToInsert.push(school);
      }
    }

    console.log(`✅ Fetched and deduplicated ${schoolsToInsert.length} unique Bay Area schools. Preparing to insert into Supabase...`);

    // INGEST INTO DATABASE
    const { data, error } = await supabase
      .from('schools')
      .upsert(schoolsToInsert, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('❌ Supabase Insertion Error:', error);
    } else {
      console.log(`🎉 Successfully ingested ${data?.length} Bay Area public schools!`);
      if (data && data.length > 0) {
        console.log(`\nTry searching for this school slug on your local app: ${data[0].slug}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  }
}

fetchAndIngestBayAreaSchools();
