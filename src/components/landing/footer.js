import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-8 border-t">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="Logo" className="w-13 h-13" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                About Us
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                Offers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">About</h3>
          <ul>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                How It Works
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                Our Packages
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Help Centre</h3>
          <ul>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                Payments
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/" className="text-gray-600 hover:text-primary">
                Shipping
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        © 2024 Pusat Oleh-oleh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
