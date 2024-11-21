import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from '../../components/section/header';
import Sidebar from '../../components/dashboardseller/sidebar';
import Footer from '../../components/dashboardseller/footer';
import Home from './home';
import Produk from './produk';
import DataToko from './datatoko';
import Pesanan from './pesanan';
import Keuangan from './keuangan';

const DashboardSeller = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex mt-16">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`flex-grow min-h-screen bg-gradient-to-b from-red-200 via-red-50 to-gray-200 p-6 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="produk" element={<Produk />} />
            <Route path="datatoko" element={<DataToko />} />
            <Route path="pesanan" element={<Pesanan />} />
            <Route path="keuangan" element={<Keuangan />} />
            
            <Route path="/" element={<Navigate to="home" />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
