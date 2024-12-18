import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DropdownMenu from "./nav-dropdown";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleProfileRedirect = () => {
    if (user?.role === "buyer") {
      navigate("/buyerprofile");
    } else if (user?.role === "seller") {
      navigate("/dashboard-seller");
    }
  };

  return (
    <nav className="bg-white py-2 fixed top-0 left-0 right-0 z-50">
      <div
        className="container mx-auto flex items-center justify-between px-4"
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
        <h1 className="text-2xl font-bold text-gray-800">Pusat Oleh-Oleh</h1>

        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <button
              className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {user?.name || <FontAwesomeIcon icon={faUser} />}
            </button>
            {isDropdownOpen && (
              <DropdownMenu
                onProfileClick={handleProfileRedirect}
                onLogoutClick={logout}
              />
            )}
          </div>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="border border-gray-800 text-gray-800 font-semibold py-1 px-3 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none"
          >
            <span>Masuk</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
