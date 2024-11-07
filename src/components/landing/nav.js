import React from "react";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white py-2">
      <div className="container mx-auto flex items-center justify-between px-4">
        <img src="/logo.png" alt="Logo" className="w-14 h-14 " />
        <h1 className="text-2xl font-bold text-gray-800">Pusat Oleh-Oleh</h1>
        <button
          onClick={handleLoginRedirect}
          className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-100 transition-colors"
        >
          Masuk
        </button>
      </div>
      <div className="container mx-auto mt-2 border-t border-gray-300">
        {/* <ul className="flex justify-center space-x-4 text-gray-800 text-xs pt-2">
          <li>MAKANAN</li>
          <li>SNACK</li>
          <li>MINUMAN</li>
          <li>KERAJINAN TANGAN</li>
          <li>SOUVENIR</li>
          <li>BAHAN MENTAH</li>
        </ul> */}
      </div>
    </nav>
  );
}

export default Nav;