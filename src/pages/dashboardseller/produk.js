import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Produk = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Aktif');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([false, false, false]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedProducts(selectedProducts.map(() => newSelectAll));
  };

  const handleProductSelect = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = !newSelectedProducts[index];
    setSelectedProducts(newSelectedProducts);
    setSelectAll(newSelectedProducts.every(Boolean));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Produk</h1>

      {/* Card Container */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-300">
        {/* Tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex w-full">
            <button
              onClick={() => setActiveTab('Aktif')}
              className={`w-1/2 px-4 py-2 font-semibold text-center ${activeTab === 'Aktif' ? 'border-b-2 border-black' : ''}`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab('Nonaktif')}
              className={`w-1/2 px-4 py-2 font-semibold text-center ${activeTab === 'Nonaktif' ? 'border-b-2 border-black' : ''}`}
            >
              Nonaktif
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">List Produk {activeTab}</h2>
            <p className="text-gray-600">Atur Produk {activeTab} Mu</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
          >
            + Produk
          </button>
        </div>

        {/* Product Table with Search */}
        <div className="bg-white shadow rounded-lg border border-gray-300">
          <div className="p-4 border-b border-gray-300">
            <div className="flex justify-end items-center mb-4">
              <div className="flex items-center border rounded-lg p-2 w-1/3">
                <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari Nama Produk Mu"
                  className="ml-2 outline-none w-full"
                />
              </div>
              <div className="relative ml-4">
                <button
                  className="flex items-center border rounded-lg p-2"
                  onClick={toggleDropdown}
                >
                  <span className="mr-2">Urutkan</span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <ul>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Termurah</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Termahal</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Terlama</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Terbaru</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <table className="w-full border-t border-gray-300">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  INFO PRODUK
                </th>
                <th className="text-center p-4">HARGA</th>
                <th className="text-center p-4">STOK</th>
                <th className="text-center p-4">AKTIF</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      className="mr-4"
                      checked={selectedProducts[index]}
                      onChange={() => handleProductSelect(index)}
                    />
                    <img
                      src="https://via.placeholder.com/50"
                      alt="Produk"
                      className="w-12 h-12 rounded mr-4"
                    />
                    <div>
                      <p className="font-semibold">Piscok Lumer Banget</p>
                      <p className="text-gray-500">SKU: -</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex border rounded-lg overflow-hidden">
                        <span className="bg-gray-200 px-3 py-2">Rp</span>
                        <input
                          type="text"
                          value="200.000,00"
                          className="border-0 p-2 w-24 text-center"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex border rounded-lg overflow-hidden">
                        <input
                          type="text"
                          value="300"
                          className="border-0 p-2 w-16 text-center"
                        />
                        <span className="bg-gray-200 px-3 py-2">Pcs</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-black peer-focus:ring-4 peer-focus:ring-gray-300 transition-all"></div>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Produk;
