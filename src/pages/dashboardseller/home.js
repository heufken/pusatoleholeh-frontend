import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log("Home component mounted");
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Penjualan Hari Ini</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-lg">Total Sales</h2>
          <p className="text-2xl font-bold">$1k</p>
          <p className="text-green-500">+8% from yesterday</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
