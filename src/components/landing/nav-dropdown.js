import React from "react";
import { useNavigate } from "react-router-dom";

const DropdownMenu = ({ onProfileClick, onLogoutClick }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition ease-out duration-200 z-[9999]">
      <div className="py-1">
        <button
          onClick={onProfileClick}
          className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-all"
        >
          <span className="flex-grow text-left font-medium">Profil Saya</span>
        </button>
        <button
          onClick={() => navigate("/transaction")}
          className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-all"
        >
          <span className="flex-grow text-left font-medium">Pembelian</span>
        </button>
        <button
          onClick={() => navigate("/wishlist")}
          className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-all"
        >
          <span className="flex-grow text-left font-medium">Wishlist</span>
        </button>
        <div className="border-t border-gray-100 my-1"></div>
        <button
          onClick={onLogoutClick}
          className="group flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
        >
          <span className="flex-grow text-left font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
