import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import DropdownMenu from "./nav-dropdown";
import {
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import useCartCount from "../useCartCount";

function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const cartCount = useCartCount();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Approximate height of the nav bar
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
        // scroll down
        setShowNav(false);
      } else {
        // scroll up
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  const handleDropdownOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay before closing
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

      // Cleanup function
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
                onClick={() => (window.location.href = "/")}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8" />
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

            <div className="flex items-center space-x-6">
              <form
                onSubmit={handleSearch}
                className="hidden md:block relative"
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
                  onClick={() => navigate("/cart")}
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
                    onMouseEnter={handleDropdownOpen}
                    onMouseLeave={handleDropdownClose}
                  >
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
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
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1"
                        onMouseEnter={handleDropdownOpen}
                        onMouseLeave={handleDropdownClose}
                      >
                        <button
                          onClick={handleProfileRedirect}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
                        >
                          Profil Saya
                        </button>
                        <button
                          onClick={() => navigate("/transaction")}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
                        >
                          Pembelian
                        </button>
                        <button
                          onClick={logout}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition-colors"
                        >
                          Keluar
                        </button>
                      </div>
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
        </div>
      </div>
    </nav>
  );
}

export default Nav;
