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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Product Search
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Discover amazing products with intelligent search
          </p>
          
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {!hasSearched ? (
          <>
            {/* Hero Section */}
            <div className="text-center mt-12 mb-16 animate-fade-in-up">
              <div className="text-8xl mb-6 animate-bounce-slow">🛍️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up animation-delay-200">
                Start Your Search Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                Use our AI-powered search to find exactly what you're looking for.
                Try searching for fruits, electronics, or any product you need.
              </p>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600">
                <div className="text-5xl mb-4 animate-bounce-slow">🤖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered</h3>
                <p className="text-gray-600">Advanced AI algorithms understand your search intent and deliver precise results.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-800">
                <div className="text-5xl mb-4 animate-pulse">⚡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
                <p className="text-gray-600">Get instant search results with real-time suggestions as you type.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1000">
                <div className="text-5xl mb-4 animate-spin-slow">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Matching</h3>
                <p className="text-gray-600">Fuzzy search technology finds products even with typos or partial matches.</p>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 mb-16 animate-fade-in-up animation-delay-1200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { emoji: '🍎', name: 'Fruits', query: 'apple' },
                  { emoji: '💻', name: 'Electronics', query: 'laptop' },
                  { emoji: '👕', name: 'Clothing', query: 'shirt' },
                  { emoji: '📚', name: 'Books', query: 'book' },
                  { emoji: '🏠', name: 'Home', query: 'furniture' },
                  { emoji: '🎮', name: 'Gaming', query: 'game' },
                  { emoji: '🚗', name: 'Automotive', query: 'car' },
                  { emoji: '💄', name: 'Beauty', query: 'cosmetics' }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.query)}
                    className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/40 transition-all duration-300 hover:scale-105 animate-fade-in-up cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-1400">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-gray-600">Products Available</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-600">Search Accuracy</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 text-center hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">&lt;0.1s</div>
                <div className="text-gray-600">Average Response Time</div>
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
