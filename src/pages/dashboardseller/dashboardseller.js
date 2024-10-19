import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from '../../components/dashboardseller/header';
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
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-grow">
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <Routes>
        
            <Route path="home" element={<Home />} />
            <Route path="produk" element={<Produk />} />
            <Route path="datatoko" element={<DataToko />} />
            <Route path="pesanan" element={<Pesanan />} />
            <Route path="keuangan" element={<Keuangan />} />
            
          
            <Route path="/" element={<Navigate to="home" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardSeller;
