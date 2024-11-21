import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../components/context/AuthContext";

const Produk = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Aktif");
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch data produk dari API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/product/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data || []);
        setSelectedProducts(new Array(response.data.length).fill(false));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [apiUrl, token]);

  const handleAddProduct = () => navigate("/add-product");

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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleToggleProductStatus = async (productId, isActive) => {
    try {
      const url = `${apiUrl}/product/${isActive ? 'deactivate' : 'activate'}/${productId}`;
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !isActive }
            : product
        )
      );
    } catch (err) {
      console.error("Error updating product status:", err.message);
    }
  };

  const filteredProducts = products.filter((product) =>
    activeTab === "Aktif" ? product.isActive : !product.isActive
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Produk</h1>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-300">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("Aktif")}
            className={`w-1/2 px-4 py-2 font-semibold text-center ${
              activeTab === "Aktif" ? "border-b-2 border-black" : ""
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab("Nonaktif")}
            className={`w-1/2 px-4 py-2 font-semibold text-center ${
              activeTab === "Nonaktif" ? "border-b-2 border-black" : ""
            }`}
          >
            Nonaktif
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-300 mt-4">
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

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-500"
            />
            <input
              type="text"
              placeholder="Cari Produk"
              className="w-full pl-10 py-2 border rounded-lg"
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
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
                <ul>
                  <li className="px-4 py-2 cursor-pointer">Termurah</li>
                  <li className="px-4 py-2 cursor-pointer">Termahal</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <table className="w-full border-t">
            <thead>
              <tr>
                <th className="p-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-5 w-5 accent-red-500 mr-2"
                    />
                    <span>INFO PRODUK</span>
                  </div>
                </th>
                <th className="p-4 text-center">HARGA</th>
                <th className="p-4 text-center">STOK</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="border-t">
                  <td className="p-4 flex items-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts[index]}
                        onChange={() => handleProductSelect(index)}
                        className="h-5 w-5 accent-red-500 mr-4"
                      />
                      <img
                        src={product.image || "https://placehold.co/600x400"}
                        alt={product.name}
                        className="w-12 h-12 rounded mr-4"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-gray-500">SKU: {product.sku || "-"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex border rounded-lg overflow-hidden">
                        <span className="bg-gray-200 px-3 py-2">Rp</span>
                        <span className="px-3 py-2">{product.price}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex border rounded-lg overflow-hidden">
                        <span className="px-3 py-2">{product.stock}</span>
                        <span className="bg-gray-200 px-3 py-2">Pcs</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleProductStatus(product._id, product.isActive)}
                      className={`px-4 py-1 rounded ${
                        product.isActive ? "bg-green-500" : "bg-gray-500"
                      } text-white`}
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Produk;