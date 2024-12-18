import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../components/context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  // State untuk data
  const [cartItems, setCartItems] = useState([]);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderNote, setOrderNote] = useState('');
  const [subTotal, setSubTotal] = useState(0);

  // Fetch data saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get selected items from localStorage
        const selectedItems = JSON.parse(localStorage.getItem('checkoutItems') || '[]');
        
        if (selectedItems.length === 0) {
          toast.error('Tidak ada produk yang dipilih untuk checkout', {
            duration: 2000,
            position: 'top-center',
          });
          navigate('/cart');
          return;
        }
        
        setCartItems(selectedItems);
        
        // Calculate initial total
        const subtotal = selectedItems.reduce((acc, item) => {
          return acc + (item.productId.price * item.quantity);
        }, 0);
        setSubTotal(subtotal);
        
        const [couriersResponse, paymentResponse] = await Promise.all([
          axios.get(`${apiUrl}/courier`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/user/payment`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCouriers(couriersResponse.data);
        setPaymentMethod(paymentResponse.data.paymentMethod);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        toast.error('Gagal memuat data checkout');
        navigate('/cart');
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, navigate, token, apiUrl]);

  // Kalkulasi total
  const courierCost = selectedCourier ? 
    couriers.find(c => c._id === selectedCourier)?.cost || 0 : 0;
  const discount = voucher ? 
    Math.min((voucher.discount / 100) * subTotal, subTotal) : 0;
  const total = subTotal + courierCost - discount;

  // Handle voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Masukkan kode voucher');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/voucher/${voucherCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.minPurchase > subTotal) {
        toast.error(`Minimum pembelian Rp${response.data.minPurchase.toLocaleString()} diperlukan`);
        return;
      }
      
      setVoucher(response.data);
      toast.success('Voucher berhasil diterapkan');
    } catch (error) {
      toast.error('Kode voucher tidak valid');
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedCourier) {
      toast.error('Silakan pilih kurir pengiriman');
      return;
    }

    if (!paymentMethod) {
      toast.error('Silakan tambahkan metode pembayaran terlebih dahulu');
      return;
    }

    try {
      const transactionData = {
        shopId: cartItems[0].productId.shopId,
        paymentId: paymentMethod._id,
        voucherId: voucher?._id,
        courierId: selectedCourier,
        products: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        totalPrice: total,
        note: orderNote
      };

      // Validasi data
      if (!transactionData.shopId || !transactionData.paymentId || !transactionData.courierId) {
        toast.error('Data transaksi tidak lengkap');
        return;
      }

      // Validasi saldo
      if (paymentMethod.credit < total) {
        toast.error('Saldo tidak mencukupi');
        return;
      }

      // Buat transaksi
      const response = await axios.post(
        `${apiUrl}/transaction`, 
        transactionData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        toast.success('Transaksi berhasil dibuat');
        
        // Clear cart
        await axios.delete(`${apiUrl}/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        navigate('/profile/transactions');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal membuat transaksi';
      toast.error(errorMessage);
      console.error('Checkout Error:', error);
    }
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsProductsExpanded(!isProductsExpanded)}
              >
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold">Produk yang Dibeli ({cartItems.length})</h2>
                  <span className="text-sm text-gray-500">
                    Total: Rp{subTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600">
                    {isProductsExpanded ? 'Sembunyikan' : 'Tampilkan'}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isProductsExpanded ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Product List */}
              {isProductsExpanded && (
                <div className="mt-4 divide-y">
                  {cartItems.map((item) => (
                    <div key={item._id} className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productId.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x Rp{item.productId.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Rp{(item.productId.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Metode Pengiriman</h2>
              <div className="space-y-3">
                {couriers.map((courier) => (
                  <label
                    key={courier._id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors
                      ${selectedCourier === courier._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="courier"
                        value={courier._id}
                        checked={selectedCourier === courier._id}
                        onChange={() => setSelectedCourier(courier._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{courier.name}</p>
                        <p className="text-sm text-gray-500">Estimasi 2-3 hari</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      Rp{courier.cost.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Metode Pembayaran</h2>
              {paymentMethod ? (
                <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{paymentMethod.type}</p>
                      <p className="text-sm text-gray-600">
                        Saldo: Rp{paymentMethod.credit.toLocaleString()}
                      </p>
                    </div>
                    {paymentMethod.credit < total && (
                      <span className="text-sm text-red-600 font-medium">
                        Saldo tidak mencukupi
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Anda belum memiliki metode pembayaran
                  </p>
                  <button
                    onClick={() => navigate('/profile/payment')}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Tambah Metode Pembayaran
                  </button>
                </div>
              )}
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Catatan Pesanan</h2>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>

              {/* Voucher */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Kode voucher"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Pakai
                  </button>
                </div>
                {voucher && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        Voucher {voucher.code} - {voucher.discount}% 
                      </span>
                      <button
                        onClick={() => setVoucher(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rp{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span>Rp{courierCost.toLocaleString()}</span>
                </div>
                {voucher && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Voucher</span>
                    <span>-Rp{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>Rp{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={!selectedCourier || !paymentMethod || paymentMethod?.credit < total}
                className={`w-full mt-6 py-3 rounded-lg text-white font-medium transition-colors
                  ${(!selectedCourier || !paymentMethod || paymentMethod?.credit < total)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {paymentMethod?.credit < total
                  ? 'Saldo Tidak Mencukupi'
                  : 'Bayar Sekarang'}
              </button>

              {/* Additional Info */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                Dengan melakukan pembayaran, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
