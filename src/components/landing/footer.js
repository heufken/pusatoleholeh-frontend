import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t">
      <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Quick Links</h3>
          <ul>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                Offers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-sm">About</h3>
          <ul>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                How It Works
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                Our Packages
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Help Centre</h3>
          <ul>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                Payments
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-primary text-xs">
                Shipping
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-5 text-center text-gray-500 text-xs">
        © 2024 Pusat Oleh-oleh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;