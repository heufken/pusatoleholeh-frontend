import React, { useState, useEffect } from 'react';
import Nav from '../components/landing/nav';
import Hero from '../components/landing/hero';
import Products from '../components/landing/products';
import Blog from '../components/landing/blog';
import Footer from '../components/landing/footer';
import ProfilePopup from '../components/landing/ProfilePopup';

const LandingPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const isProfileComplete = localStorage.getItem('isProfileComplete');
    if (!isProfileComplete) {
      setIsPopupOpen(true);
    }
  }, []);

  const handlePopupToggle = (isOpen) => {
    setIsPopupOpen(isOpen);
  };

  return (
    <>
      <div className={isPopupOpen ? 'filter blur-sm' : ''}>
        <Nav />
        <div className="pt-20">
          <Hero />
          <Products />
          <Blog />
          <Footer />
        </div>
        {/* Tombol dummy untuk uji coba, bisa dihapus atau dikomentari */}
        {/* <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Tampilkan Popup
        </button> */}
      </div>
      <ProfilePopup isOpen={isPopupOpen} onToggle={handlePopupToggle} />
    </>
  );
};

export default LandingPage;
