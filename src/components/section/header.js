import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../../pages/dashboardseller/dashboardseller";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../landing/nav-dropdown";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  ShoppingCartIcon, 
  EnvelopeIcon, 
  BellIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import useCartCount from "../useCartCount";
import { toast } from 'react-hot-toast';

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartCount();

  const userData = userContext ? userContext.userData : null;

  const handleProtectedNavigation = (path) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    if (user?.role !== 'buyer' && path !== '/dashboard-seller') {
      toast.error('Fitur ini hanya tersedia untuk pembeli');
      return;
    }
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };
  
  const handleProfileRedirect = () => {
    if (user?.role === "buyer") {
      navigate("/user");
    } else if (user?.role === "seller") {
      navigate("/dashboard-seller");
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white shadow p-4 items-center justify-between border-b border-gray-300">
        {/* Logo Section */}
        <div onClick={() => navigate('/')} className="logo flex items-center cursor-pointer">
          <img src="/logo.png" alt="Pusat Oleh-Oleh" className="h-10 w-auto mr-2" />
          <span className="font-bold text-lg">Pusat Oleh-Oleh</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-grow mx-4 max-w-md border border-gray-300 rounded-full bg-white">
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
          <button 
            onClick={() => handleProtectedNavigation('/notifications')}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleProtectedNavigation('/messages')}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <EnvelopeIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleProtectedNavigation('/cart')} 
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
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.[0] || <UserIcon className="h-5 w-5" />}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.name || userData?.name}
                  </span>
                </button>
                {isDropdownOpen && (
                  <DropdownMenu
                    role={user?.role}
                    onProfileClick={handleProfileRedirect}
                    onWishlistClick={() => handleProtectedNavigation('/wishlist')}
                    onCartClick={() => handleProtectedNavigation('/cart')}
                    onLogoutClick={handleLogout}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto"/>
              <span className="font-bold text-lg">Pusat Oleh-Oleh</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4F46E5] transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>

              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleProtectedNavigation('/notifications')}
                    className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => handleProtectedNavigation('/messages')}
                    className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <EnvelopeIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleProtectedNavigation("/cart")}
                    className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all relative"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.name?.[0] || <UserIcon className="h-5 w-5" />}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user?.name}
                      </span>
                    </button>
                    {isDropdownOpen && (
                      <DropdownMenu
                        role={user?.role}
                        onProfileClick={handleProfileRedirect}
                        onWishlistClick={() => handleProtectedNavigation('/wishlist')}
                        onCartClick={() => handleProtectedNavigation('/cart')}
                        onLogoutClick={handleLogout}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Masuk
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
