import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DropdownMenu from "./nav-dropdown";

function Nav() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleProfileRedirect = () => {
    if (role === "buyer") {
      navigate("/buyerprofile");
    } else if (role === "seller") {
      navigate("/dashboardseller");
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="bg-white py-2 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4" onMouseLeave={() => setIsDropdownOpen(false)}>
        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
        <h1 className="text-2xl font-bold text-gray-800">Pusat Oleh-Oleh</h1>

        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <button
              className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-100 transition-colors"
            >
              Profil
            </button>
            {isDropdownOpen && (
              <DropdownMenu
                onProfileClick={handleProfileRedirect}
                onLogoutClick={handleLogout}
              />
            )}
          </div>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-100 transition-colors"
          >
            Masuk
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;