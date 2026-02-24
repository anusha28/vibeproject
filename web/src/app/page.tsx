import { Search, MapPin, Users, Clock, ShieldCheck, Compass, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { supabaseServer } from "@/lib/supabase-server";

const PILLAR_THEMES: Record<string, any> = {
  stem: { text: "text-indigo-600", gradient: "from-indigo-500 to-blue-600" },
  art: { text: "text-rose-600", gradient: "from-rose-400 to-orange-500" },
  drama: { text: "text-purple-600", gradient: "from-purple-500 to-fuchsia-600" },
  sport: { text: "text-emerald-600", gradient: "from-emerald-400 to-teal-600" },
  other: { text: "text-slate-600", gradient: "from-slate-400 to-slate-600" }
};

const filters = [
  { id: 'all', label: '🌟 All' },
  { id: 'schools', label: '🏫 Public Schools' },
  { id: 'sport', label: '⚽ Sports' },
  { id: 'stem', label: '🧬 STEM' },
  { id: 'art', label: '🎨 Arts' }
];

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const activeFilter = resolvedParams.filter || 'all';

  let displayData: any[] = [];
  let displayType = 'clubs';

  // Fetch real data dynamically based on the clicked filter
  if (activeFilter === 'schools') {
    displayType = 'schools';
    const { data } = await supabaseServer
      .from('schools')
      .select('*')
      // Showing Bay Area schools to make the landing page relevant to our dataset
      .in('city', ['San Francisco', 'Oakland', 'San Jose'])
      .limit(6);
    displayData = data || [];
  } else {
    displayType = 'clubs';
    let query = supabaseServer
      .from('clubs')
      .select('*, schools(name, city, state)')
      .order('members_count', { ascending: false })
      .limit(6);
      
    if (activeFilter !== 'all') {
      query = query.eq('pillar', activeFilter);
    }
    const { data } = await query;
    displayData = data || [];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ClubScout</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">
              Add a Club
            </Link>
            <Link href="#" className="text-sm font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition">
              Sign In / Parents
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            Discover your community
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 md:text-6xl leading-tight">
            Find the perfect school club!!
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore public school after-care, homeschool co-ops, and student-led clubs in your local area.
          </p>
          
          {/* Functional Search Bar Component */}
          <SearchBar />

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {filters.map((f) => (
              <Link 
                key={f.id} 
                href={`/?filter=${f.id}`} 
                scroll={false} 
                className={`px-4 py-2 bg-white border ${activeFilter === f.id ? 'border-indigo-600 text-indigo-600 shadow-md' : 'border-slate-200 text-slate-600'} rounded-full text-sm font-medium hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white border-y border-slate-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">1. Search your school</h3>
                <p className="text-slate-600 leading-relaxed">Enter your school name or zip code to see what's available nearby.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">2. Browse verified clubs</h3>
                <p className="text-slate-600 leading-relaxed">Filter by age, interest, and schedule to find the perfect fit.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">3. Connect & Join</h3>
                <p className="text-slate-600 leading-relaxed">Reach out to organizers directly and join your new community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Data Grid */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              {activeFilter === 'schools' ? 'Popular Public Schools' : 'Popular Clubs in your area'}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayType === 'clubs' && displayData.map((club) => {
                const theme = PILLAR_THEMES[club.pillar] || PILLAR_THEMES.other;
                const school = club.schools as any;
                return (
                  <Link key={club.id} href={`/club/${club.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer block focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
                    <div className="h-48 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {club.type || "Club"}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{club.name}</h3>
                      <div className="flex items-center text-slate-500 text-sm mb-5 gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span>{school?.name} ({school?.city})</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-8">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Users className="w-4 h-4 text-slate-400"/> {club.age_range || 'All ages'}</div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-slate-400"/> {club.meeting_time || 'TBD'}</div>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+{club.members_count || 0}</div>
                        </div>
                        <div className={`${theme.text} font-bold text-sm flex items-center gap-1 group-hover:opacity-80`}>
                          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {displayType === 'schools' && displayData.map((school) => (
                <Link key={school.id} href={`/school/${school.slug}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer block focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {school.type || "Public"}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{school.name}</h3>
                      <div className="flex items-center text-slate-500 text-sm mb-5 gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span>{school.city}, {school.state}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-8 line-clamp-2">
                        {school.address}
                      </p>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                        <div className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:opacity-80">
                          View Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>
            
            {displayData.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No results found for this category yet.
              </div>
            )}
            
          </div>
        </section>

      </main>
    </div>
  );
}
