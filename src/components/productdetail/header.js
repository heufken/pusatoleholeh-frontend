import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <header className="header bg-white shadow p-4 flex items-center justify-between border-b border-gray-300">
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

      {/* User Section */}
      <div className="user-icon flex items-center">
        {isAuthenticated ? (
          <div className="flex items-center">
            <button
              onClick={handleProfileRedirect}
              className="flex items-center bg-gray-200 rounded-full p-2 text-gray-600 hover:bg-gray-300"
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
            <span className="ml-2 hidden md:block">{user?.name || "Profil"}</span>
            <button
              onClick={handleLogout}
              className="ml-4 text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
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
