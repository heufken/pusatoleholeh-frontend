import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../landing/nav-dropdown";

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoginRedirect = () => navigate("/login");
  const handleProfileRedirect = () => navigate("/buyerprofile");
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
      <div className="logo flex items-center">
        <img src="/logo.png" alt="Pusat Oleh-Oleh" className="h-10 w-auto mr-2" />
        <span className="font-bold text-lg hidden md:block">Pusat Oleh-Oleh</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-grow mx-4 max-w-full md:max-w-md border border-gray-300 rounded-full bg-white">
        <button type="button" onClick={handleSearchSubmit} className="p-2 pl-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
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

      {/* User Section with Dropdown */}
      <div className="user-section flex items-center relative">
        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <button
              className=" text-gray-800 font-semibold py-1 px-3 rounded-full hover:bg-gray-300 transition-colors focus:outline-none"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            </button>
            {isDropdownOpen && (
              <DropdownMenu
                role={user?.role}
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
    </header>
  );
}

export default Header;
