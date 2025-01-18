import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronDown,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../components/context/AuthContext";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-hot-toast";

const Produk = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Aktif");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editModalTab, setEditModalTab] = useState("details");
  const [productImages, setProductImages] = useState([]);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      const cleanedPath = url
        .replace(/^.*localhost:\d+\//, "/") // Menghapus host lokal yang salah
        .replace(/\\/g, "/"); // Mengubah backslash menjadi slash
      return `${cdnUrl}/${cleanedPath}`
        .replace(/\/\//g, "/") // Hindari double slash
        .replace(":/", "://"); // Perbaiki protokol
    },
    [cdnUrl]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${apiUrl}/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Menambahkan normalisasi URL untuk cover gambar
      const productsData = response.data.map((product) => ({
        ...product,
        image:
          normalizeUrl(product.productCover) || "https://placehold.co/600x400", // Menambahkan normalisasi URL
      }));

      setProducts(productsData);
    } catch (err) {
      setError("Tidak ada produk yang bisa ditampilkan.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, normalizeUrl]);

  // Fetch data produk dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`);
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {}
    };

    if (token) {
      fetchProducts();
      fetchCategories();
    }
  }, [fetchProducts, apiUrl, token]);

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
    const toastId = toast.loading(
      `${isActive ? "Menonaktifkan" : "Mengaktifkan"} produk...`
    );

    try {
      const url = `${apiUrl}/product/${
        isActive ? "deactivate" : "activate"
      }/${productId}`;
      await axios.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Perbarui daftar produk
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !isActive }
            : product
        )
      );

      // Perbarui toast ke sukses
      toast.success(
        `Produk berhasil ${isActive ? "dinonaktifkan" : "diaktifkan"}!`,
        {
          id: toastId,
        }
      );
    } catch (err) {
      // Perbarui toast ke error
      toast.error(
        `Gagal ${isActive ? "menonaktifkan" : "mengaktifkan"} produk: ${
          err.message
        }`,
        { id: toastId }
      );
    }
  };

  const sortProducts = (order) => {
    const sortedProducts = [...products].sort((a, b) => {
      if (order === "Termurah") {
        return a.price - b.price;
      } else if (order === "Termahal") {
        return b.price - a.price;
      } else if (order === "Terlama") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (order === "Terbaru") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  const filteredProducts = products
    .filter((product) =>
      activeTab === "Aktif" ? product.isActive : !product.isActive
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDeleteProduct = async (productId, productName) => {
    const toastId = toast.loading("Menghapus produk..."); // Toast awal (loading)

    try {
      await axios.delete(`${apiUrl}/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Hapus produk dari daftar
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      // Perbarui toast ke sukses
      toast.success(`Produk "${productName}" berhasil dihapus!`, {
        id: toastId,
      });
    } catch (err) {
      // Perbarui toast ke error
      toast.error(`Gagal menghapus produk: ${err.message}`, { id: toastId });
    }
  };

  const handleProductPreview = (productId) => {
    navigate(`/product/${productId}`);
  };

  const openEditModal = (product) => {
    setEditProduct({ ...product });
    setSelectedCategory(product.categoryId?._id || '');
    setProductImages(product.productImages || []);
    setEditModalTab("details");
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleEditProduct = async (updatedProduct) => {
    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      if (!selectedCategory) {
        toast.error("Kategori harus dipilih", { id: toastId });
        return;
      }

      const response = await axios.put(
        `${apiUrl}/product/update/${updatedProduct._id}`,
        {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          categoryId: selectedCategory
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? response.data : product
        )
      );

      await fetchProducts();
      toast.success("Produk berhasil diperbarui!", { id: toastId });
      closeEditModal();
    } catch (err) {
      toast.error(
        `Gagal memperbarui produk: ${err.response?.data?.message || err.message}`,
        { id: toastId }
      );
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUpdateCover = async (file) => {
    const toastId = toast.loading("Mengunggah cover...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.put(
        `${apiUrl}/product/update/cover/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditProduct(prev => ({
        ...prev,
        cover: response.data.productCover.url
      }));

      toast.success("Cover produk berhasil diperbarui!", { id: toastId });
    } catch (err) {
      toast.error(
        `Gagal memperbarui cover: ${err.response?.data?.message || err.message}`,
        { id: toastId }
      );
    }
  };

  const handleUploadImages = async (files) => {
    const toastId = toast.loading("Mengunggah gambar produk...");

    try {
      if (productImages.length + files.length > 5) {
        throw new Error("Total gambar tidak boleh lebih dari 5");
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("image", file);
      });

      const response = await axios.post(
        `${apiUrl}/product/upload/image/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProductImages([...productImages, ...response.data.uploadedImages]);
      toast.success("Gambar produk berhasil diunggah!", { id: toastId });
    } catch (err) {
      toast.error(
        `Gagal mengunggah gambar: ${err.response?.data?.message || err.message}`,
        { id: toastId }
      );
    }
  };

  const handleDeleteImage = async (productImageId) => {
    const toastId = toast.loading("Menghapus gambar produk...");

    try {
      await axios.delete(
        `${apiUrl}/product/delete/image/${editProduct._id}/${productImageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProductImages(productImages.filter((img) => img.id !== productImageId));
      toast.success("Gambar produk berhasil dihapus!", { id: toastId });
    } catch (err) {
      toast.error(
        `Gagal menghapus gambar: ${err.response?.data?.message || err.message}`,
        { id: toastId }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots
          height="50"
          width="50"
          color="#F87171"
          ariaLabel="three-dots-loading"
          visible={true}
        />
        <span className="ml-4 text-lg font-medium text-gray-500">
          Loading product data...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Produk</h1>
      <div className="bg-white shadow rounded-lg p-6 border border-gray-300">
        <div className="flex w-full mb-4">
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

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">Daftar Produk {activeTab}</h2>
            <p className="text-gray-600">Atur Produk {activeTab}mu</p>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow z-10">
                <ul>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts("Termurah")}
                  >
                    Termurah
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts("Termahal")}
                  >
                    Termahal
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts("Terlama")}
                  >
                    Terlama
                  </li>
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => sortProducts("Terbaru")}
                  >
                    Terbaru
                  </li>
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
                <th className="p-4 text-center"></th>
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
                        src={product.image}
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
                    <label className="inline-flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        checked={product.isActive}
                        onChange={() =>
                          handleToggleProductStatus(
                            product._id,
                            product.isActive
                          )
                        }
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-4 rounded-full shadow-inner transition-colors duration-300 ${
                          product.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow transition-transform duration-300 ${
                          product.isActive
                            ? "transform translate-x-full border-green-500"
                            : ""
                        }`}
                      ></div>
                    </label>
                  </td>
                  <td className="p-4 text-center relative">
                    <button
                      className="flex items-center bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === product._id ? null : product._id
                        )
                      }
                    >
                      <span className="mr-2">Atur</span>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {openDropdownId === product._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                        <ul>
                          <li
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                            onClick={() => handleProductPreview(product._id)}
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            Preview
                          </li>
                          <li
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              openEditModal(product);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                          </li>
                          <li
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                            onClick={() =>
                              handleDeleteProduct(product._id, product.name)
                            }
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Hapus
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[600px] p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Produk</h2>
            <div className="mb-6">
              <ul className="flex space-x-4 border-b border-gray-200">
                <li>
                  <button
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
                      editModalTab === "details"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setEditModalTab("details")}
                  >
                    Detail Produk
                  </button>
                </li>
                <li>
                  <button
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
                      editModalTab === "cover"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setEditModalTab("cover")}
                  >
                    Gambar Cover
                  </button>
                </li>
                <li>
                  <button
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
                      editModalTab === "images"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setEditModalTab("images")}
                  >
                    Gambar Produk
                  </button>
                </li>
              </ul>
            </div>

            {editModalTab === "details" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi Produk
                  </label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Harga
                    </label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {editModalTab === "cover" && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gambar Cover
                </label>

                {editProduct.cover ? (
                  <div className="space-y-4">
                    <img
                      src={normalizeUrl(editProduct.cover)}
                      alt="Cover Produk"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpdateCover(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Belum ada gambar cover</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpdateCover(e.target.files[0])}
                      className="w-full mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                )}
              </div>
            )}

            {editModalTab === "images" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gambar Produk ({productImages.length}/5)
                  </label>
                  {productImages.length < 5 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleUploadImages(e.target.files)}
                      className="w-48 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {productImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={normalizeUrl(image.url)}
                        alt="Gambar Produk"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                onClick={closeEditModal}
              >
                Batal
              </button>
              <button
                className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium"
                onClick={() => handleEditProduct(editProduct)}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produk;
