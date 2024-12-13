import React, { useState } from "react";
import { StarIcon, HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300"
          />
        </div>
        
        {/* Overlay with actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <HeartIcon className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-lg">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#4F46E5]">{product.category}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              index < product.rating ? (
                <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
              ) : (
                <StarIcon key={index} className="h-4 w-4 text-gray-300" />
              )
            ))}
            <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#4F46E5] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="space-y-1">
                <span className="text-sm text-gray-500 line-through">Rp {product.originalPrice.toLocaleString()}</span>
                <div className="text-lg font-bold text-gray-900">
                  Rp {(product.originalPrice * (1 - product.discount/100)).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-lg font-bold text-gray-900">
                Rp {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          <button className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors">
            Beli
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Bakpia Pathok Asli",
      category: "Makanan",
      description: "Bakpia original dengan isian kacang hijau pilihan",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Bakpia",
      originalPrice: 45000,
      discount: 10,
      rating: 4,
      reviews: 128,
    },
    {
      id: 2,
      name: "Gelang Etnik Dayak",
      category: "Aksesoris",
      description: "Gelang tangan dengan motif khas suku Dayak",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Gelang",
      originalPrice: 75000,
      rating: 5,
      reviews: 84,
    },
    {
      id: 3,
      name: "Gantungan Kunci Angklung",
      category: "Souvenir",
      description: "Miniatur angklung sebagai gantungan kunci",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Gantungan",
      originalPrice: 25000,
      discount: 15,
      rating: 4,
      reviews: 56,
    },
  ];

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produk Unggulan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai produk berkualitas dari pengrajin lokal terbaik. Dari makanan khas hingga kerajinan tangan tradisional.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Semua', 'Makanan', 'Aksesoris', 'Souvenir', 'Batik', 'Kerajinan'].map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-[#4F46E5] hover:text-white hover:border-transparent transition-all duration-300"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center space-x-2 bg-white text-[#4F46E5] font-medium px-8 py-3 rounded-lg border border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10">
            <span>Lihat Semua Produk</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
