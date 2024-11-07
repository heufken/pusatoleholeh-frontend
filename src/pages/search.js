import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../components/landing/nav'; // Pastikan path-nya benar

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const searchType = new URLSearchParams(location.search).get('st') || 'product';

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk fetch data produk
  const fetchProducts = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk fetch data toko
  const fetchShops = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/shops?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efek untuk mengeksekusi pencarian berdasarkan tipe (produk atau toko)
  useEffect(() => {
    if (searchType === 'shop') {
      fetchShops(query);
    } else {
      fetchProducts(query);
    }
  }, [query, searchType]);

  // Handler untuk mengubah tipe pencarian
  const handleSearchTypeChange = (type) => {
    navigate(`/search?st=${type}&q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* Memasukkan komponen Nav */}
      <Nav />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Hasil Pencarian untuk "{query}"</h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleSearchTypeChange('product')}
            className={`px-6 py-2 rounded-l-lg text-sm font-semibold transition-colors duration-200 border ${
              searchType === 'product' ? 'bg-custom-red text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => handleSearchTypeChange('shop')}
            className={`px-6 py-2 rounded-r-lg text-sm font-semibold transition-colors duration-200 border ${
              searchType === 'shop' ? 'bg-custom-red text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Toko
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
            <span className="ml-4 text-lg font-medium text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="border p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">{result.name}</h3>
                  <p className="text-gray-600">{result.description}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-lg col-span-full">Tidak ada hasil ditemukan.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
