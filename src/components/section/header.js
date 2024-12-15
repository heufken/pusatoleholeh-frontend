import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../../pages/dashboardseller/dashboardseller";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../landing/nav-dropdown";
import { MagnifyingGlassIcon, UserIcon, ShoppingCartIcon, EnvelopeIcon, BellIcon } from '@heroicons/react/24/outline';
import useCartCount from "../useCartCount";

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartCount();

  const userData = userContext ? userContext.userData : null;

  const handleLoginRedirect = () => navigate("/login");
  const handleProfileRedirect = () => navigate("/user");
  const handleDashboardRedirect = () => navigate("/dashboardseller");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className="header bg-white shadow p-4 flex items-center justify-between border-b border-gray-300"
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {/* Logo Section */}
      <div  onClick={() => window.location.href = '/'} className="logo flex items-center cursor-pointer">
        <img src="/logo.png" alt="Pusat Oleh-Oleh" className="h-10 w-auto mr-2" />
        <span className="font-bold text-lg hidden md:block">Pusat Oleh-Oleh</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-grow mx-4 max-w-full md:max-w-md border border-gray-300 rounded-full bg-white">
        <button type="button" onClick={handleSearchSubmit} className="p-2 pl-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          placeholder="Lagi mau cari apa hari ini?"
          className="bg-transparent border-none rounded-full p-2 flex-grow focus:outline-none"
        />
      </div>

      {/* Icons Section */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-800 hover:text-gray-600 transition-colors">
          <BellIcon className="w-5 h-5" />
        </button>
        <button className="text-gray-800 hover:text-gray-600 transition-colors">
          <EnvelopeIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => window.location.href = '/cart'} 
          className="text-gray-800 hover:text-gray-600 transition-colors relative"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[8px] font-bold px-1 py-0.5 rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <div className="border-l border-gray-600 h-8 mx-2"></div>
        
        {/* User Section with Dropdown */}
        <div className="user-section flex items-center relative">
          {isAuthenticated ? (
            <div
              className="relative "
              onMouseEnter={() => setIsDropdownOpen(true)}
            >
              <button
                className="text-gray-800 font-semibold py-1 px-3 rounded-full transition-colors focus:outline-none"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <span className="ml-2 text-gray-800">{userData?.name}</span>
              {isDropdownOpen && (
                <DropdownMenu
                  role={userData?.role}
                  onProfileClick={handleProfileRedirect}
                  onDashboardClick={handleDashboardRedirect}
                  onLogoutClick={handleLogout}
                />
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-300 transition-colors focus:outline-none"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
