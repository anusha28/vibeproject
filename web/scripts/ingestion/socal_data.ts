import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function getPillar(title: string) {
  const t = title.toLowerCase();
  if (/(code|math|science|tech|stem)/.test(t)) return 'stem';
  if (/(art|paint|draw|music|dance|drama|theater)/.test(t)) return 'art';
  if (/(sport|soccer|tennis|swim|camp|fitness)/.test(t)) return 'sport';
  return 'other';
}

async function run() {
  console.log('🚀 Fetching LA/Santa Clarita schools...');
  const cities = ['Los Angeles', 'Santa Clarita'];
  const schoolsToInsert = [];
  
  for (const city of cities) {
    const res = await fetch(`https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/?fips=06&city_location=${encodeURIComponent(city.toUpperCase())}`);
    const json = await res.json();
    if (json?.results) {
      json.results.forEach((s: any) => {
        const slug = `${s.school_name}-${s.city_location}-${s.state_location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        schoolsToInsert.push({ name: s.school_name, slug, type: 'Public', address: s.street_location, city: s.city_location, state: s.state_location, zip_code: s.zip_location });
      });
    }
  }

  const unique = Array.from(new Map(schoolsToInsert.map(s => [s.slug, s])).values());
  const { data: inserted } = await supabase.from('schools').upsert(unique, { onConflict: 'slug' }).select();
  
  const zipMap = new Map();
  inserted?.forEach(s => {
    const zip = s.zip_code?.substring(0,5);
    if (zip) { if (!zipMap.has(zip)) zipMap.set(zip, []); zipMap.get(zip).push(s); }
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0' });
  const zips = Array.from(zipMap.keys()).slice(0, 5); // Process first 5 zips

  for (const zip of zips) {
    console.log(`📍 Scraping ZIP: ${zip}`);
    const page = await context.newPage();
    try {
      await page.goto(`https://www.activityhero.com/search?location=${zip}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000);
      const activities = await page.evaluate(() => {
        const res: any[] = [];
        document.querySelectorAll('div[class*="activity"], div[class*="Card"], li').forEach(c => {
          const title = c.querySelector('h2, h3, h4, [class*="title"]')?.textContent?.trim();
          const age = c.querySelector('[class*="age"], [class*="Age"]')?.textContent?.trim()?.substring(0, 40) || 'All Ages';
          if (title && title.length > 3) res.push({ name: title, age_range: age, meeting_time: 'TBD', type: 'Local Provider' });
        });
        return Array.from(new Set(res.map(a => JSON.stringify(a)))).map(a => JSON.parse(a)).slice(0, 10);
      });
      await page.close();
      
      if (activities.length > 0) {
        const clubs = [];
        for (const s of zipMap.get(zip)) {
          for (const a of activities) {
            clubs.push({ school_id: s.id, pillar: getPillar(a.name), name: a.name, type: a.type, age_range: a.age_range, meeting_time: a.meeting_time, members_count: Math.floor(Math.random() * 15) + 5 });
          }
        }
        await supabase.from('clubs').insert(clubs);
      }
    } catch(e) { await page.close(); }
  }
  await browser.close();
  console.log('✅ Done processing SoCal batch!');
}

run();
