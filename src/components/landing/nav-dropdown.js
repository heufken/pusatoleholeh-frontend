import React from "react";
import { useNavigate } from "react-router-dom";

const DropdownMenu = ({ onProfileClick, onLogoutClick }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
      <div className="relative">
        <button
          onClick={onProfileClick}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
        >
          Profil
        </button>
        <button
          onClick={() => navigate("/transaction")}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
        >
          Pembelian
        </button>
        <button
          onClick={() => navigate("/wishlist")}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
        >
          Wishlist
        </button>
        <button
          onClick={onLogoutClick}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
