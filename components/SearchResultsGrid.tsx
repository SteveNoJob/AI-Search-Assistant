import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface SearchResultsGridProps {
  results: Product[];
  loading: boolean;
}

export default function SearchResultsGrid({ results, loading }: SearchResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 animate-pulse">
            <div className="aspect-square bg-gray-300 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center mt-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Found {results.length} product{results.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}