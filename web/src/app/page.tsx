import { Search, MapPin, Users, Clock, ShieldCheck, Compass, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home() {
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
            {['🏫 Public Schools', '🏡 Homeschool Groups', '⚽ Sports', '🧬 STEM', '🎨 Arts'].map((tag) => (
              <button key={tag} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow">
                {tag}
              </button>
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

        {/* Featured Clubs Grid */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Popular in your area</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Public
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Robotics & Coding Club</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-5 gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>Lincoln High School</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-8">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Users className="w-4 h-4 text-slate-400"/> Ages 10-14</div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-slate-400"/> Tue 4 PM</div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+12</div>
                    </div>
                    <button className="text-indigo-600 font-bold text-sm group-hover:text-indigo-700 flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Homeschool
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Outdoor Explorers Co-op</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-5 gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Westside Community Park</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-8">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Users className="w-4 h-4 text-slate-400"/> Ages 6-10</div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-slate-400"/> Thu 10 AM</div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+8</div>
                    </div>
                    <button className="text-emerald-600 font-bold text-sm group-hover:text-emerald-700 flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer md:hidden lg:flex">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-500 opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Public
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Creative Arts Studio</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-5 gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Washington Middle School</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-8">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Users className="w-4 h-4 text-slate-400"/> Ages 11-14</div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-slate-400"/> Wed 3:30 PM</div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-rose-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+24</div>
                    </div>
                    <button className="text-rose-600 font-bold text-sm group-hover:text-rose-700 flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-full font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow">
                View All Clubs
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
