import React from 'react';
import { useNavigate } from 'react-router-dom';

const Produk = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Produk</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b-2 mb-4">
        <button className="px-4 py-2 font-semibold text-gray-700 border-b-4 border-green-500">
          Semua Produk
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-4">
        {/* <input
          type="text"
          placeholder="Cari nama produk atau SKU"
          className="border p-2 rounded-lg w-1/3"
        /> */}
        <div className="flex space-x-2">
          {/* <button className="border px-4 py-2 rounded-lg">Filter</button>
          <button className="border px-4 py-2 rounded-lg">Etalase</button>
          <button className="border px-4 py-2 rounded-lg">Kategori</button>
          <button className="border px-4 py-2 rounded-lg">Urutkan</button> */}
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-center p-4">INFO PRODUK</th>
              <th className="text-center p-4">STATISTIK</th>
              <th className="text-center p-4">HARGA</th>
              <th className="text-center p-4">STOK</th>
              <th className="text-center p-4">AKTIF</th>
              <th className="text-center p-4">ATUR</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 space-x-2 text-center">
                  Dummy
                </td>
                <td className="p-4 text-center">
                  Dummy
                </td>
                <td className="p-4 text-center">
                  Dummy
                </td>
                <td className="p-4 text-center">
                  Dummy
                </td>
                <td className="p-4 text-center">
                  Dummy
                </td>
                <td className="p-4 text-center">
                  Dummy
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Produk;
