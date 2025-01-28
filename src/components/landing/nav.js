import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useCartCount from "../useCartCount";
import { toast } from 'react-hot-toast';
import DropdownMenu from './nav-dropdown';

function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const cartCount = useCartCount();

  const handleProtectedNavigation = (path) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    if (user?.role !== 'buyer') {
      toast.error('Fitur ini hanya tersedia untuk pembeli');
      return;
    }
    navigate(path);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleProfileRedirect = () => {
    if (user?.role === "buyer") {
      navigate("/user");
    } else if (user?.role === "seller") {
      navigate("/dashboard-seller");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleDropdownOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleDropdownClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [controlNavbar]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8"/>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                  Pusat Oleh-Oleh
                </h1>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors"
                >
                  Beranda
                </button>
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors"
                >
                  Produk
                </button>
                <button
                  onClick={() => scrollToSection("blog")}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors"
                >
                  Blog
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
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

            <div className="hidden md:flex items-center space-x-6">
              <form
                onSubmit={handleSearch}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-72 h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4F46E5] transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all">
                  <BellIcon className="h-6 w-6" />
                </button>
                <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all">
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

                {isAuthenticated ? (
                  <div 
                    ref={dropdownRef} 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
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
                        onProfileClick={() => {
                          handleProfileRedirect();
                          setIsDropdownOpen(false);
                        }}
                        onLogoutClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4F46E5] transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    scrollToSection("hero");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors py-2"
                >
                  Beranda
                </button>
                <button
                  onClick={() => {
                    scrollToSection("products");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors py-2"
                >
                  Produk
                </button>
                <button
                  onClick={() => {
                    scrollToSection("blog");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors py-2"
                >
                  Blog
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all">
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-all">
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
                  <div 
                    ref={dropdownRef} 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
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
                        onProfileClick={() => {
                          handleProfileRedirect();
                          setIsDropdownOpen(false);
                        }}
                        onLogoutClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleLoginRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
