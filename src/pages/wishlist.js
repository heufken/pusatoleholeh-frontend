import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState({});
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const normalizeUrl = useCallback((url) => {
    if (!url) return null;
    const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;
    
    try {
      const urlObj = new URL(url.replace(/\\/g, "/"));
      const pathname = urlObj.pathname;
      return new URL(pathname, cdnUrl).toString();
    } catch (e) {
      const cleanPath = url
        .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '')
        .replace(/\\/g, "/")
        .replace(/^\/+/, '/');
      return `${cdnUrl}${cleanPath}`;
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${apiUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Normalize cover URLs in wishlist items
      const normalizedWishlist = Object.entries(response.data.shopProductsX)
        .reduce((acc, [shopUsername, products]) => {
          acc[shopUsername] = products.map(product => ({
            ...product,
            coverUrl: normalizeUrl(product.coverUrl)
          }));
          return acc;
        }, {});

      setWishlistItems(normalizedWishlist);
    } catch (error) {
      toast.error('Gagal memuat wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${apiUrl}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produk dihapus dari wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Gagal menghapus dari wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="py-4">
          <div className="p-6">
            {/* Page Header */}
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1.5 mb-3 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
                Koleksi Favorit Anda
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Wishlist Saya</h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Simpan produk favorit Anda dan dapatkan notifikasi ketika ada promo menarik
              </p>
            </div>

            {Object.entries(wishlistItems).length > 0 ? (
              Object.entries(wishlistItems).map(([shopUsername, products]) => (
                <div 
                  key={shopUsername} 
                  className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Shop Header */}
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                          <span className="text-xl font-medium text-white">{shopUsername.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-medium text-gray-900">{shopUsername}</h2>
                          <p className="text-sm text-gray-500">Toko Partner</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/shop/${shopUsername}`)}
                        className="inline-flex items-center px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-lg shadow-lg shadow-black/5 hover:bg-[#4F46E5]/90 transition-all duration-300"
                      >
                        <span>Kunjungi Toko</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <div 
                          key={product.productId}
                          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 relative group"
                        >
                          {/* Product Image */}
                          <div className="relative">
                            <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                              <img 
                                src={product.coverUrl} 
                                alt={product.name}
                                className="w-full h-64 object-cover object-center transform scale-105 transition-transform duration-[2000ms] group-hover:scale-100"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-[#4F46E5] mb-4">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                            <div className="flex space-x-4">
                              <button
                                onClick={() => navigate(`/product/${product.productId}`)}
                                className="flex-1 inline-flex items-center justify-center px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-lg shadow-lg shadow-black/5 hover:bg-[#4F46E5]/90 transition-all duration-300"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => removeFromWishlist(product.productId)}
                                className="flex-1 px-8 py-3 bg-transparent border-2 border-[#4F46E5] text-[#4F46E5] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist Anda masih kosong</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Jelajahi koleksi kami dan simpan produk favorit Anda
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-lg shadow-lg shadow-black/5 hover:bg-[#4F46E5]/90 transition-all duration-300"
                >
                  Mulai Berbelanja
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
