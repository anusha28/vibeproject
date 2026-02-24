import { Users, Clock, ArrowRight, ChevronLeft, MapPin, Terminal, Palette, Ticket, Trophy, Compass, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

// UI Definitions for our Pillars
const PILLAR_CONFIG = {
  stem: { title: "STEM & Tech", Icon: Terminal, theme: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", gradient: "from-indigo-500 to-blue-600" } },
  art: { title: "Creative Arts", Icon: Palette, theme: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", gradient: "from-rose-400 to-orange-500" } },
  drama: { title: "Drama & Theater", Icon: Ticket, theme: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", gradient: "from-purple-500 to-fuchsia-600" } },
  sport: { title: "Sports & Athletics", Icon: Trophy, theme: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", gradient: "from-emerald-400 to-teal-600" } },
  other: { title: "Other Clubs", Icon: Users, theme: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", gradient: "from-slate-400 to-slate-600" } }
} as const;

type PillarKey = keyof typeof PILLAR_CONFIG;

export const dynamic = 'force-dynamic';

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Securely fetch the school from the database
  const { data: school, error: schoolError } = await supabaseServer
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single();

  // If school doesn't exist, show a 404 page
  if (schoolError || !school) {
    return notFound();
  }

  // 2. Fetch all clubs belonging to this school
  const { data: clubs, error: clubsError } = await supabaseServer
    .from('clubs')
    .select('*')
    .eq('school_id', school.id);

  // 3. Group clubs by their pillars
  const clubsByPillar: Record<string, typeof clubs> = {
    stem: [], art: [], drama: [], sport: [], other: []
  };

  if (clubs) {
    clubs.forEach(club => {
      const pillar = club.pillar as PillarKey;
      if (clubsByPillar[pillar]) {
        clubsByPillar[pillar]!.push(club);
      } else {
        clubsByPillar.other!.push(club);
      }
    });
  }

  // Filter out empty pillars
  const activePillars = (Object.keys(clubsByPillar) as PillarKey[])
    .filter(key => clubsByPillar[key] && clubsByPillar[key]!.length > 0)
    .map(key => ({
      id: key,
      ...PILLAR_CONFIG[key],
      clubs: clubsByPillar[key]!
    }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ClubScout</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-4 py-2 rounded-full transition-colors hover:bg-slate-200">
              <ChevronLeft className="w-4 h-4" /> Back to Search
            </Link>
          </div>
        </div>
      </header>

      {/* School Header */}
      <div className="bg-white border-b border-slate-200 py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-3">
            <MapPin className="w-4 h-4" />
            {school.city && school.state ? `${school.city}, ${school.state}` : 'Local Directory'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{school.name}</h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Explore all the amazing clubs, co-ops, and after-school programs available to students at this school. Organized by your child's interests!
          </p>
        </div>
      </div>

      {/* Pillars / Clubs Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {activePillars.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 px-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Clubs data coming soon!</h3>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
              We are currently rolling out real club data starting with the <b>San Francisco Bay Area</b>. New clubs for {school.name} will be provided very soon!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-sm hover:shadow">
                Notify me when updated
              </button>
              <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow">
                I organize a club here
              </button>
            </div>
          </div>
        ) : (
          activePillars.map((pillar) => (
            <section key={pillar.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-xl ${pillar.theme.bg} ${pillar.theme.text} border ${pillar.theme.border} shadow-sm`}>
                  <pillar.Icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{pillar.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillar.clubs.map((club) => (
                  <Link key={club.id} href={`/club/${club.id}`} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer block focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
                    <div className="h-32 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${pillar.theme.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {club.type || "Club"}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{club.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-6">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          <Users className="w-4 h-4 text-slate-400"/> {club.age_range || "All ages"}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          <Clock className="w-4 h-4 text-slate-400"/> {club.meeting_time || "TBD"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+{club.members_count || 0}</div>
                        </div>
                        <div className={`${pillar.theme.text} font-bold text-sm flex items-center gap-1 group-hover:opacity-80`}>
                          Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
