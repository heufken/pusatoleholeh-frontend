import React, { useEffect, useState, useContext } from 'react';
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

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${apiUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(response.data.shopProductsX);
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
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Wishlist Saya</h1>
        
        {Object.entries(wishlistItems).length > 0 ? (
          Object.entries(wishlistItems).map(([shopUsername, products]) => (
            <div key={shopUsername} className="mb-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span>Toko: {shopUsername}</span>
                <button 
                  onClick={() => navigate(`/shop/${shopUsername}`)}
                  className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  Kunjungi Toko
                </button>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.productId} className="border rounded-lg p-4">
                    <img 
                      src={product.coverUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => navigate(`/product/${product.productId}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.productId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Wishlist Anda masih kosong</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
