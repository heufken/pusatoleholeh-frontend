import React from "react";

const DropdownMenu = ({ onProfileClick, onLogoutClick }) => {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
      <div className="relative">
        <button
          onClick={onProfileClick}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Profil
        </button>
        <button
          onClick={onLogoutClick}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
