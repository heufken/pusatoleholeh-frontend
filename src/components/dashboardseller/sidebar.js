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
    `flex items-center space-x-4 p-2 transition-all duration-300 ${
      isActive ? 'text-red-500 border-l-4 border-red-500' : 'hover:bg-gray-100 hover:text-red-500'
    }`;

  return (
    <aside className={`fixed bg-white shadow-md ${isCollapsed ? 'w-16' : 'w-64'} h-screen p-4 transition-width duration-300`}>
      <div className="flex flex-col space-y-6">
        <button 
          onClick={toggleSidebar} 
          className={navItemClass(false)}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          {showText && <span>Sembunyikan Menu</span>}
        </button>
        <NavLink 
          to="/dashboard-seller/home" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <HomeIcon className="w-5 h-5" />
          {showText && <span>Dashboard</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/profile" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <UserIcon className="w-5 h-5" />
          {showText && <span>Data Pengguna</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/datatoko" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <BuildingStorefrontIcon className="w-5 h-5" />
          {showText && <span>Data Toko</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/produk" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <CubeIcon className="w-5 h-5" />
          {showText && <span>Produk</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/pesanan" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {showText && <span>Pesanan</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/keuangan" 
          className={({ isActive }) => navItemClass(isActive)}
        >
          <CurrencyDollarIcon className="w-5 h-5" />
          {showText && <span>Keuangan</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
