import React, { useState, useRef, useEffect } from "react";
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../hooks/useClickOutside';

const CartPage = () => {
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Piscok Lumer Banget",
      price: 200000,
      image: "https://via.placeholder.com/100",
      stock: "In Stock",
      size: "XL",
      color: "Coklat",
      quantity: 23,
      total: 4600000,
    },
    {
      id: 2,
      name: "Piscok Lumer Banget",
      price: 200000,
      image: "https://via.placeholder.com/100",
      stock: "In Stock",
      size: "XL",
      color: "Coklat",
      quantity: 23,
      total: 4600000,
    },
    {
      id: 3,
      name: "Piscok Lumer Banget",
      price: 200000,
      image: "https://via.placeholder.com/100",
      stock: "In Stock",
      size: "XL",
      color: "Coklat",
      quantity: 23,
      total: 4600000,
    },
  ]);

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [tempSelectedVouchers, setTempSelectedVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setTempSelectedVouchers(selectedVouchers);
        setShowVoucherModal(false);
      }
    };

    if (showVoucherModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVoucherModal, selectedVouchers]);

  const voucherList = [
    { 
      code: 'DISKON10', 
      desc: 'Potongan 10% maksimal Rp50.000', 
      type: 'Diskon', 
      value: 50000,
      canCombine: true 
    },
    { 
      code: 'GRATIS ONGKIR', 
      desc: 'Gratis ongkir maksimal Rp20.000', 
      type: 'Pengiriman', 
      value: 20000,
      canCombine: true 
    },
    { 
      code: 'SUPER DISKON', 
      desc: 'Potongan 25% maksimal Rp100.000', 
      type: 'Diskon', 
      value: 100000,
      canCombine: false 
    },
    { 
      code: 'CASHBACK10', 
      desc: 'Cashback 10% maksimal Rp50.000', 
      type: 'Cashback', 
      value: 50000,
      canCombine: true 
    },
    { 
      code: 'HEMAT', 
      desc: 'Potongan Rp25.000', 
      type: 'Diskon', 
      value: 25000,
      canCombine: true 
    },
    { 
      code: 'GRATIS KIRIM', 
      desc: 'Gratis ongkir maksimal Rp30.000', 
      type: 'Pengiriman', 
      value: 30000,
      canCombine: true 
    },
    { 
      code: 'MEGA DISKON', 
      desc: 'Potongan 50% maksimal Rp200.000', 
      type: 'Diskon', 
      value: 200000,
      canCombine: false 
    },
    { 
      code: 'EKSTRA CASHBACK', 
      desc: 'Cashback 40% maksimal Rp200.000', 
      type: 'Cashback', 
      value: 200000,
      canCombine: true 
    }
  ];

  const handleVoucherSelect = (voucher) => {
    if (tempSelectedVouchers.some(v => v.code === voucher.code)) {
      setTempSelectedVouchers(tempSelectedVouchers.filter(v => v.code !== voucher.code));
    } else {
      if (!voucher.canCombine) {
        setTempSelectedVouchers([voucher]);
      } else {
        setTempSelectedVouchers([...tempSelectedVouchers, voucher]);
      }
    }
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      const voucher = voucherList.find(v => v.code === voucherCode.trim());
      if (voucher) {
        setAppliedVoucher(voucher);
        setVoucherCode('');
      }
    }
  };

  const handleRemoveVoucher = (voucher) => {
    if (voucher === appliedVoucher) {
      setAppliedVoucher(null);
    } else {
      setSelectedVouchers(selectedVouchers.filter(v => v.code !== voucher.code));
    }
  };

  const isVoucherDisabled = (voucher) => {
    if (tempSelectedVouchers.length === 0) return false;
    if (voucher.canCombine) return false;
    return tempSelectedVouchers.some(v => !v.canCombine || v.code === voucher.code);
  };

  const getFilteredVouchers = () => {
    if (activeTab === 'Semua') return voucherList;
    return voucherList.filter(voucher => voucher.type === activeTab);
  };

  const checkVoucherCompatibility = (voucher, currentVouchers) => {
    // Jika voucher tidak bisa dikombinasikan
    if (!voucher.canCombine && currentVouchers.length > 0) {
      return {
        isValid: false,
        message: 'Voucher ini tidak dapat digabungkan dengan voucher lain'
      };
    }

    // Jika ada voucher yang tidak bisa dikombinasikan di currentVouchers
    if (currentVouchers.some(v => !v.canCombine)) {
      return {
        isValid: false,
        message: 'Sudah ada voucher yang tidak dapat digabungkan'
      };
    }

    // Cek voucher dengan tipe yang sama
    const sameTypeVoucher = currentVouchers.find(v => v.type === voucher.type);
    if (sameTypeVoucher) {
      return {
        isValid: false,
        message: `Hanya dapat menggunakan 1 voucher ${voucher.type.toLowerCase()}`
      };
    }

    return { isValid: true };
  };

  const handleApplyVouchers = () => {
    setSelectedVouchers(tempSelectedVouchers);
    setShowVoucherModal(false);
  };

  const handleCancelVouchers = () => {
    setTempSelectedVouchers(selectedVouchers);
  };

  const openVoucherModal = () => {
    setTempSelectedVouchers(selectedVouchers);
    setShowVoucherModal(true);
  };

  return (
    <>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Keranjang Belanja</h2>
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <button
                                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  aria-label="Add to wishlist"
                                >
                                  <HeartIcon className="w-5 h-5 text-gray-400" />
                                </button>
                                <button
                                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  aria-label="Remove item"
                                >
                                  <TrashIcon className="w-5 h-5 text-gray-400" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[#4F46E5] font-medium mt-1">
                              Rp {item.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-6 mt-4">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
                                >
                                  -
                                </button>
                                <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-gray-500 text-sm">
                                Stock: {item.stock}
                              </p>
                            </div>
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
                <div className="border-b border-[#EFD1FF]">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setIsShippingOpen(!isShippingOpen)}
                  >
                    <h2 className="text-[#4F46E5] font-semibold">Pengiriman</h2>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-300 ${isShippingOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isShippingOpen ? 'max-h-[180px]' : 'max-h-0'
                    } overflow-hidden`}
                  >
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
                  </div>
                </div>

                {/* Kode Promo Section */}
                <div className="border-b border-[#EFD1FF]">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setIsPromoOpen(!isPromoOpen)}
                  >
                    <h2 className="text-[#4F46E5] font-semibold">Kode Promo</h2>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-300 ${isPromoOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isPromoOpen ? 'max-h-[400px]' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="px-4 py-4 space-y-4">
                      {/* Selected Vouchers */}
                      {selectedVouchers.length > 0 && (
                        <div className="space-y-2">
                          {selectedVouchers.map((voucher, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div>
                                <p className="font-medium text-blue-700">{voucher.code}</p>
                                <p className="text-sm text-blue-600">{voucher.desc}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveVoucher(voucher)}
                                className="text-blue-700 hover:text-blue-800 p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Applied Voucher */}
                      {appliedVoucher && (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div>
                            <p className="font-medium text-green-700">{appliedVoucher.code}</p>
                            <p className="text-sm text-green-600">{appliedVoucher.desc}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveVoucher(appliedVoucher)}
                            className="text-green-700 hover:text-green-800 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Voucher Input */}
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder="Masukkan kode voucher"
                            className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                          />
                          <button
                            onClick={handleApplyVoucher}
                            disabled={!voucherCode.trim()}
                            className="absolute right-1 top-1 bottom-1 px-4 bg-[#4F46E5] text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4F46E5]/90 transition-colors"
                          >
                            Pakai
                          </button>
                        </div>

                        <button
                          onClick={() => setShowVoucherModal(true)}
                          className="w-full py-2.5 border border-[#4F46E5] text-[#4F46E5] rounded-lg font-medium hover:bg-[#4F46E5] hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="text-lg">🎫</span>
                          {selectedVouchers.length > 0 ? `${selectedVouchers.length} Voucher Dipilih` : 'Pilih Voucher'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Harga Section */}
                <div>
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                  >
                    <h2 className="text-[#4F46E5] font-semibold">Harga</h2>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isPriceOpen ? 'max-h-[120px]' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Harga ({cartItems.length} barang)</span>
                          <span className="text-sm font-medium">Rp {cartItems.reduce((acc, item) => acc + item.total, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Diskon</span>
                          <span className="text-sm font-medium text-green-600">- Rp {selectedVouchers.reduce((acc, voucher) => acc + voucher.value, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Pengiriman</span>
                          <span className="text-sm font-medium">Rp 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-4 space-y-2 border-t border-[#EFD1FF]">
                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:opacity-90 transition-opacity font-semibold">
                    Checkout Sekarang
                  </button>
                  <button className="w-full py-2.5 rounded-xl border border-gray-400 text-[#4F46E5] hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#7C3AED] hover:text-white transition-all font-semibold">
                    Lanjut Belanja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Voucher & Promo</h2>
                  <p className="text-gray-500 mt-1">Pilih voucher yang ingin digunakan</p>
                </div>
                <button 
                  onClick={() => {
                    setTempSelectedVouchers(selectedVouchers);
                    setShowVoucherModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Tabs */}
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {['Semua', 'Diskon', 'Pengiriman', 'Cashback'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab
                          ? 'bg-[#4F46E5] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voucher List */}
              <div className="p-6 space-y-3">
                {getFilteredVouchers().map((voucher, index) => (
                  <button
                    key={index}
                    className={`w-full p-4 border rounded-xl text-left transition-all ${
                      tempSelectedVouchers.some(v => v.code === voucher.code)
                        ? 'border-[#4F46E5] bg-[#4F46E5]/5 shadow-sm'
                        : isVoucherDisabled(voucher)
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-[#4F46E5] hover:shadow-sm'
                    }`}
                    onClick={() => !isVoucherDisabled(voucher) && handleVoucherSelect(voucher)}
                    disabled={isVoucherDisabled(voucher)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{voucher.code}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            voucher.type === 'Diskon' ? 'bg-blue-100 text-blue-700' :
                            voucher.type === 'Pengiriman' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {voucher.type}
                          </span>
                          {!voucher.canCombine && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                              Tidak dapat digabung
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">{voucher.desc}</p>
                      </div>
                      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                        {tempSelectedVouchers.some(v => v.code === voucher.code) ? (
                          <svg className="w-5 h-5 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border ${isVoucherDisabled(voucher) ? 'border-gray-300' : 'border-gray-400'}`} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTempSelectedVouchers(selectedVouchers);
                    setShowVoucherModal(false);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setSelectedVouchers(tempSelectedVouchers);
                    setShowVoucherModal(false);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Terapkan ({tempSelectedVouchers.length})
