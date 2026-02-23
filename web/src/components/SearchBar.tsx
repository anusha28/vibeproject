"use client";

import { Search, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchSchools } from "@/app/actions/search";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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
        const data = await searchSchools(query.trim());
        setResults(data);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    // Wait 300ms after the user stops typing before fetching to save database calls
    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // If they hit Enter, route to the first result if available, otherwise generate a basic slug
    if (results.length > 0) {
      router.push(`/school/${results[0].slug}`);
    } else {
      const slug = query.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      router.push(`/school/${slug}`);
    }
    setIsOpen(false);
  };

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
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-full py-4 pl-14 pr-36 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all text-lg shadow-sm"
          placeholder="Type a school name (e.g. Lincoln)..."
          required
          autoComplete="off"
        />
        <button type="submit" className="absolute inset-y-2 right-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center">
          Search
        </button>
      </form>

      {/* Auto-complete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <ul className="py-2">
            {results.map((school) => (
              <li key={school.id}>
                <button
                  type="button"
                  className="w-full text-left px-6 py-3 hover:bg-slate-50 flex flex-col transition-colors"
                  onClick={() => {
                    setQuery(school.name);
                    setIsOpen(false);
                    router.push(`/school/${school.slug}`);
                  }}
                >
                  <span className="font-semibold text-slate-900">{school.name}</span>
                  <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {school.city}, {school.state}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
