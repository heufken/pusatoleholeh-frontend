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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded mr-3"></div>
          <h1 className="text-3xl font-bold text-gray-800">Wishlist Saya</h1>
        </div>
        
        {Object.entries(wishlistItems).length > 0 ? (
          Object.entries(wishlistItems).map(([shopUsername, products]) => (
            <div 
              key={shopUsername} 
              className="mb-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{shopUsername.charAt(0).toUpperCase()}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {shopUsername}
                  </h2>
                </div>
                <button 
                  onClick={() => navigate(`/shop/${shopUsername}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <span>Kunjungi Toko</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.productId} 
                    className="group relative bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 rounded-t-xl">
                      <img 
                        src={product.coverUrl} 
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-4">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => navigate(`/product/${product.productId}`)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span>Detail</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.productId)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 mb-6">Wishlist Anda masih kosong</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg"
            >
              Mulai Belanja
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
