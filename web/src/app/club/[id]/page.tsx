import { Users, Clock, ChevronLeft, MapPin, Calendar, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = 'force-dynamic';

export default async function ClubPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 1. Fetch club and its associated school data
  const { data: club, error } = await supabaseServer
    .from('clubs')
    .select('*, schools(name, slug, city, state)')
    .eq('id', id)
    .single();

  if (error || !club) {
    return notFound();
  }

  // Next.js Supabase relation joins come back as objects or arrays. For a 1:1, it's an object.
  const school = club.schools as any;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/school/${school.slug}`} className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-4 py-2 rounded-full transition-colors hover:bg-slate-200">
            <ChevronLeft className="w-4 h-4" /> Back to {school.name}
          </Link>
        </div>
      </header>

      {/* Club Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur text-slate-900 text-sm font-bold px-4 py-2 rounded-full shadow-sm">
              {club.type || 'Local Program'}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-12">
              
              {/* Left Column: Details */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-4 uppercase tracking-wider">
                  {club.pillar} Pillar
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{club.name}</h1>
                <div className="flex items-center gap-2 text-indigo-600 font-medium mb-8">
                  <MapPin className="w-5 h-5" />
                  {school.name} ({school.city}, {school.state})
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About this club</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {club.description || `Join ${club.name} available to students at ${school.name}! This is a fantastic opportunity for students interested in ${club.pillar.toUpperCase()} to learn, grow, and connect with peers. Reach out to the organizer to secure your spot for the upcoming semester.`}
                </p>

                <div className="bg-indigo-50 rounded-2xl p-6 flex items-start gap-4 border border-indigo-100">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">Verified Provider</h4>
                    <p className="text-indigo-700 text-sm leading-relaxed">This club was scraped from public directories or listed by a verified local organizer.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: At a Glance Card */}
              <div className="w-full md:w-80 shrink-0">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
                  <h3 className="font-bold text-slate-900 text-lg mb-6">At a Glance</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <Clock className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Meeting Time</p>
                        <p className="font-bold text-slate-900">{club.meeting_time || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <Users className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Age Range</p>
                        <p className="font-bold text-slate-900">{club.age_range || 'All ages'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Current Members</p>
                        <p className="font-bold text-slate-900">{club.members_count || 0} Students</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <button className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <Mail className="w-5 h-5" /> Contact Organizer
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-3">Registration happens externally.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
