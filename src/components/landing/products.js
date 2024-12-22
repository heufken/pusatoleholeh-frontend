import React, { useState } from "react";
import { StarIcon, HeartIcon, ShoppingCartIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Quick Action Buttons */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10`}>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <HeartIcon className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg">
            <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg shadow-lg">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-medium text-white bg-[#4F46E5] rounded-lg shadow-lg">
              New
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#4F46E5] bg-indigo-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              index < product.rating ? (
                <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
              ) : (
                <StarIcon key={index} className="h-4 w-4 text-gray-300" />
              )
            ))}
            <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#4F46E5] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-3">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">{product.location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 line-through">
                  Rp {product.originalPrice.toLocaleString()}
                </span>
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
          <button className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transform hover:scale-105 transition-all duration-300 shadow-lg">
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
      description: "Bakpia original dengan isian kacang hijau pilihan. Dibuat dengan bahan berkualitas dan resep tradisional.",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Bakpia",
      originalPrice: 45000,
      discount: 10,
      rating: 4,
      reviews: 128,
      location: "Yogyakarta",
      isNew: true
    },
    {
      id: 2,
      name: "Gelang Etnik Dayak",
      category: "Aksesoris",
      description: "Gelang tangan dengan motif khas suku Dayak. Terbuat dari material pilihan dengan ukiran tradisional.",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Gelang",
      originalPrice: 75000,
      rating: 5,
      reviews: 84,
      location: "Kalimantan Timur"
    },
    {
      id: 3,
      name: "Gantungan Kunci Angklung",
      category: "Souvenir",
      description: "Miniatur angklung sebagai gantungan kunci. Dibuat dengan detail yang halus dan finishing premium.",
      image: "https://dummyimage.com/600x400/ddd/000.png&text=Gantungan",
      originalPrice: 25000,
      discount: 15,
      rating: 4,
      reviews: 56,
      location: "Bandung",
      isNew: true
    },
  ];

  const categories = ['Semua', 'Makanan', 'Aksesoris', 'Souvenir', 'Batik', 'Kerajinan'];
  const [activeCategory, setActiveCategory] = useState('Semua');

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Produk Unggulan
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Koleksi Terbaik</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai produk berkualitas dari pengrajin lokal terbaik. Dari makanan khas hingga kerajinan tangan tradisional.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white text-gray-600 hover:bg-[#4F46E5] hover:text-white'
              }`}
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
          <button className="inline-flex items-center justify-center space-x-2 bg-white text-[#4F46E5] font-medium px-6 py-3 rounded-lg border border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10 group">
            <span>Lihat Semua Produk</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
