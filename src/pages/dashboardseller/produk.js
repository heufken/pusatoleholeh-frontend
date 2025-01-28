import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronDown,
  faEdit,
  faPlus,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../components/context/AuthContext";
import { toast } from "react-hot-toast";

const Produk = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Aktif");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editModalTab, setEditModalTab] = useState("details");
  const [productImages, setProductImages] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
      try {
        // Buat URL object untuk parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
        
        // Ambil pathname dari URL (bagian setelah host)
        const pathname = urlObj.pathname;
        
        // Gabungkan dengan CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // Jika URL invalid, coba cara alternatif
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Hapus protocol dan host (perbaikan escape character)
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Pastikan hanya ada satu leading slash

        return `${cdnUrl}${cleanPath}`;
      }
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
        image: normalizeUrl(product.productCover)
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') || false;
    const matchesCategory = !selectedCategory || product.categoryId?._id === selectedCategory;
    const matchesStatus = activeTab === "Aktif" ? product.isActive : !product.isActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  // Handle bulk selection
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = async () => {
    const toastId = toast.loading("Menghapus produk terpilih...");
    try {
      await Promise.all(
        selectedProducts.map(productId =>
          axios.delete(`${apiUrl}/product/delete/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      
      setProducts(prevProducts => 
        prevProducts.filter(product => !selectedProducts.includes(product._id))
      );
      setSelectedProducts([]);
      setSelectAll(false);
      toast.success("Produk berhasil dihapus!", { id: toastId });
    } catch (err) {
      toast.error(`Gagal menghapus produk: ${err.message}`, { id: toastId });
    }
  };

  const handleBulkToggleStatus = async (activate) => {
    const toastId = toast.loading(`${activate ? "Mengaktifkan" : "Menonaktifkan"} produk terpilih...`);
    try {
      await Promise.all(
        selectedProducts.map(productId =>
          axios.put(
            `${apiUrl}/product/${activate ? "activate" : "deactivate"}/${productId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          selectedProducts.includes(product._id)
            ? { ...product, isActive: activate }
            : product
        )
      );
      setSelectedProducts([]);
      setSelectAll(false);
      toast.success(`Produk berhasil ${activate ? "diaktifkan" : "dinonaktifkan"}!`, { id: toastId });
    } catch (err) {
      toast.error(`Gagal ${activate ? "mengaktifkan" : "menonaktifkan"} produk: ${err.message}`, { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-2">
            Produk Saya
          </h2>
          <p className="text-gray-600 mb-6">Kelola produk-produk anda</p>
      <div className="p-0 sm:p-6 lg:p-0">
        <div className="sm:flex sm:items-center sm:justify-between mb-4">
        
          <div className="mt-0 sm:mt-0">
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4F46E5]/90 hover:to-[#7C3AED]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tambah Produk
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden mb-6">
          {/* Header Section */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter Produk</h3>
          </div>

          <div className="p-6">
            {/* Search and Category Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Search with Label */}
              <div className="space-y-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Cari Produk
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    placeholder="Masukkan nama produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Category Filter with Label */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition duration-150 ease-in-out"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Status Produk
              </label>
              <div className="inline-flex p-1 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setActiveTab("Aktif")}
                  className={`px-8 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "Aktif"
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${activeTab === "Aktif" ? "bg-green-400" : "bg-gray-400"}`} />
                    Aktif
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("Nonaktif")}
                  className={`px-8 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "Nonaktif"
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${activeTab === "Nonaktif" ? "bg-red-400" : "bg-gray-400"}`} />
                    Nonaktif
                  </div>
                </button>
              </div>
            </div>

            {/* Results count with border top */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Menampilkan {filteredProducts.length} produk
                </span>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setActiveTab("Aktif");
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada produk yang ditampilkan</p>
          </div>
        ) : (
          <>
            {selectedProducts.length > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-4 z-50 border border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  {selectedProducts.length} produk terpilih
                </span>
                <div className="h-4 w-px bg-gray-200"></div>
                <button
                  onClick={() => handleBulkToggleStatus(true)}
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Aktifkan
                </button>
                <button
                  onClick={() => handleBulkToggleStatus(false)}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Nonaktifkan
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            )}
            <div className="mb-4 flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Pilih Semua</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${
                    selectedProducts.includes(product._id)
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm">
                        <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#4F46E5] font-bold mb-2">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600 text-sm">
                          Stok: {product.stock}
                        </p>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={product.isActive}
                              onChange={() => handleToggleProductStatus(product._id, product.isActive)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-600 hover:text-[#4F46E5] transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleProductPreview(product._id)}
                          className="p-2 text-gray-600 hover:text-[#4F46E5] transition-colors"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
                Edit Produk
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex gap-4 mb-6 border-b">
              {["details", "cover", "images"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEditModalTab(tab)}
                  className={`px-4 py-2 -mb-px transition-all duration-200 ${
                    editModalTab === tab
                      ? "border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "details" ? "Detail Produk" : tab === "cover" ? "Gambar Cover" : "Gambar Produk"}
                </button>
              ))}
            </div>

            {editModalTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harga
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Cover
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {editProduct.cover ? (
                        <div className="relative">
                          <img
                            src={normalizeUrl(editProduct.cover)}
                            alt="Cover preview"
                            className="mx-auto h-64 w-full object-cover rounded-lg"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpdateCover(e.target.files[0])}
                            className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload file</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleUpdateCover(e.target.files[0])}
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF sampai 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editModalTab === "images" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Produk (Maksimal 5)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                    {productImages.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={normalizeUrl(image.url)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {productImages.length < 5 && (
                      <label className="border-2 border-gray-300 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleUploadImages(Array.from(e.target.files))}
                          accept="image/*"
                          multiple
                        />
                        <span className="mt-2 text-sm text-gray-500">
                          Tambah Foto
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              {editModalTab === "details" && (
                <button
                  onClick={() => handleEditProduct(editProduct)}
                  className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Simpan Perubahan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produk;
