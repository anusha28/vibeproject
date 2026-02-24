"use client";

import { useState } from "react";
import { Compass, ChevronLeft, CheckCircle2, Users, MapPin, BookOpen, User, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { submitClub } from "@/app/actions/addClub";

export default function AddClubPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitClub(formData);
    
    setIsPending(false);
    
    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success) {
      setIsSubmitted(true);
    }
  };

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
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-4 py-2 rounded-full transition-colors hover:bg-slate-200">
            <ChevronLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
            
            {isSubmitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Club Submitted!</h2>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  Thank you for adding to the community. Your club has been successfully added to the database and is now live in the directory.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors inline-block shadow-sm"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">List your club</h1>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Fill out the details below to add your after-school program, co-op, or club to the local directory.
                </p>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Club Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Club Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        required 
                        name="name"
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="e.g. Lincoln Robotics Team" 
                      />
                    </div>
                  </div>

                  {/* Organizer */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Organizer Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        required 
                        name="organizer"
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="e.g. Jane Doe or STEM Kids Inc." 
                      />
                    </div>
                  </div>

                  {/* Location / School */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Location or School</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        required 
                        name="location"
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-400" 
                        placeholder="e.g. Washington High School or San Jose" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pillar */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Category</label>
                      <select name="pillar" required defaultValue="" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select pillar...</option>
                        <option value="stem">STEM & Tech</option>
                        <option value="art">Creative Arts</option>
                        <option value="drama">Drama & Theater</option>
                        <option value="sport">Sports & Athletics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Capacity</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                          required 
                          name="capacity"
                          type="number" 
                          min="1" 
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-400" 
                          placeholder="e.g. 20" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Details about the club</label>
                    <textarea 
                      required 
                      name="description"
                      rows={4} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none placeholder:text-slate-400" 
                      placeholder="What will students learn? When do you meet?"
                    ></textarea>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                      {isPending ? "Submitting..." : "Submit Club"}
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-4">
                      By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </form>
              </>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
