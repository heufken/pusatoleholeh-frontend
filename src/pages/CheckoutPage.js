import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../components/context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  // State declarations
  const [checkoutData, setCheckoutData] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [selectedCouriers, setSelectedCouriers] = useState({});
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderNotes, setOrderNotes] = useState({});
  const [subTotals, setSubTotals] = useState({});
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Kalkulasi total dengan ongkir
  const calculateTotal = useCallback(() => {
    if (!checkoutData) return 0;
    
    let totalWithShipping = 0;
    
    checkoutData.shops.forEach(shop => {
      // Add products subtotal
      const shopSubtotal = shop.products.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0);
      totalWithShipping += shopSubtotal;
      
      // Add shipping cost if courier is selected
      const courierId = selectedCouriers[shop.shopId];
      if (courierId) {
        const courier = couriers.find(c => c._id === courierId);
        if (courier) {
          totalWithShipping += courier.cost;
        }
      }
    });

    // Apply voucher discount if any
    if (voucher) {
      const discount = Math.min(
        (voucher.discount / 100) * totalWithShipping, 
        voucher.maxDiscount || Infinity
      );
      totalWithShipping -= discount;
    }

    return totalWithShipping;
  }, [checkoutData, selectedCouriers, couriers, voucher]);

  const handleCheckout = async () => {
    const allShopsHaveCourier = checkoutData?.shops.every(
      shop => selectedCouriers[shop.shopId]
    );

    if (!allShopsHaveCourier || !selectedPaymentId || !selectedAddressId) {
      toast.error('Pilih kurir untuk setiap toko, metode pembayaran, dan alamat pengiriman');
      return;
    }

    try {
      const transactionData = {
        shops: checkoutData.shops.map(shop => ({
          shopId: shop.shopId,
          products: shop.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity
          })),
          courierId: selectedCouriers[shop.shopId],
          note: orderNotes[shop.shopId] || ''
        })),
        paymentId: selectedPaymentId,
        voucherId: voucher?._id || '',
        addressId: selectedAddressId
      };

      // Create transaction
      await axios.post(
        `${apiUrl}/transaction`,
        transactionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart and localStorage
      await axios.delete(`${apiUrl}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('checkoutItems');
      toast.success('Transaksi berhasil dibuat');
      navigate('/transaction');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal membuat transaksi';
      toast.error(errorMessage);
      console.error('Checkout Error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get checkout data from localStorage
        const savedData = JSON.parse(localStorage.getItem('checkoutItems'));
        if (!savedData || !savedData.shops || savedData.shops.length === 0) {
          toast.error('Tidak ada produk yang dipilih untuk checkout');
          navigate('/cart');
          return;
        }
        
        setCheckoutData(savedData);
        
        // Initialize orderNotes and selectedCouriers for each shop
        const initialNotes = {};
        const initialCouriers = {};
        savedData.shops.forEach(shop => {
          initialNotes[shop.shopId] = '';
          initialCouriers[shop.shopId] = '';
        });
        setOrderNotes(initialNotes);
        setSelectedCouriers(initialCouriers);
        
        // Calculate initial totals per shop
        const totals = savedData.shops.reduce((acc, shop) => {
          const shopTotal = shop.products.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);
          acc[shop.shopId] = shopTotal;
          return acc;
        }, {});
        setSubTotals(totals);
        
        // Fetch other necessary data
        const [couriersResponse, paymentResponse] = await Promise.all([
          axios.get(`${apiUrl}/courier`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/user/payment`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCouriers(couriersResponse.data);
        setPaymentMethod(paymentResponse.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data checkout');
        navigate('/cart');
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, navigate, token, apiUrl]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/payment`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Mengakses array paymentMethods dari response
        const methods = response.data.paymentMethods;
        if (methods && Array.isArray(methods)) {
          setPaymentMethods(methods);
          // Set first payment method as default if available
          if (methods.length > 0) {
            setSelectedPaymentId(methods[0]._id);
            setPaymentMethod(methods[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Gagal memuat metode pembayaran');
      }
    };

    if (isAuthenticated) {
      fetchPaymentMethods();
    }
  }, [isAuthenticated, token, apiUrl]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.address && Array.isArray(response.data.address)) {
          setAddresses(response.data.address);
          // Set first address as default if available
          if (response.data.address.length > 0) {
            setSelectedAddressId(response.data.address[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Gagal memuat alamat pengiriman');
      }
    };

    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, token, apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <ThreeDots color="#4F46E5" height={50} width={50} />
        </div>
        <Footer />
      </div>
    );
  }

  const renderPaymentMethods = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Metode Pembayaran</h2>
      {paymentMethods.length > 0 ? (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method._id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${selectedPaymentId === method._id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value={method._id}
                  checked={selectedPaymentId === method._id}
                  onChange={() => {
                    setSelectedPaymentId(method._id);
                    setPaymentMethod(method);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-600">
                    Saldo: Rp{method.credit?.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedPaymentId === method._id && method.credit < calculateTotal() && (
                <span className="text-sm text-red-600 font-medium">
                  Saldo tidak mencukupi
                </span>
              )}
            </label>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Anda belum memiliki metode pembayaran
          </p>
          <button
            onClick={() => navigate('/user/payment')}
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Tambah Metode Pembayaran
          </button>
        </div>
      )}
    </div>
  );

  const renderAddressSelection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Alamat Pengiriman</h2>
      {addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address._id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${selectedAddressId === address._id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="address"
                  value={address._id}
                  checked={selectedAddressId === address._id}
                  onChange={() => setSelectedAddressId(address._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-600">
                    {address.subdistrict}, {address.district}, {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Anda belum memiliki alamat pengiriman
          </p>
          <button
            onClick={() => navigate('/user/address')}
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Tambah Alamat
          </button>
        </div>
      )}
    </div>
  );

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
            {/* Address Selection */}
            {renderAddressSelection()}
            
            {checkoutData?.shops.map((shop) => (
              <div key={shop.shopId} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{shop.shopName}</h2>
                  <span className="text-sm text-gray-500">
                    Subtotal: Rp{subTotals[shop.shopId]?.toLocaleString()}
                  </span>
                </div>

                {/* Products */}
                <div className="divide-y">
                  {shop.products.map((product) => (
                    <div key={product.productId} className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.quantity} x Rp{product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Rp{(product.price * product.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courier selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Metode Pengiriman</h3>
                  <div className="space-y-3">
                    {couriers.map((courier) => (
                      <label
                        key={courier._id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors
                          ${selectedCouriers[shop.shopId] === courier._id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-200'}`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name={`courier-${shop.shopId}`}
                            value={courier._id}
                            checked={selectedCouriers[shop.shopId] === courier._id}
                            onChange={(e) => setSelectedCouriers(prev => ({
                              ...prev,
                              [shop.shopId]: e.target.value
                            }))}
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

                {/* Order notes */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Catatan Pesanan</h3>
                  <textarea
                    value={orderNotes[shop.shopId] || ''}
                    onChange={(e) => setOrderNotes(prev => ({
                      ...prev,
                      [shop.shopId]: e.target.value
                    }))}
                    placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}

            {/* Payment Method */}
            {renderPaymentMethods()}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>

              {/* Price Details */}
              <div className="space-y-3">
                {checkoutData?.shops.map((shop) => (
                  <div key={shop.shopId}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal {shop.shopName}</span>
                      <span>Rp{subTotals[shop.shopId]?.toLocaleString()}</span>
                    </div>
                    {selectedCouriers[shop.shopId] && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ongkir</span>
                        <span>
                          Rp{couriers.find(c => c._id === selectedCouriers[shop.shopId])?.cost.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {voucher && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon Voucher</span>
                    <span>-Rp{((voucher.discount / 100) * calculateTotal()).toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>Rp{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={!checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]) || 
                         !selectedPaymentId || 
                         (selectedPaymentId && paymentMethod?.credit < calculateTotal())}
                className={`w-full mt-6 py-3 rounded-lg text-white font-medium transition-colors
                  ${(!checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]) || 
                     !selectedPaymentId || 
                     (selectedPaymentId && paymentMethod?.credit < calculateTotal()))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {selectedPaymentId && paymentMethod?.credit < calculateTotal()
                  ? 'Saldo Tidak Mencukupi'
                  : 'Pesan Sekarang'}
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
