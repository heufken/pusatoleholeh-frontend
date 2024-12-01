import React, { useState } from 'react';
import Nav from '../components/landing/nav';
import Hero from '../components/landing/hero';
import Products from '../components/landing/products';
import Blog from '../components/landing/blog';
import Footer from '../components/section/footer';
import ProfilePopup from '../components/landing/ProfilePopup';


const LandingPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        {/* Tombol untuk membuka ProfilePopup */}
        {/* <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Tampilkan Popup
        </button> */}
        
        {/* Render ProfilePopup jika isPopupOpen true */}
        {isPopupOpen && (
          <ProfilePopup
            onUpdateAddress={(address) => console.log('Address updated:', address)}
            onUpdateShop={(shop) => console.log('Shop updated:', shop)}
            onClose={() => setIsPopupOpen(false)} // Tutup popup
          />
        )}
      </div>
    </>
  );
};

export default LandingPage;
