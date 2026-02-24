import { MapPin, Users, Clock, ArrowRight, Compass, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = 'force-dynamic';

const PILLAR_THEMES: Record<string, any> = {
  stem: { text: "text-indigo-600", gradient: "from-indigo-500 to-blue-600" },
  art: { text: "text-rose-600", gradient: "from-rose-400 to-orange-500" },
  drama: { text: "text-purple-600", gradient: "from-purple-500 to-fuchsia-600" },
  sport: { text: "text-emerald-600", gradient: "from-emerald-400 to-teal-600" },
  other: { text: "text-slate-600", gradient: "from-slate-400 to-slate-600" }
};

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const citySlug = resolvedParams.city;
  const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const { data: schools } = await supabaseServer.from('schools').select('id, name, slug').ilike('city', cityName);
  const schoolIds = schools?.map(s => s.id) || [];

  let clubs: any[] = [];
  if (schoolIds.length > 0) {
    const { data: fetchedClubs } = await supabaseServer.from('clubs').select('*, schools(name, city)').in('school_id', schoolIds).order('members_count', { ascending: false });
    const uniqueClubNames = new Set();
    fetchedClubs?.forEach(club => {
      if (!uniqueClubNames.has(club.name)) {
        uniqueClubNames.add(club.name);
        clubs.push(club);
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg"><Compass className="w-5 h-5" /></div>
            <span className="font-bold text-xl tracking-tight">ClubScout</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-4 py-2 rounded-full transition-colors hover:bg-slate-200">
            <ChevronLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mb-3">
            <MapPin className="w-4 h-4" /> City Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Clubs in {cityName}</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Available Programs ({clubs.length})</h2>
        {clubs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No clubs found in this area yet</h3>
            <p className="text-slate-500 mb-6">We are continually adding new locations!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => {
              const theme = PILLAR_THEMES[club.pillar] || PILLAR_THEMES.other;
              return (
                <Link key={club.id} href={`/club/${club.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer block focus:outline-none">
                  <div className="h-32 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{club.type || "Club"}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{club.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Users className="w-4 h-4 text-slate-400"/> {club.age_range || "All ages"}</div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-slate-400"/> {club.meeting_time || "TBD"}</div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                      <div className={`${theme.text} font-bold text-sm flex items-center gap-1 group-hover:opacity-80`}>
                        Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
