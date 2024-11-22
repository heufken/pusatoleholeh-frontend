import React from 'react';
import Nav from '../components/landing/nav';
import Hero from '../components/landing/hero';
import Products from '../components/landing/products';
import Blog from '../components/landing/blog';
import Footer from '../components/section/footer';

const LandingPage = () => {
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
        {/* Tombol dummy untuk uji coba, bisa dihapus atau dikomentari */}
        {/* <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Tampilkan Popup
        </button> */}
      </div>
    </>
  );
};

export default LandingPage;
