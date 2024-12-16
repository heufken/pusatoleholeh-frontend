import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../components/context/AuthContext';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch cart items, couriers, and payment method
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [cartResponse, couriersResponse, paymentResponse] = await Promise.all([
          axios.get(`${apiUrl}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/courier`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/user/payment`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCartItems(cartResponse.data);
        setCouriers(couriersResponse.data);
        setPaymentMethod(paymentResponse.data.paymentMethod);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load checkout data');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, navigate, apiUrl]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.productId.price * item.quantity), 0
  );
  const courierCost = selectedCourier ? 
    couriers.find(c => c._id === selectedCourier)?.cost || 0 : 0;
  const discount = voucher ? 
    Math.min((voucher.discount / 100) * subtotal, subtotal) : 0;
  const total = subtotal + courierCost - discount;

  // Handle voucher application
  const handleApplyVoucher = async () => {
    try {
      const response = await axios.get(`${apiUrl}/voucher/${voucherCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.minPurchase > subtotal) {
        toast.error(`Minimum purchase of ${response.data.minPurchase} required`);
        return;
      }
      
      setVoucher(response.data);
      toast.success('Voucher applied successfully');
    } catch (error) {
      toast.error('Invalid voucher code');
    }
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    if (!selectedCourier) {
      toast.error('Please select a courier');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please add a payment method first');
      return;
    }

    try {
      // Pastikan semua data required ada
      const transactionData = {
        shopId: cartItems[0].productId.shopId, // Asumsi semua item dari shop yang sama
        paymentId: paymentMethod._id,
        voucherId: voucher?._id, // Opsional
        courierId: selectedCourier,
        products: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        totalPrice: total, // Tambahkan total price
        note: '' // Opsional
      };

      // Validasi data sebelum dikirim
      if (!transactionData.shopId || !transactionData.paymentId || !transactionData.courierId) {
        toast.error('Missing required transaction data');
        return;
      }

      // Validasi payment method memiliki credit yang cukup
      if (paymentMethod.credit < total) {
        toast.error('Insufficient credit in payment method');
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

      // Jika berhasil, clear cart dan redirect
      if (response.data) {
        toast.success('Transaction created successfully');
        
        // Clear cart setelah checkout berhasil
        await axios.delete(`${apiUrl}/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        navigate('/profile/transactions');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create transaction';
      toast.error(errorMessage);
      console.error('Checkout Error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">{item.productId.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">
                Rp{(item.productId.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Courier Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a courier</option>
            {couriers.map((courier) => (
              <option key={courier._id} value={courier._id}>
                {courier.name} - Rp{courier.cost.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Voucher */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Voucher</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter voucher code"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleApplyVoucher}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Total</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rp{courierCost.toLocaleString()}</span>
            </div>
            {voucher && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-Rp{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>Rp{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold"
        >
          Create Transaction
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
