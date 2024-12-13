import React, { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, EyeIcon, PrinterIcon } from '@heroicons/react/24/solid';

const Pesanan = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Halaman Pesanan</h1>

      {/* Ringkasan Pesanan */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {['Baru', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((status, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{status}</h2>
              <p className="text-2xl font-bold">0</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </div>
        ))}
      </div>

      {/* Tabel Daftar Pesanan */}
      <div className="bg-white shadow rounded-lg border border-gray-300">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center border rounded-lg p-2 w-full md:w-1/3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Cari Nomor Pesanan, Nama Pembeli, atau Produk"
                className="ml-2 outline-none w-full"
              />
            </div>
            <div className="relative ml-4">
              <button
                className="flex items-center border rounded-lg p-2"
                onClick={toggleDropdown}
              >
                <span className="mr-2">Filter Status</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <ul>
                    {['Semua', 'Baru', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((status) => (
                      <li
                        key={status}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <table className="w-full border-t border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4">Nomor Pesanan</th>
              <th className="text-left p-4">Nama Pembeli</th>
              <th className="text-left p-4">Produk</th>
              <th className="text-center p-4">Total Harga</th>
              <th className="text-center p-4">Tanggal Pesanan</th>
              <th className="text-center p-4">Status Pesanan</th>
              <th className="text-center p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-4">#12345{index}</td>
                <td className="p-4">Nama Pembeli {index}</td>
                <td className="p-4">Produk {index}</td>
                <td className="p-4 text-center">Rp 100.000</td>
                <td className="p-4 text-center">01/01/2024</td>
                <td className="p-4 text-center">
                  <select className="border rounded p-2">
                    {['Baru', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button className="mr-2" title="Lihat Detail">
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <button title="Cetak Invoice">
                    <PrinterIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pesanan;
