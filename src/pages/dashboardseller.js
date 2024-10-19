import React, { useState } from 'react';
import Header from '../components/dashboard/header';
import Sidebar from '../components/dashboard/sidebar';
import Footer from '../components/dashboard/footer';

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
          <h1 className="text-2xl font-bold mb-4">Penjualan Hari Ini</h1>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="text-lg">Total Sales</h2>
              <p className="text-2xl font-bold">$1k</p>
              <p className="text-green-500">+8% from yesterday</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="text-lg">Total Sales</h2>
              <p className="text-2xl font-bold">$1k</p>
              <p className="text-green-500">+8% from yesterday</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="text-lg">Total Sales</h2>
              <p className="text-2xl font-bold">$1k</p>
              <p className="text-green-500">+8% from yesterday</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardSeller;
