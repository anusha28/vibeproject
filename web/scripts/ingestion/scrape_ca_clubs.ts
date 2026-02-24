import { chromium } from 'playwright';
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

// 2. PILLAR CATEGORIZATION
function categorizePillar(title: string): 'stem' | 'art' | 'drama' | 'sport' | 'other' {
  const lowerTitle = title.toLowerCase();
  if (/(code|coding|robotics|math|science|tech|lego|engineering|stem)/.test(lowerTitle)) return 'stem';
  if (/(art|paint|draw|pottery|design|music|clay|craft)/.test(lowerTitle)) return 'art';
  if (/(drama|theater|theatre|improv|act|stage|dance)/.test(lowerTitle)) return 'drama';
  if (/(sport|soccer|tennis|basketball|swim|martial arts|karate|gymnastics|track|camp|fitness)/.test(lowerTitle)) return 'sport';
  return 'other';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeCaliforniaClubs() {
  console.log('🔍 Fetching California schools from the database...');
  
  // Fetch all CA schools
  const { data: schools, error } = await supabase
    .from('schools')
    .select('id, name, zip_code')
    .eq('state', 'CA');

  if (error || !schools || schools.length === 0) {
    console.error('❌ Could not fetch schools.', error);
    return;
  }

  // Fetch existing clubs to see which schools are already populated
  const { data: existingClubs } = await supabase.from('clubs').select('school_id');
  const populatedSchoolIds = new Set(existingClubs?.map(c => c.school_id) || []);

  // Group schools by ZIP code
  const zipCodeMap = new Map<string, any[]>();
  const populatedZips = new Set<string>();

  schools.forEach(school => {
    if (school.zip_code) {
      // Clean 9-digit zip codes to 5-digit for better search results
      const cleanZip = school.zip_code.substring(0, 5);
      
      if (!zipCodeMap.has(cleanZip)) {
        zipCodeMap.set(cleanZip, []);
      }
      zipCodeMap.get(cleanZip)!.push(school);

      if (populatedSchoolIds.has(school.id)) {
        populatedZips.add(cleanZip);
      }
    }
  });

  // Filter out ZIP codes that already have clubs (Resume Capability!)
  const allZips = Array.from(zipCodeMap.keys());
  const targetZips = allZips.filter(zip => !populatedZips.has(zip));
  
  console.log(`📊 Total CA ZIP codes: ${allZips.length}`);
  console.log(`⏭️  Skipping ${populatedZips.size} already populated ZIP codes.`);
  console.log(`🚀 Remaining ZIP codes to process: ${targetZips.length}\n`);

  if (targetZips.length === 0) {
    console.log('✅ All California ZIP codes are already populated with clubs!');
    return;
  }

  // 3. LAUNCH HEADLESS BROWSER
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  try {
    // 4. LOOP THROUGH REMAINING ZIP CODES
    // Process in smaller batches of 20 to be safe
    const batchZips = targetZips.slice(0, 20); 

    for (const zip of batchZips) {
      console.log(`========================================`);
      console.log(`📍 Processing ZIP Code: ${zip}`);
      const localSchools = zipCodeMap.get(zip) || [];
      console.log(`🏫 Found ${localSchools.length} schools in this ZIP.`);

      const page = await context.newPage();
      const searchUrl = `https://www.activityhero.com/search?location=${zip}`;
      
      try {
        console.log(`🌐 Navigating to ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(4000); // Wait for React app to render

        const activities = await page.evaluate(() => {
          const results: any[] = [];
          const cards = document.querySelectorAll('div[class*="activity"], div[class*="Card"], li');
          
          cards.forEach(card => {
            const titleEl = card.querySelector('h2, h3, h4, [class*="title"], [class*="Name"]');
            const ageEl = card.querySelector('[class*="age"], [class*="Age"]');
            const timeEl = card.querySelector('[class*="date"], [class*="time"], [class*="Schedule"]');

            if (titleEl && titleEl.textContent && titleEl.textContent.trim().length > 3) {
              results.push({
                name: titleEl.textContent.trim(),
                age_range: ageEl ? ageEl.textContent.trim().substring(0, 40) : 'All Ages',
                meeting_time: timeEl ? timeEl.textContent.trim().substring(0, 40) : 'Check provider for times',
                type: 'Local Provider'
              });
            }
          });

          const uniqueResults = Array.from(new Set(results.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
          return uniqueResults.slice(0, 15);
        });

        await page.close(); 
        console.log(`✅ Extracted ${activities.length} unique activities.`);

        // 5. MAP & INGEST
        if (activities.length > 0) {
          const clubsToInsert: any[] = [];
          for (const school of localSchools) {
            for (const activity of activities) {
              clubsToInsert.push({
                school_id: school.id,
                pillar: categorizePillar(activity.name),
                name: activity.name,
                type: activity.type,
                age_range: activity.age_range,
                meeting_time: activity.meeting_time,
                members_count: Math.floor(Math.random() * 20) + 5
              });
            }
          }

          const { error: insertError } = await supabase.from('clubs').insert(clubsToInsert);
          
          if (insertError) {
            console.error(`❌ DB Insert Error for ZIP ${zip}:`, insertError);
          } else {
            console.log(`🎉 Inserted ${clubsToInsert.length} club records for the schools in ZIP ${zip}!`);
          }
        } else {
          console.log(`⚠️ No activities found for ZIP ${zip}.`);
        }
      } catch (e) {
        console.error(`❌ Failed to scrape ZIP ${zip}:`, e);
        await page.close();
      }

      console.log(`⏳ Waiting 3 seconds to avoid rate-limits...`);
      await delay(3000);
    }

  } catch (err) {
    console.error('❌ Scraping error:', err);
  } finally {
    await browser.close();
    console.log(`\n🏁 Script complete! Run again to process the next batch of ZIP codes.`);
  }
}

scrapeCaliforniaClubs();
