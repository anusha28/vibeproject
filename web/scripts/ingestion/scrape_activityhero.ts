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

// 2. PILLAR CATEGORIZATION LOGIC
function categorizePillar(title: string): 'stem' | 'art' | 'drama' | 'sport' | 'other' {
  const lowerTitle = title.toLowerCase();
  
  if (/(code|coding|robotics|math|science|tech|lego|engineering|stem)/.test(lowerTitle)) return 'stem';
  if (/(art|paint|draw|pottery|design|music|clay|craft)/.test(lowerTitle)) return 'art';
  if (/(drama|theater|theatre|improv|act|stage|dance)/.test(lowerTitle)) return 'drama';
  if (/(sport|soccer|tennis|basketball|swim|martial arts|karate|gymnastics|track|camp)/.test(lowerTitle)) return 'sport';
  
  return 'other';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scaleScraper() {
  console.log('🔍 Fetching target ZIP codes from the database...');
  
  const BAY_AREA_CITIES = ['San Francisco', 'Oakland', 'San Jose'];
  
  const { data: schools, error } = await supabase
    .from('schools')
    .select('id, name, zip_code, city')
    .in('city', BAY_AREA_CITIES);

  if (error || !schools || schools.length === 0) {
    console.error('❌ Could not fetch schools from the database.', error);
    return;
  }

  // Group schools by ZIP code
  const zipCodeMap = new Map<string, any[]>();
  schools.forEach(school => {
    if (school.zip_code) {
      if (!zipCodeMap.has(school.zip_code)) {
        zipCodeMap.set(school.zip_code, []);
      }
      zipCodeMap.get(school.zip_code)!.push(school);
    }
  });

  const uniqueZips = Array.from(zipCodeMap.keys());
  
  // LIMIT TO 5 ZIP CODES FOR PROTOTYPE RUN (so it finishes quickly and doesn't trigger bot protection)
  const targetZips = uniqueZips.slice(0, 5); 
  console.log(`✅ Found ${uniqueZips.length} unique Bay Area ZIP codes.`);
  console.log(`🚀 Processing a batch of ${targetZips.length} ZIP codes to respect rate limits...\n`);

  // 3. LAUNCH HEADLESS BROWSER
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  try {
    // 4. LOOP THROUGH ZIP CODES
    for (const zip of targetZips) {
      console.log(`========================================`);
      console.log(`📍 Processing ZIP Code: ${zip}`);
      const localSchools = zipCodeMap.get(zip) || [];
      console.log(`🏫 Found ${localSchools.length} schools in this ZIP.`);

      const page = await context.newPage();
      const searchUrl = `https://www.activityhero.com/search?location=${zip}`;
      console.log(`🌐 Navigating to ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
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

        // Deduplicate results
        const uniqueResults = Array.from(new Set(results.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
        // Return top 15 results
        return uniqueResults.slice(0, 15);
      });

      await page.close(); // Close tab to free memory
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

        console.log(`💾 Inserting ${clubsToInsert.length} club records into Supabase...`);
        const { error: insertError } = await supabase.from('clubs').insert(clubsToInsert);
        
        if (insertError) {
          console.error(`❌ DB Insert Error for ZIP ${zip}:`, insertError);
        } else {
          console.log(`🎉 Success for ZIP ${zip}!`);
        }
      } else {
        console.log(`⚠️ No activities found for ZIP ${zip}.`);
      }

      console.log(`⏳ Waiting 3 seconds before the next scrape...`);
      await delay(3000);
    }

  } catch (err) {
    console.error('❌ Scraping error:', err);
  } finally {
    await browser.close();
    console.log(`\n🏁 Batch processing complete!`);
  }
}

scaleScraper();
