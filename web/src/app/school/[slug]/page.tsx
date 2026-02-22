import { Users, Clock, ArrowRight, ChevronLeft, MapPin, Terminal, Palette, Ticket, Trophy, Compass } from "lucide-react";
import Link from "next/link";

// Dummy dataset organized by pillars
const PILLARS = [
  {
    id: "stem",
    title: "STEM & Tech",
    Icon: Terminal,
    theme: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", gradient: "from-indigo-500 to-blue-600" },
    clubs: [
      { id: 1, name: "Robotics & Coding", type: "Public", age: "10-14", time: "Tue 4 PM", members: 12 },
      { id: 2, name: "Math Olympiad", type: "Public", age: "12-16", time: "Thu 3:30 PM", members: 8 }
    ]
  },
  {
    id: "art",
    title: "Creative Arts",
    Icon: Palette,
    theme: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", gradient: "from-rose-400 to-orange-500" },
    clubs: [
      { id: 4, name: "Painting Studio", type: "Homeschool", age: "8-12", time: "Wed 10 AM", members: 15 },
      { id: 5, name: "Digital Design", type: "Public", age: "13-18", time: "Mon 4 PM", members: 20 }
    ]
  },
  {
    id: "drama",
    title: "Drama & Theater",
    Icon: Ticket,
    theme: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", gradient: "from-purple-500 to-fuchsia-600" },
    clubs: [
      { id: 7, name: "Shakespeare Troupe", type: "Public", age: "14-18", time: "Fri 5 PM", members: 25 },
      { id: 8, name: "Improv Comedy", type: "Public", age: "11-15", time: "Tue 3:30 PM", members: 14 }
    ]
  },
  {
    id: "sport",
    title: "Sports & Athletics",
    Icon: Trophy,
    theme: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", gradient: "from-emerald-400 to-teal-600" },
    clubs: [
      { id: 10, name: "Varsity Track Prep", type: "Public", age: "14-18", time: "Mon-Wed 4 PM", members: 30 }
    ]
  }
];

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const schoolName = resolvedParams.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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
            Local Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{schoolName}</h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Explore all the amazing clubs, co-ops, and after-school programs available to students at this school. Organized by your child's interests!
          </p>
        </div>
      </div>

      {/* Pillars / Clubs Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {PILLARS.map((pillar) => (
          <section key={pillar.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 rounded-xl ${pillar.theme.bg} ${pillar.theme.text} border ${pillar.theme.border} shadow-sm`}>
                <pillar.Icon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{pillar.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillar.clubs.map((club) => (
                <div key={club.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer">
                  <div className="h-32 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.theme.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {club.type}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{club.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Users className="w-4 h-4 text-slate-400"/> {club.age}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Clock className="w-4 h-4 text-slate-400"/> {club.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+{club.members}</div>
                      </div>
                      <button className={`${pillar.theme.text} font-bold text-sm flex items-center gap-1 group-hover:opacity-80`}>
                        Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}