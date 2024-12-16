import React, { useState, useContext, useEffect } from 'react';
import Nav from '../components/landing/nav';
import Hero from '../components/landing/hero';
import Products from '../components/landing/products';
import Blog from '../components/landing/blog';
import Footer from '../components/section/footer';
import ProfilePopup from '../components/landing/ProfilePopup';
import { AuthContext } from '../components/context/AuthContext';
import axios from 'axios';

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${apiUrl}/user`, { headers });
        
        const { user, image, address } = response.data;

        setUserData({
          ...user,
          profileImage: image?.[0]?.url
        });
        setAddressData(address?.[0]);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setInitialLoadComplete(true);
      }
    };

    if (token) fetchData();
  }, [token, apiUrl]);

  const updateAddressData = (newAddress) => {
    setAddressData(newAddress);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const isProfileIncomplete = !addressData || !userData?.profileImage;
  const shouldShowPopup = initialLoadComplete && isProfileIncomplete && token && showPopup;

  return (
    <>
      <div>
        <Nav />
        <div className="pt-20">
          <Hero />
          <Products />
          <Blog />
          <Footer />
        </div>
        
        {shouldShowPopup && (
          <ProfilePopup
            onUpdateAddress={updateAddressData}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </>
  );
};

export default LandingPage;
