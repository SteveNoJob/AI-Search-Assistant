interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl text-gray-400">📦</div>
        )}
      </div>
      
      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
        {product.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-green-600">
          ${product.price.toFixed(2)}
        </span>
        
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
}