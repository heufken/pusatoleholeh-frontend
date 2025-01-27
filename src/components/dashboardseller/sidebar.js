import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserIcon, HomeIcon, BuildingStorefrontIcon, CubeIcon, ShoppingCartIcon, CurrencyDollarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [showText, setShowText] = useState(!isCollapsed);

  useEffect(() => {
    if (isCollapsed) {
      setShowText(false);
    } else {
      const timer = setTimeout(() => setShowText(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isCollapsed]);

  const navItemClass = (isActive) =>
    `flex items-center space-x-4 p-3 transition-all duration-300 ${
      isActive 
        ? 'text-[#4F46E5] bg-gradient-to-r from-indigo-50 to-purple-50 border-r-4 border-[#4F46E5] font-medium shadow-sm' 
        : 'text-gray-600 hover:text-[#4F46E5] hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30'
    }`;

  return (
    <aside className={`fixed top-16 left-0 bg-white/80 backdrop-blur-sm shadow-lg ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-[calc(100vh-4rem)] transition-all duration-300 z-10`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          <button 
            onClick={toggleSidebar} 
            className="flex items-center space-x-4 p-3 w-full text-gray-600 hover:text-[#4F46E5] hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
            {showText && <span className="font-medium">Sembunyikan Menu</span>}
          </button>
          
          <nav className="mt-6 space-y-2">
            <NavLink 
              to="/dashboard-seller/home" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <HomeIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Dashboard</span>}
            </NavLink>
            <NavLink 
              to="/dashboard-seller/profile" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <UserIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Data Pengguna</span>}
            </NavLink>
            <NavLink 
              to="/dashboard-seller/datatoko" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <BuildingStorefrontIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Data Toko</span>}
            </NavLink>
            <NavLink 
              to="/dashboard-seller/produk" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <CubeIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Produk</span>}
            </NavLink>
            <NavLink 
              to="/dashboard-seller/pesanan" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <ShoppingCartIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Pesanan</span>}
            </NavLink>
            <NavLink 
              to="/dashboard-seller/keuangan" 
              className={({ isActive }) => navItemClass(isActive)}
            >
              <CurrencyDollarIcon className="w-5 h-5 shrink-0" />
              {showText && <span>Keuangan</span>}
            </NavLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
