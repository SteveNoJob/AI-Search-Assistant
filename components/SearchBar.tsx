'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Suggestion from './Suggestion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showSuggestions && searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setSuggestionPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      try {
        const res = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: value }),
        });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const SuggestionPortal = () => {
    if (!mounted || !showSuggestions || suggestions.length === 0) return null;
    
    return createPortal(
      <div 
        className="fixed bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden z-[9999]"
        style={{
          top: suggestionPosition.top,
          left: suggestionPosition.left,
          width: suggestionPosition.width
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            text={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
          />
        ))}
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className="relative max-w-2xl mx-auto px-3 sm:px-4" ref={searchRef}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search products..."
                className="flex-1 bg-transparent px-3 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-lg text-gray-800 outline-none placeholder-gray-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-base whitespace-nowrap"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <SuggestionPortal />
    </>
  );
}