import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../landing/nav-dropdown";

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleProfileRedirect = () => {
    if (user?.role === "buyer") {
      navigate("/buyerprofile");
    } else if (user?.role === "seller") {
      navigate("/dashboardseller");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header bg-white shadow p-4 flex items-center justify-between border-b border-gray-300" onMouseLeave={() => setIsDropdownOpen(false)}>
      {/* Logo Section */}
      <div className="logo flex items-center">
        <img src="/logo.png" alt="Pusat Oleh-Oleh" className="h-10 w-auto mr-2" />
        <span className="font-bold text-lg hidden md:block">Pusat Oleh-Oleh</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-grow mx-4 max-w-full md:max-w-md border border-gray-300 rounded-full bg-white">
        <button type="button" className="p-2 pl-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
        </button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <input
          type="text"
          placeholder="Apa Yang Anda Inginkan?"
          className="bg-transparent border-none rounded-full p-2 flex-grow focus:outline-none"
        />
      </div>

      {/* User Section with Dropdown */}
      <div className="user-section flex items-center relative" > 
        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <button
              className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-100 transition-colors"
            >
              {user?.name || "Profil"}
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
    </header>
  );
}

export default Header;
