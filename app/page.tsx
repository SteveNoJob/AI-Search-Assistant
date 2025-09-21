'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResultsGrid from '@/components/SearchResultsGrid';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(query: string) {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleHome() {
    setHasSearched(false);
    setResults([]);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center relative mb-2">
            {hasSearched && (
              <button
                onClick={handleHome}
                className="absolute left-0 bg-white/20 backdrop-blur-lg rounded-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                title="Back to Home"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Product Search
            </h1>
          </div>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Discover amazing products with intelligent search
          </p>
          
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative z-10">
        {!hasSearched ? (
          <>
            {/* Hero Section */}
            <div className="text-center mt-8 sm:mt-12 mb-12 sm:mb-16 animate-fade-in-up">
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">🛍️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 animate-fade-in-up animation-delay-200 px-4">
                Start Your Search Journey
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-400 px-4">
                Use our AI-powered search to find exactly what you&apos;re looking for.
                Try searching for fruits, electronics, or any product you need.
              </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-bounce-slow">🤖</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">AI-Powered</h3>
                <p className="text-gray-600 text-sm sm:text-base">Advanced AI algorithms understand your search intent and deliver precise results.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-800">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-pulse">⚡</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Lightning Fast</h3>
                <p className="text-gray-600 text-sm sm:text-base">Get instant search results with real-time suggestions as you type.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1000 sm:col-span-2 lg:col-span-1">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-spin-slow">🎯</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Smart Matching</h3>
                <p className="text-gray-600 text-sm sm:text-base">Fuzzy search technology finds products even with typos or partial matches.</p>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 mb-12 sm:mb-16 animate-fade-in-up animation-delay-1200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Popular Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { emoji: '🍎', name: 'Fruits', query: 'Fruits' },
                  { emoji: '💻', name: 'Electronics', query: 'Electronics' },
                  { emoji: '👕', name: 'Clothing', query: 'Clothing' },
                  { emoji: '📚', name: 'Books', query: 'book' },
                  { emoji: '🏠', name: 'Home', query: 'furniture' },
                  { emoji: '🎮', name: 'Gaming', query: 'gaming' },
                  { emoji: '🚗', name: 'Automotive', query: 'Automotive' },
                  { emoji: '💄', name: 'Beauty', query: 'Beauty' }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.query)}
                    className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center hover:bg-white/40 transition-all duration-300 hover:scale-105 animate-fade-in-up cursor-pointer"
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.emoji}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up animation-delay-1400">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-gray-600 text-sm sm:text-base">Products Available</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-600 text-sm sm:text-base">Search Accuracy</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{'<0.1s'}</div>
                <div className="text-gray-600 text-sm sm:text-base">Average Response Time</div>
              </div>
            </div>
          </>
        ) : (
          <SearchResultsGrid results={results} loading={loading} />
        )}
      </div>
    </main>
  );
}
