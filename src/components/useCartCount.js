// src/hooks/useCartCount.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

const useCartCount = () => {
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, token } = useContext(AuthContext);
  const $apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await axios.get(`${$apiUrl}/cart`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const cartItems = Array.isArray(response.data) ? response.data : [];
          setCartCount(cartItems.length);
        } catch (error) {
          console.error('Error fetching cart count:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthenticated, token, $apiUrl]);

  return cartCount;
};

export default useCartCount;