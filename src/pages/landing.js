import React from 'react';
import Nav from '../components/landing/nav';
import Hero from '../components/landing/hero';
import Products from '../components/landing/products';
import Blog from '../components/landing/blog';
import Footer from '../components/landing/footer';

const LandingPage = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <Products />
      <Blog />
      <Footer />
    </div>
  );
};

export default LandingPage;
