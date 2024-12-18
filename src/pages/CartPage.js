import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { AuthContext } from '../components/context/AuthContext';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const $apiUrl = process.env.REACT_APP_API_BASE_URL;

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, isLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const updateTimers = useRef({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [tempSelectedVouchers, setTempSelectedVouchers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: '' });

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
      toast.error(error.response?.data?.message || 'Failed to fetch cart', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
      setCartItems([]);
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
      toast.error('Jumlah minimum pesanan adalah 1', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
      return;
    }

    setLocalQuantities(prev => ({
      ...prev,
      [cartId]: newQuantity
    }));

    if (updateTimers.current[cartId]) {
      clearTimeout(updateTimers.current[cartId]);
    }

    updateTimers.current[cartId] = setTimeout(async () => {
      try {
        await axios.put(`${$apiUrl}/cart/update`,
          { cartId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Jumlah pesanan berhasil diperbarui', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#DCFCE7',
            color: '#16A34A',
            border: '1px solid #16A34A',
          },
        });
        fetchCart();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal memperbarui jumlah pesanan', {
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
          [cartId]: cartItems.find(item => item._id === cartId)?.quantity || 1
        }));
      }
    }, 1000);
  };

  const removeItem = async (cartId) => {
    const item = cartItems.find(item => item._id === cartId);
    setDeleteModal({ 
      show: true, 
      itemId: cartId, 
      itemName: item.productId.name 
    });
  };

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

  const availableVouchers = [
    {
      id: 1,
      code: "DISKON10",
      type: "discount",
      value: 10,
      description: "Diskon 10% untuk semua produk",
      minPurchase: 100000,
      maxDiscount: 50000,
      stackable: true,
      expiryDate: "2024-12-31",
      createdAt: "2024-12-01"
    },
    {
      id: 2,
      code: "CASHBACK20",
      type: "cashback",
      value: 20,
      description: "Cashback 20% untuk pembelian pertama",
      minPurchase: 150000,
      maxDiscount: 100000,
      stackable: false,
      expiryDate: "2024-12-25",
      createdAt: "2024-12-05"
    },
    {
      id: 3,
      code: "FREESHIP",
      type: "shipping",
      value: 30000,
      description: "Gratis ongkir hingga Rp 30.000",
      minPurchase: 50000,
      maxDiscount: 30000,
      stackable: true,
      expiryDate: "2024-12-20",
      createdAt: "2024-12-10"
    },
    {
      id: 4,
      code: "HEMAT25",
      type: "discount",
      value: 25,
      description: "Hemat 25% untuk makanan tradisional",
      minPurchase: 200000,
      maxDiscount: 75000,
      stackable: true,
      expiryDate: "2024-12-28",
      createdAt: "2024-12-03"
    },
    {
      id: 5,
      code: "CASHBACKPLUS",
      type: "cashback",
      value: 15,
      description: "Cashback 15% untuk pembayaran menggunakan e-wallet",
      minPurchase: 100000,
      maxDiscount: 50000,
      stackable: true,
      expiryDate: "2024-12-30",
      createdAt: "2024-12-07"
    },
    {
      id: 6,
      code: "ONGKIRHEMAT",
      type: "shipping",
      value: 20000,
      description: "Potongan ongkir Rp 20.000 untuk pengiriman ke Jawa",
      minPurchase: 75000,
      maxDiscount: 20000,
      stackable: true,
      expiryDate: "2024-12-22",
      createdAt: "2024-12-08"
    },
    {
      id: 7,
      code: "SPESIAL50",
      type: "discount",
      value: 50,
      description: "Diskon 50% untuk item pilihan (maks. Rp100.000)",
      minPurchase: 250000,
      maxDiscount: 100000,
      stackable: false,
      expiryDate: "2024-12-19",
      createdAt: "2024-12-02"
    },
    {
      id: 8,
      code: "CASHBACKVIP",
      type: "cashback",
      value: 30,
      description: "Cashback 30% khusus member VIP",
      minPurchase: 300000,
      maxDiscount: 150000,
      stackable: false,
      expiryDate: "2024-12-24",
      createdAt: "2024-12-04"
    },
    {
      id: 9,
      code: "FREESHIPPLUS",
      type: "shipping",
      value: 50000,
      description: "Gratis ongkir hingga Rp 50.000 untuk luar Jawa",
      minPurchase: 150000,
      maxDiscount: 50000,
      stackable: true,
      expiryDate: "2024-12-21",
      createdAt: "2024-12-06"
    },
    {
      id: 10,
      code: "WEEKEND30",
      type: "discount",
      value: 30,
      description: "Diskon 30% khusus weekend",
      minPurchase: 200000,
      maxDiscount: 80000,
      stackable: true,
      expiryDate: "2024-12-29",
      createdAt: "2024-12-09"
    }
  ];

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'discount', label: 'Diskon' },
    { id: 'cashback', label: 'Cashback' },
    { id: 'shipping', label: 'Pengiriman' }
  ];

  const filterVouchers = (vouchers) => {
    let filtered = [...vouchers];
    
    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(v => v.type === selectedTab);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.code.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      );
    }
    
    // Sort vouchers
    switch (sortBy) {
      case 'expiring':
        filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        break;
      case 'highest':
        filtered.sort((a, b) => b.value - a.value);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const handleApplyVoucher = (voucher) => {
    if (!voucher.stackable) {
      setTempSelectedVouchers([voucher]);
      return;
    }

    const hasNonStackableVoucher = tempSelectedVouchers.some(v => !v.stackable);
    if (hasNonStackableVoucher) {
      alert('Tidak bisa menambahkan voucher karena sudah ada voucher yang tidak bisa digabungkan');
      return;
    }

    const hasVoucherSameType = tempSelectedVouchers.some(v => v.type === voucher.type);
    if (hasVoucherSameType) {
      alert('Hanya bisa memilih satu voucher untuk setiap jenisnya');
      return;
    }

    setTempSelectedVouchers([...tempSelectedVouchers, voucher]);
  };

  const removeTempVoucher = (voucherId) => {
    setTempSelectedVouchers(tempSelectedVouchers.filter(v => v.id !== voucherId));
  };

  const removeVoucher = (voucherId) => {
    setSelectedVouchers(selectedVouchers.filter(v => v.id !== voucherId));
  };

  const handleConfirmVouchers = () => {
    setSelectedVouchers([...tempSelectedVouchers]);
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Pilih minimal satu produk untuk checkout', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
        },
      });
      return;
    }

    // Filter cart items based on selection
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
    
    // Save to localStorage for checkout page
    localStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));
    
    // Navigate to checkout
    navigate('/checkout');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <>
      <Toaster />
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hapus Produk</h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus <span className="font-medium text-gray-900">{deleteModal.itemName}</span> dari keranjang?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, itemId: null, itemName: '' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          .modal-content::-webkit-scrollbar {
            display: none;
          }
          .modal-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <Header />
      <div className="font-sans bg-gray-50 min-h-screen">
        {/* Breadcrumb Navigation */}
        <nav className="container mx-auto px-4">
          <ul className="flex list-none p-0 my-4">
            <li className="mr-4">
              <Link to="/" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">Home</Link>
            </li>
            <li className="mr-4 text-gray-500">&gt;</li>
            <li className="text-gray-500">Cart</li>
          </ul>
        </nav>
        {/* Header */}
        <header className="container mx-auto px-6 py-1 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                      className="mr-2"
                      aria-label="Select all items"
                    />
                    <span>Pilih Semua</span>
                  </div>
                  <div className="divide-y divide-purple-200">
                    {cartItems.map((item) => (
                      <div key={item._id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                            className="mt-2"
                            aria-label={`Select item ${item.productId.name}`}
                          />
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.productId.image || "https://via.placeholder.com/100"}
                              alt={item.productId.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item.productId.name}
                              </h3>
                              <p className="text-[#4F46E5] font-medium mt-1">
                                Rp{(item.productId.price * localQuantities[item._id]).toLocaleString('id-ID')},00
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-blue-600">
                                {item.productId.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </p>
                              <span className="text-gray-300">|</span>
                              <p className="text-sm text-gray-600">
                                Rp{item.productId.price.toLocaleString('id-ID')},00 / pcs
                              </p>
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <div className="flex items-center">
                                <button 
                                  className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg transition-colors ${
                                    localQuantities[item._id] <= 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleQuantityChange(item._id, Math.max(1, localQuantities[item._id] - 1))}
                                  disabled={localQuantities[item._id] <= 1}
                                >
                                  -
                                </button>
                                <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                  {localQuantities[item._id]}
                                </div>
                                <button 
                                  className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg transition-colors ${
                                    localQuantities[item._id] >= item.productId.stock ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleQuantityChange(item._id, Math.min(item.productId.stock, localQuantities[item._id] + 1))}
                                  disabled={localQuantities[item._id] >= item.productId.stock}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" 
                              onClick={() => removeItem(item._id)}
                              aria-label="Remove item"
                            >
                              <TrashIcon className="w-5 h-5 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Pengiriman Section */}
                <details className="border-b border-[#EFD1FF]">
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h2 className="text-[#4F46E5] font-semibold">Pengiriman</h2>
                    <svg 
                      className="w-4 h-4 transform transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 py-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Berat</span>
                        <span className="text-sm font-medium">1.2 kg</span>
                      </div>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                        <option value="" disabled selected>Pilih pengiriman</option>
                        <option value="regular">Regular (2-3 hari) - Rp18.000</option>
                        <option value="express">Express (1-2 hari) - Rp25.000</option>
                        <option value="same-day">Same Day (4-6 jam) - Rp35.000</option>
                      </select>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                          />
                          Asuransi pengiriman
                        </label>
                        <span className="text-sm font-medium">Rp5.000</span>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Kode Promo Section */}
                <details className="border-b border-[#EFD1FF]">
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h2 className="text-[#4F46E5] font-semibold">Kode Promo</h2>
                    <svg 
                      className="w-4 h-4 transform transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 py-4 space-y-4">
                    <form className="flex items-center space-x-2">
                      <div className="flex w-full">
                        <input
                          type="text"
                          placeholder="Masukkan kode promo"
                          className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-4 py-2 rounded-r-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          Terapkan
                        </button>
                      </div>
                    </form>

                    <div className="flex items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="px-3 text-sm text-gray-500">atau</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2 px-4 border-2 border-[#4F46E5] text-[#4F46E5] rounded-lg font-semibold hover:bg-[#4F46E5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Pilih Voucher ({selectedVouchers.length})
                    </button>

                    {selectedVouchers.length > 0 && (
                      <div className="space-y-2">
                        {selectedVouchers.map((voucher) => (
                          <div key={voucher.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{voucher.icon}</span>
                                <div>
                                  <span className="text-sm font-medium text-[#4F46E5]">{voucher.code}</span>
                                  <p className="text-xs text-gray-500">{voucher.description}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeVoucher(voucher.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modal Voucher */}
                  {isModalOpen && (
                    <>
                      <style>
                        {`
                          .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                          }
                          .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                          }
                        `}
                      </style>
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-11/12 max-w-2xl max-h-[85vh] flex flex-col">
                          {/* Header Modal */}
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">Pilih Voucher</h3>
                                <p className="text-sm text-gray-500 mt-1">Pilih voucher untuk mendapatkan diskon terbaik</p>
                              </div>
                              <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-y-auto hide-scrollbar">
                            <div className="p-6">
                              {/* Search and Sort */}
                              <div className="flex gap-2 mb-4">
                                <input
                                  type="text"
                                  placeholder="Cari voucher..."
                                  className="flex-1 px-3 py-2 border rounded-lg"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <select
                                  className="px-3 py-2 border rounded-lg"
                                  value={sortBy}
                                  onChange={(e) => setSortBy(e.target.value)}
                                >
                                  <option value="newest">Terbaru</option>
                                  <option value="expiring">Segera Berakhir</option>
                                  <option value="highest">Nilai Tertinggi</option>
                                </select>
                              </div>

                              {/* Tabs */}
                              <div className="flex space-x-2 border-b">
                                {tabs.map(tab => (
                                  <button
                                    key={tab.id}
                                    className={`px-4 py-2 font-medium transition-colors
                                      ${selectedTab === tab.id 
                                        ? 'text-blue-600 border-b-2 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setSelectedTab(tab.id)}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>

                              {/* Voucher yang dipilih */}
                              {tempSelectedVouchers.length > 0 && (
                                <div className="mb-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-gray-900">Voucher Dipilih</h4>
                                    <span className="text-sm text-purple-600">{tempSelectedVouchers.length} voucher</span>
                                  </div>
                                  <div className="space-y-2 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                                    {tempSelectedVouchers.map((voucher) => (
                                      <div 
                                        key={voucher.id} 
                                        className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-purple-100/50 hover:border-purple-200 transition-all"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
                                            ${voucher.icon === '🎁' ? 'bg-red-100' : 'bg-gray-100'}
                                          `}>
                                            {voucher.icon}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                              <span className={`font-medium ${voucher.icon === '🎁' ? 'text-red-600' : 'text-gray-900'}`}>
                                                {voucher.code}
                                              </span>
                                              <span className={`text-xs px-2 py-0.5 rounded-full
                                                ${voucher.type === 'discount' && 'bg-blue-100 text-blue-700'}
                                                ${voucher.type === 'shipping' && 'bg-green-100 text-green-700'}
                                                ${voucher.type === 'fixed' && 'bg-yellow-100 text-yellow-700'}
                                                ${voucher.type === 'bulk' && 'bg-purple-100 text-purple-700'}
                                                ${voucher.type === 'special' && 'bg-red-100 text-red-700'}
                                                ${voucher.type === 'cashback' && 'bg-orange-100 text-orange-700'}
                                              `}>
                                                {voucher.type === 'discount' && 'Diskon'}
                                                {voucher.type === 'shipping' && 'Ongkir'}
                                                {voucher.type === 'fixed' && 'Nominal'}
                                                {voucher.type === 'bulk' && 'Bulk'}
                                                {voucher.type === 'special' && 'Spesial'}
                                                {voucher.type === 'cashback' && 'Cashback'}
                                              </span>
                                              {!voucher.stackable && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                                  Tidak dapat digabung
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-500">{voucher.description}</p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeTempVoucher(voucher.id)}
                                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4 text-gray-400 hover:text-gray-600" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                          >
                                            <path 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              strokeWidth={2} 
                                              d="M6 18L18 6M6 6l12 12" 
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Daftar Voucher */}
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-gray-900">Voucher Tersedia</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span className="text-sm text-gray-500">Dapat digabung</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  {filterVouchers(availableVouchers).map((voucher) => {
                                    const isSelected = tempSelectedVouchers.some(v => v.id === voucher.id);
                                    const hasVoucherSameType = tempSelectedVouchers.some(v => v.type === voucher.type);
                                    const hasNonStackableVoucher = tempSelectedVouchers.some(v => !v.stackable);
                                    const isDisabled = (hasVoucherSameType && !isSelected) || 
                                                     (hasNonStackableVoucher && !isSelected) || 
                                                     (!voucher.stackable && tempSelectedVouchers.length > 0 && !isSelected);

                                    return (
                                      <div
                                        key={voucher.id}
                                        onClick={() => !isDisabled && handleApplyVoucher(voucher)}
                                        className={`relative p-4 rounded-xl transition-all cursor-pointer group
                                          ${isSelected 
                                            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-[#4F46E5]' 
                                            : isDisabled 
                                              ? 'bg-gray-50 opacity-60 cursor-not-allowed' 
                                              : 'bg-white hover:shadow-md border border-gray-200 hover:border-[#4F46E5]'
                                          }`}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                                            ${voucher.icon === '🎁' ? 'bg-red-100' : 'bg-gray-100'}
                                          `}>
                                            {voucher.icon}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                              <span className={`font-medium ${voucher.icon === '🎁' ? 'text-red-600' : 'text-gray-900'}`}>
                                                {voucher.code}
                                              </span>
                                              <span className={`text-xs px-2 py-0.5 rounded-full
                                                ${voucher.type === 'discount' && 'bg-blue-100 text-blue-700'}
                                                ${voucher.type === 'shipping' && 'bg-green-100 text-green-700'}
                                                ${voucher.type === 'fixed' && 'bg-yellow-100 text-yellow-700'}
                                                ${voucher.type === 'bulk' && 'bg-purple-100 text-purple-700'}
                                                ${voucher.type === 'special' && 'bg-red-100 text-red-700'}
                                                ${voucher.type === 'cashback' && 'bg-orange-100 text-orange-700'}
                                              `}>
                                                {voucher.type === 'discount' && 'Diskon'}
                                                {voucher.type === 'shipping' && 'Ongkir'}
                                                {voucher.type === 'fixed' && 'Nominal'}
                                                {voucher.type === 'bulk' && 'Bulk'}
                                                {voucher.type === 'special' && 'Spesial'}
                                                {voucher.type === 'cashback' && 'Cashback'}
                                              </span>
                                              {!voucher.stackable && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                                  Tidak dapat digabung
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-500">{voucher.description}</p>
                                          </div>
                                          {!isDisabled && (
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                              ${isSelected 
                                                ? 'bg-[#4F46E5] border-[#4F46E5]' 
                                                : 'border-gray-300 group-hover:border-[#4F46E5]'
                                              }`}
                                            >
                                              {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer Modal */}
                          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                              >
                                Batal
                              </button>
                              <button
                                onClick={handleConfirmVouchers}
                                disabled={tempSelectedVouchers.length === 0}
                                className="px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white rounded-lg hover:from-[#4338CA] hover:to-[#4F46E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <span>Terapkan Voucher</span>
                                {tempSelectedVouchers.length > 0 && (
                                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                                    {tempSelectedVouchers.length}
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </details>

                {/* Harga Section */}
                <details>
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h2 className="text-[#4F46E5] font-semibold">Harga</h2>
                    <svg 
                      className="w-4 h-4 transform transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Harga</span>
                        <span className="text-sm font-medium">Rp 0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Diskon</span>
                        <span className="text-sm font-medium text-green-600">- Rp 0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pengiriman</span>
                        <span className="text-sm font-medium">Rp 0</span>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Checkout Button */}
                <div className="p-4 space-y-2 border-t border-[#EFD1FF]">
                  <button 
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-2.5 rounded-xl ${
                      selectedItems.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90'
                    } text-white transition-opacity font-semibold`}
                  >
                    Checkout Sekarang
                  </button>
                  <Link 
                    to="/"
                    className="block w-full py-2.5 rounded-xl border border-gray-400 text-[#4F46E5] hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#7C3AED] hover:text-white transition-all font-semibold text-center"
                  >
                    Lanjut Belanja
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
