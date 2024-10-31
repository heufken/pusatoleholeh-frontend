import React from "react";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4 relative">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* Teks Pusat Oleh-Oleh di Tengah */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-800">
          Pusat Oleh-Oleh
        </h1>

        {/* Tombol Masuk */}
        <button
          onClick={handleLoginRedirect}
          className="border border-gray-800 text-gray-800 font-semibold py-1 px-4 rounded hover:bg-lavenderwhip transition-colors duration-300"
        >
          Masuk
        </button>
        
      </div>

      {/* Kategori Menu */}
      <div className="container mx-auto mt-4 border-t border-gray-300">
        <ul className="flex justify-center space-x-6 text-gray-800 text-sm pt-4">
          <li>MAKANAN</li>
          <li>SNACK</li>
          <li>MINUMAN</li>
          <li>KERAJINAN TANGAN</li>
          <li>SOUVENIR</li>
          <li>BAHAN MENTAH</li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
