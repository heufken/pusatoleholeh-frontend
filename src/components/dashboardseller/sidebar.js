import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside className={`bg-white shadow-md ${isCollapsed ? 'w-16' : 'w-64'} h-screen p-4 transition-width duration-300`}>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className={`${isCollapsed ? 'w-8 h-8' : 'w-16 h-16'} transition-all duration-300`}
          />
        </div>
        
        <NavLink 
          to="/dashboard-seller/home" 
          className={({ isActive }) => 
            isActive ? "flex items-center space-x-4 bg-gray-200 p-2 rounded-lg" : "flex items-center space-x-4 p-2"
          }
        >
          <span>🏠</span>
          {!isCollapsed && <span>Home</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/datatoko" 
          className={({ isActive }) => 
            isActive ? "flex items-center space-x-4 bg-gray-200 p-2 rounded-lg" : "flex items-center space-x-4 p-2"
          }
        >
          <span>🏬</span>
          {!isCollapsed && <span>Data Toko</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/produk" 
          className={({ isActive }) => 
            isActive ? "flex items-center space-x-4 bg-gray-200 p-2 rounded-lg" : "flex items-center space-x-4 p-2"
          }
        >
          <span>📦</span>
          {!isCollapsed && <span>Produk</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/pesanan" 
          className={({ isActive }) => 
            isActive ? "flex items-center space-x-4 bg-gray-200 p-2 rounded-lg" : "flex items-center space-x-4 p-2"
          }
        >
          <span>🛒</span>
          {!isCollapsed && <span>Pesanan</span>}
        </NavLink>
        <NavLink 
          to="/dashboard-seller/keuangan" 
          className={({ isActive }) => 
            isActive ? "flex items-center space-x-4 bg-gray-200 p-2 rounded-lg" : "flex items-center space-x-4 p-2"
          }
        >
          <span>💰</span>
          {!isCollapsed && <span>Keuangan</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
