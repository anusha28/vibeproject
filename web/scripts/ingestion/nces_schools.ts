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

// 2. DATA SOURCE CONFIGURATION
const NCES_API_URL = 'https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/?fips=53'; // fips=53 is Washington State

// Helper function to create clean URL slugs
// Including city and state helps prevent collisions for schools with common names
function generateSlug(name: string, city: string, state: string) {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens
}

async function fetchAndIngestSchools() {
  console.log('🚀 Fetching public school data from NCES (via Urban Institute API)...');
  
  try {
    // 3. FETCH OPEN DATA
    const response = await fetch(NCES_API_URL);
    const json = await response.json();
    
    if (!json || !json.results) {
      throw new Error('Invalid API response');
    }

    // 4. TRANSFORM DATA TO OUR SCHEMA
    const rawSchools = json.results.map((school: any) => ({
      name: school.school_name,
      slug: generateSlug(school.school_name, school.city_location, school.state_location),
      type: 'Public',
      address: school.street_location,
      city: school.city_location,
      state: school.state_location,
      zip_code: school.zip_location,
    }));

    // Deduplicate array by slug to prevent Supabase "ON CONFLICT" errors in a single batch
    const uniqueSlugs = new Set();
    const schoolsToInsert = [];
    
    for (const school of rawSchools) {
      if (!uniqueSlugs.has(school.slug) && school.slug) {
        uniqueSlugs.add(school.slug);
        schoolsToInsert.push(school);
      }
    }

    console.log(`✅ Fetched and deduplicated ${schoolsToInsert.length} unique schools. Preparing to insert into Supabase...`);

    // 5. INGEST INTO DATABASE
    const { data, error } = await supabase
      .from('schools')
      .upsert(schoolsToInsert, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('❌ Supabase Insertion Error:', error);
    } else {
      console.log(`🎉 Successfully ingested ${data?.length} public schools into your database!`);
      if (data && data.length > 0) {
        console.log(`\nTry searching for this school slug on your local app: ${data[0].slug}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  }
}

fetchAndIngestSchools();
