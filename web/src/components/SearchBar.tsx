"use client";

import { Search, MapPin, Building2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchSchoolsAndLocations } from "@/app/actions/search";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{schools: any[], locations: any[]}>({ schools: [], locations: [] });
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search trigger
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length >= 2) {
        const data = await searchSchoolsAndLocations(query.trim());
        setResults(data);
        setIsOpen(true);
      } else {
        setResults({ schools: [], locations: [] });
        setIsOpen(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Prioritize exact location matches if they type a city and hit Enter
    const queryLower = query.trim().toLowerCase();
    const exactLocation = results.locations.find(l => l.city.toLowerCase() === queryLower);
    
    if (exactLocation) {
      router.push(`/location/${exactLocation.slug}`);
    } else if (results.locations.length > 0) {
      router.push(`/location/${results.locations[0].slug}`);
    } else if (results.schools.length > 0) {
      router.push(`/school/${results.schools[0].slug}`);
    } else {
      const slug = query.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      router.push(`/location/${slug}`);
    }
    setIsOpen(false);
  };

  const hasResults = results.schools.length > 0 || results.locations.length > 0;

  return (
    <div ref={wrapperRef} className="max-w-2xl mx-auto relative group text-left">
      <form onSubmit={handleSearch} className="relative z-10">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (hasResults) setIsOpen(true); }}
          className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-full py-4 pl-14 pr-36 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all text-lg shadow-sm"
          placeholder="Type a city or school name (e.g. San Jose)..."
          required
          autoComplete="off"
        />
        <button type="submit" className="absolute inset-y-2 right-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center">
          Search
        </button>
      </form>

      {/* Auto-complete Dropdown */}
      {isOpen && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          <ul className="py-2">
            
            {/* Locations Section */}
            {results.locations.length > 0 && (
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Cities & Locations</div>
            )}
            {results.locations.map((loc, idx) => (
              <li key={`loc-${idx}`}>
                <button
                  type="button"
                  className="w-full text-left px-6 py-3 hover:bg-slate-50 flex flex-col transition-colors"
                  onClick={() => {
                    setQuery(loc.city);
                    setIsOpen(false);
                    router.push(`/location/${loc.slug}`);
                  }}
                >
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> {loc.city}
                  </span>
                  <span className="text-sm text-slate-500 ml-6">{loc.state}</span>
                </button>
              </li>
            ))}

            {/* Schools Section */}
            {results.schools.length > 0 && (
              <div className="px-4 py-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-4">Schools</div>
            )}
            {results.schools.map((school) => (
              <li key={`sch-${school.id}`}>
                <button
                  type="button"
                  className="w-full text-left px-6 py-3 hover:bg-slate-50 flex flex-col transition-colors"
                  onClick={() => {
                    setQuery(school.name);
                    setIsOpen(false);
                    router.push(`/school/${school.slug}`);
                  }}
                >
                  <span className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" /> {school.name}
                  </span>
                  <span className="text-sm text-slate-500 ml-6">{school.city}, {school.state}</span>
                </button>
              </li>
            ))}

          </ul>
        </div>
      )}
    </div>
  );
}
