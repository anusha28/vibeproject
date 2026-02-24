# ClubScout 🧭

A modern SaaS directory built to help parents and students discover after-school programs, public school clubs, and homeschool co-ops in their local area. 

## 🚨 The Problem
Finding reliable, up-to-date information about after-school activities is a fragmented and frustrating experience for parents. Information is often scattered across school newsletters, private Facebook groups, or local community boards. There is no centralized, easily searchable directory that lets a parent simply type in their child's school or city and instantly see all available programs categorized by their child's interests (STEM, Arts, Sports, etc.).

## 💡 The Solution
**ClubScout** solves this by providing a hyper-local, search-first platform. 
* **For Parents:** A lightning-fast auto-complete search bar allows parents to search by specific public schools or entire cities to view dedicated dashboards of local clubs.
* **For Organizers:** A seamless "Add a Club" flow allows program directors and PTA volunteers to easily list their programs, mapping them to local schools and categories.

## ✨ Key Features
* **Dual-Entity Search:** A smart auto-complete search bar that distinguishes between Cities/Locations and specific Schools, routing users to dynamic dashboards for each.
* **Categorized Pillars:** Clubs are automatically organized into visual pillars (`STEM & Tech`, `Creative Arts`, `Drama & Theater`, `Sports & Athletics`).
* **Automated Data Pipelines:** Includes robust backend ingestion scripts that automatically populate the database using public NCES data and web scraping.
* **Resume-Capable Scraping:** The ingestion engine remembers which zip codes have been processed, allowing for safe, rate-limit-friendly scraping at scale.

## 🛠️ Tech Stack

### Frontend
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Library:** React 19
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** Lucide React

### Backend & Database
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Architecture:** React Server Components & Server Actions (Ensures DB credentials are never exposed to the client)
* **Routing:** Dynamic Next.js routing (`/school/[slug]`, `/location/[city]`, `/club/[id]`)

### Data Ingestion & Pipelines
* **Public APIs:** Urban Institute Education Data API (Aggregating NCES Common Core of Data for 100k+ US Public Schools)
* **Web Scraping:** [Playwright](https://playwright.dev/) (Headless Chromium browser for extracting dynamic React-based directory data from sources like ActivityHero)
* **Script Execution:** `tsx` and `dotenv` for secure, environment-aware local script running.

### Deployment
* **Hosting:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env.local` file in the `web` directory with your Supabase credentials:
```env
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 2. Database Setup
Run the `supabase_schema.sql` file in your Supabase SQL Editor to generate the `schools` and `clubs` tables, along with optimized indexes and Row Level Security (RLS) policies.

### 3. Run Locally
```bash
cd web
npm install
npm run dev
```
The app will be available at `http://localhost:3001`.

### 4. Data Ingestion (Optional)
To populate the database with real schools and clubs, run the ingestion scripts:
```bash
# Pull California public schools from NCES
npx tsx scripts/ingestion/sf_bay_schools.ts

# Scrape local club data for Los Angeles / Santa Clarita
npx tsx scripts/ingestion/socal_data.ts
```
