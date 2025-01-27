import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { AuthContext } from '../components/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ThreeDots } from "react-loader-spinner";

const $apiUrl = process.env.REACT_APP_API_BASE_URL;
const $cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const updateTimers = useRef({});
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: '' });
  const [loading, setLoading] = useState(false);
  const [batchDeleteModal, setBatchDeleteModal] = useState({ show: false, count: 0 });

  // Group cart items by shop
  const groupedCartItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const shopId = item.productId.shopId._id;
      if (!acc[shopId]) {
        acc[shopId] = {
          shopId: shopId,
          shopName: item.productId.shopId.name,
          items: []
        };
      }
      acc[shopId].items.push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
      try {
        // Buat URL object untuk parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
        
        // Ambil pathname dari URL (bagian setelah host)
        const pathname = urlObj.pathname;
        
        // Gabungkan dengan CDN URL
        return new URL(pathname, $cdnUrl).toString();
      } catch (e) {
        // Jika URL invalid, coba cara alternatif
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Hapus protocol dan host (perbaikan escape character)
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Pastikan hanya ada satu leading slash

        return `${$cdnUrl}${cleanPath}`;
      }
    },
    []
  );

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${$apiUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(Array.isArray(response.data) ? response.data : []);
      
      // Initialize selected items
      const itemIds = response.data.map(item => item._id);
      setSelectedItems(itemIds);
      
      // Initialize local quantities
      const quantities = {};
      response.data.forEach(item => {
        quantities[item._id] = item.quantity;
      });
      setLocalQuantities(quantities);
    } catch (error) {
      setCartItems([]); // Set empty array instead of showing error
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    const item = cartItems.find(item => item._id === cartId);
    
    if (newQuantity > item.productId.stock) {
      toast.error(`Stok tidak mencukupi. Stok tersedia: ${item.productId.stock}`, {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
      setLocalQuantities(prev => ({
        ...prev,
        [cartId]: item.productId.stock
      }));
      return;
    }

    if (newQuantity <= 1 && localQuantities[cartId] <= 1) {
      toast.error('Jumlah minimum pesanan adalah 1');
      return;
    }

    // Update local state immediately
    setLocalQuantities(prev => ({
      ...prev,
      [cartId]: newQuantity
    }));

    // Clear existing timer
    if (updateTimers.current[cartId]) {
      clearTimeout(updateTimers.current[cartId]);
    }

    // Set new timer for API call
    updateTimers.current[cartId] = setTimeout(async () => {
      try {
        await axios.put(`${$apiUrl}/cart/update`,
          { cartId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Jumlah pesanan berhasil diperbarui');
        fetchCart();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal memperbarui jumlah pesanan');
        setLocalQuantities(prev => ({
          ...prev,
          [cartId]: cartItems.find(item => item._id === cartId)?.quantity || 1
        }));
      }
    }, 1000);
  };

  // Cleanup timers
  useEffect(() => {
    const currentTimers = updateTimers.current;
    return () => {
      Object.values(currentTimers).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${$apiUrl}/cart/remove/${deleteModal.itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produk berhasil dihapus dari keranjang', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
          fontWeight: '500'
        },
        icon: '🗑️'
      });
      setDeleteModal({ show: false, itemId: null, itemName: '' });
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus produk dari keranjang', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleBatchDelete = async () => {
    try {
      setLoading(true);

      // Jika semua item dipilih, gunakan endpoint clear
      if (selectedItems.length === cartItems.length) {
        await axios.delete(`${$apiUrl}/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Jika hanya beberapa item, hapus satu per satu
        await Promise.all(
          selectedItems.map(cartId =>
            axios.delete(`${$apiUrl}/cart/remove/${cartId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          )
        );
      }

      toast.success(`${selectedItems.length} produk berhasil dihapus dari keranjang`, {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
          fontWeight: '500'
        },
        icon: '🗑️'
      });

      setBatchDeleteModal({ show: false, count: 0 });
      setSelectedItems([]);
      fetchCart();
    } catch (error) {
      toast.error('Gagal menghapus produk dari keranjang');
      console.error('Batch delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    // Hitung subtotal dari item yang dipilih
    const subtotal = cartItems
      .filter(item => selectedItems.includes(item._id))
      .reduce((acc, item) => acc + (item.productId.price * localQuantities[item._id]), 0);

    return {
      subtotal,
      total: subtotal
    };
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Pilih minimal satu produk untuk checkout');
      return;
    }

    try {
      // Group selected items by shop
      const selectedProducts = cartItems.filter(item => selectedItems.includes(item._id));
      const groupedByShop = selectedProducts.reduce((acc, item) => {
        const shopId = item.productId.shopId._id;
        if (!acc[shopId]) {
          acc[shopId] = {
            shopId: shopId,
            shopName: item.productId.shopId.name,
            products: []
          };
        }
        
        acc[shopId].products.push({
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          image: normalizeUrl(item.productCover),
          stock: item.productId.stock
        });
        
        return acc;
      }, {});

      // Convert to array format expected by checkout
      const checkoutData = {
        shops: Object.values(groupedByShop)
      };

      localStorage.setItem('checkoutItems', JSON.stringify(checkoutData));
      navigate('/checkout');
    } catch (error) {
      console.error('Error preparing checkout data:', error);
      toast.error('Gagal mempersiapkan data checkout');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <ThreeDots color="#4F46E5" height={50} width={50} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Produk</h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus <span className="font-medium text-gray-900">{deleteModal.itemName}</span> dari keranjang?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] border border-transparent rounded-lg hover:from-[#4338CA] hover:to-[#3730A3] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Batch Delete Confirmation Modal */}
      {batchDeleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Produk</h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus {batchDeleteModal.count} produk yang dipilih dari keranjang?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setBatchDeleteModal({ show: false, count: 0 })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] border border-transparent rounded-lg hover:from-[#4338CA] hover:to-[#3730A3] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ThreeDots
                        height="20"
                        width="20"
                        radius="9"
                        color="#ffffff"
                        ariaLabel="loading"
                        className="mr-2"
                      />
                      Menghapus...
                    </>
                  ) : (
                    'Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          <div className="mb-4 sm:mb-8">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-2 sm:mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
              Keranjang Belanja
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Keranjang Anda</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">Kelola produk yang Anda pilih sebelum melanjutkan ke pembayaran.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <ThreeDots
                height="50"
                width="50"
                radius="9"
                color="#4F46E5"
                ariaLabel="loading"
              />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
              <div className="w-48 h-48 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-[#4F46E5]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#4F46E5] mb-4">
                Keranjang Belanja Kosong
              </h2>
              <p className="text-gray-600 mb-6">
                Anda belum menambahkan produk apapun ke keranjang.
              </p>
              <Link 
                to="/" 
                className="inline-block bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-lg hover:from-[#4338CA] hover:to-[#3730A3] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="flex-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === cartItems.length}
                          onChange={handleSelectAll}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                          aria-label="Select all items"
                        />
                        <span className="text-base sm:text-lg font-medium text-gray-900">Pilih Semua</span>
                      </div>
                      {selectedItems.length > 0 && (
                        <button
                          onClick={() => setBatchDeleteModal({ show: true, count: selectedItems.length })}
                          className="inline-flex items-center px-2 sm:px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                          <span className="text-sm sm:text-base font-medium">Hapus ({selectedItems.length})</span>
                        </button>
                      )}
                    </div>

                    {/* Shop Groups */}
                    {Object.values(groupedCartItems).map((shop) => (
                      <div key={shop.shopId} className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{shop.shopName}</h3>
                        </div>
                        
                        {/* Shop Items */}
                        <div className="space-y-3 sm:space-y-4">
                          {shop.items.map((item) => (
                            <div key={item._id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#4F46E5]/20">
                              <div className="flex items-center h-full">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item._id)}
                                  onChange={() => handleSelectItem(item._id)}
                                  className="h-5 w-5 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] transition-colors cursor-pointer"
                                />
                              </div>
                              <div 
                                className="relative flex-shrink-0 w-24 sm:w-28 h-24 sm:h-28 rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => handleProductClick(item.productId._id)}
                              >
                                <img
                                  src={normalizeUrl(item.productCover)}
                                  alt={item.productId.name}
                                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col h-full justify-between gap-2 sm:gap-0">
                                  <div>
                                    <h4 
                                      className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 hover:text-[#4F46E5] transition-colors cursor-pointer line-clamp-2"
                                      onClick={() => handleProductClick(item.productId._id)}
                                    >
                                      {item.productId.name}
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-4">
                                      Rp{item.productId.price.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                      <button
                                        onClick={() => handleQuantityChange(item._id, localQuantities[item._id] - 1)}
                                        className="w-10 sm:w-8 h-10 sm:h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:border-[#4F46E5]/30 active:bg-gray-100 transition-all duration-200"
                                      >
                                        <span className="text-gray-600">-</span>
                                      </button>
                                      <input
                                        type="text"
                                        value={localQuantities[item._id]}
                                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                        className="w-14 h-10 sm:h-8 text-center border border-gray-200 rounded-md bg-white focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
                                        min="1"
                                        max={item.productId.stock}
                                      />
                                      <button
                                        onClick={() => handleQuantityChange(item._id, localQuantities[item._id] + 1)}
                                        className="w-10 sm:w-8 h-10 sm:h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:border-[#4F46E5]/30 active:bg-gray-100 transition-all duration-200"
                                      >
                                        <span className="text-gray-600">+</span>
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                                      <span className="text-lg sm:text-xl font-semibold text-[#4F46E5] whitespace-nowrap order-1 sm:order-none">
                                        Rp{(item.productId.price * localQuantities[item._id]).toLocaleString()}
                                      </span>
                                      <button
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none rounded-full hover:bg-red-50"
                                        onClick={() => setDeleteModal({ show: true, itemId: item._id, itemName: item.productId.name })}
                                        title="Hapus item"
                                      >
                                        <TrashIcon className="h-5 w-5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:w-96">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-24 hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Belanja</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Harga ({selectedItems.length} barang)</span>
                      <span>Rp {calculateTotals().subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-[#4F46E5]">Rp {calculateTotals().total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 ${
                      selectedItems.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#3730A3] shadow-lg hover:shadow-indigo-500/30'
                    }`}
                  >
                    Checkout
                  </button>
                  <div className="mt-3 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[2px]">
                    <Link 
                      to="/"
                      className="block w-full py-3 px-6 rounded-lg bg-white text-[#4F46E5] hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#7C3AED] hover:text-white transition-all duration-300 text-center font-medium"
                    >
                      Lanjut Belanja
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
