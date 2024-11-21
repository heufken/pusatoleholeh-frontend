import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-4">Penting Hari Ini</h1>
        <p className="mb-4">Aktivitas Penting Yang Harus Dilakukan</p>
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            {['Pesanan Baru', 'Siap Terkirim', 'Chat Baru', 'Total Sales'].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">{item}</h2>
                <p className="text-2xl font-bold">0</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Statistik Toko</h2>
        <p className="mb-4">Update Terakhir: 1 November 2024 20:18 WIB</p>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 divide-x divide-gray-300">
            {['Potensi Penjualan', 'Produk Dilihat', 'Produk terjual'].map((item, index) => (
              <div key={index} className="p-4">
                <h3 className="text-lg font-semibold">{item}</h3>
                <p className="text-2xl font-bold">{item === 'Potensi Penjualan' ? 'Rp.0,00' : '0'}</p>
                <p className="text-red-500">-100% Dari Hari Sebelumnya</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Cek Keadaan Produkmu</h2>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 divide-x divide-gray-300">
              <div className="col-span-1 p-4">
                <p>Perlu Dipromosikan</p>
              </div>
              <div className="col-span-4 p-4">
                {/* Konten tambahan bisa ditambahkan di sini */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifikasi Section */}
      <div className="col-span-1 border-l-2 border-gray-300 pl-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Notifikasi</h2>
          {Array(5).fill('Produk Yang Anda Jual Basi').map((notif, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <p>{notif}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
