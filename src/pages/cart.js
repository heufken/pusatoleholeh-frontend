import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../components/context/AuthContext';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";

const $apiUrl = process.env.REACT_APP_API_BASE_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Tambahkan state untuk local quantities dan debounce timers
  const [localQuantities, setLocalQuantities] = useState({});
  const updateTimers = useRef({});

  // Initialize local quantities from cart items
  useEffect(() => {
    const quantities = {};
    cartItems.forEach(item => {
      quantities[item._id] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);

  // Update quantity dengan debouncing
  const handleQuantityChange = (cartId, newQuantity) => {
    // Update local state immediately
    setLocalQuantities(prev => ({
      ...prev,
      [cartId]: newQuantity
    }));

    // Clear existing timer for this cart item
    if (updateTimers.current[cartId]) {
      clearTimeout(updateTimers.current[cartId]);
    }

    // Set new timer
    updateTimers.current[cartId] = setTimeout(() => {
      updateQuantity(cartId, newQuantity);
    }, 1000); // Delay 1 detik
  };

  // Fungsi update quantity ke server
  const updateQuantity = async (cartId, quantity) => {
    try {
      await axios.put(`${$apiUrl}/cart/update`, 
        { cartId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchCart(); // Refresh cart setelah update berhasil
    } catch (error) {
      // Jika gagal, kembalikan ke quantity sebelumnya
      setLocalQuantities(prev => ({
        ...prev,
        [cartId]: cartItems.find(item => item._id === cartId)?.quantity || 1
      }));
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  // Cleanup timers when component unmounts or updateTimers changes
  useEffect(() => {
    const timers = updateTimers.current;
    return () => {
      if (timers) {
        Object.values(timers).forEach(timer => clearTimeout(timer));
      }
    };
  }, [updateTimers]); // Add updateTimers as dependency

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate, isLoading]);

  // Fetch cart items - wrapped in useCallback
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${$apiUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch cart');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart, isLoading]);

  // Remove item
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`${$apiUrl}/cart/remove/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(`${$apiUrl}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Cart cleared');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  // Handle checkout navigation
  const handleCheckout = () => {
    navigate('/cart/checkout');
  };

  // Tambahkan fungsi untuk navigasi ke product detail
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4338ca"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4338ca"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        ) : Array.isArray(cartItems) && cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : Array.isArray(cartItems) ? (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="border p-4 rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProductClick(item.productId._id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleProductClick(item.productId._id);
                  }}
                >
                  <div>
                    <h3 className="font-semibold">{item.productId.name}</h3>
                    <p>Harga: Rp{item.productId.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Update quantity controls */}
                  <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleQuantityChange(
                          item._id, 
                          Math.max(1, localQuantities[item._id] - 1)
                        )}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={localQuantities[item._id] <= 1}
                      >
                        -
                      </button>
                      <span>{localQuantities[item._id] || item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(
                          item._id, 
                          Math.min(item.productId.stock, localQuantities[item._id] + 1)
                        )}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={localQuantities[item._id] >= item.productId.stock}
                      >
                        +
                      </button>
                    </div>
                    
                    
                    
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button 
                onClick={clearCart}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
              
              <button 
                onClick={handleCheckout}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <div>Something went wrong. Please try again later.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
