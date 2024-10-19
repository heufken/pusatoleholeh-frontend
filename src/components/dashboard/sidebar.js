import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside className={`bg-white shadow-md ${isCollapsed ? 'w-16' : 'w-64'} h-screen p-4`}>
      <div className="flex flex-col space-y-6">
        <NavLink to="/dashboard" className="flex items-center space-x-4">
          <span>🏠</span>
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/datatoko" className="flex items-center space-x-4">
          <span>🏬</span>
          {!isCollapsed && <span>Data Toko</span>}
        </NavLink>
        <NavLink to="/produk" className="flex items-center space-x-4">
          <span>📦</span>
          {!isCollapsed && <span>Produk</span>}
        </NavLink>
        <NavLink to="/pesanan" className="flex items-center space-x-4">
          <span>🛒</span>
          {!isCollapsed && <span>Pesanan</span>}
        </NavLink>
        <NavLink to="/keuangan" className="flex items-center space-x-4">
          <span>💰</span>
          {!isCollapsed && <span>Keuangan</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
