import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../../components/context/AuthContext";
import { toast } from "react-hot-toast";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const AddProduct = () => {
  const { token } = useContext(AuthContext); // Mengambil token dari AuthContext
  const navigate = useNavigate(); // Hook untuk melakukan navigasi

  const [currentTab, setCurrentTab] = useState(1);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    coverImage: null,
    productImages: [],
    id: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false); // Menyimpan status upload gambar
  const [isSuccess, setIsSuccess] = useState(false);

  // Tambahkan state untuk upload
  const [uploadedFiles, setUploadedFiles] = useState({
    cover: null,
    products: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk validasi file
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error(`File "${file.name}" harus berformat JPG, PNG, GIF, atau WEBP`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(`File "${file.name}" terlalu besar. Maksimal 10MB`);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.categories) {
          setCategories(response.data.categories);
        } else {
          // console.log(response.data.message);
        }
      } catch (error) {
        // console.error(error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    // console.log(files);
    if (type === "cover") {
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setProductData(prev => ({ ...prev, coverImage: file }));
          setUploadedFiles(prev => ({
            ...prev,
            cover: {
              name: file.name,
              preview: URL.createObjectURL(file)
            }
          }));
          toast.success('Cover image berhasil dipilih');
        }
      }
    } else {
      const validFiles = files.filter(validateFile);
      if (validFiles.length > 0) {
        setProductData(prev => ({
          ...prev,
          productImages: [...prev.productImages, ...validFiles]
        }));
        const newPreviews = validFiles.map(file => ({
          name: file.name,
          preview: URL.createObjectURL(file)
        }));
        setUploadedFiles(prev => ({
          ...prev,
          products: [...prev.products, ...newPreviews]
        }));
        toast.success(`${validFiles.length} gambar produk berhasil dipilih`);
      }
    }
  };

  const goToNextTab = () => setCurrentTab(currentTab + 1);
  // const goToPreviousTab = () => setCurrentTab(currentTab - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi data produk
    if (!productData.name || !productData.price || !productData.stock || !productData.categoryId) {
      toast.error("Pastikan semua data produk terisi");
      return;
    }

    // Validasi gambar
    if (!productData.coverImage && productData.productImages.length === 0) {
      toast.error('Pilih minimal satu gambar untuk produk');
      return;
    }

    // Mulai proses dengan loading state
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan produk...");

    try {
      // Step 1: Create product and get ID
      const productResponse = await axios.post(
        `${apiUrl}/product/create`,
        {
          name: productData.name,
          description: productData.description,
          price: parseInt(productData.price, 10),
          stock: parseInt(productData.stock, 10),
          categoryId: productData.categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productId = productResponse.data.product?._id;
      if (!productId) {
        throw new Error("ID produk tidak ditemukan");
      }

      // Update toast message
      toast.loading("Mengupload gambar...", { id: toastId });

      // Step 2: Upload cover image if exists
      if (productData.coverImage) {
        const coverFormData = new FormData();
        coverFormData.append("image", productData.coverImage);
        await axios.post(
          `${apiUrl}/product/upload/cover/${productId}`,
          coverFormData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Step 3: Upload product images if exists
      if (productData.productImages.length > 0) {
        const imageFormData = new FormData();
        productData.productImages.forEach((file) => {
          imageFormData.append("image", file);
        });
        
        await axios.post(
          `${apiUrl}/product/upload/image/${productId}`,
          imageFormData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Success! Update UI and show success message
      setUploadSuccess(true);
      setIsSuccess(true);
      toast.success('Produk berhasil disimpan!', { id: toastId });
      
      // Optional: Navigate to next tab or product list
      goToProductList();

    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.message || 'Gagal menyimpan produk', 
        { id: toastId }
      );
      setErrorMessage('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk navigasi ke halaman daftar produk
  const goToProductList = () => {
    navigate("/dashboard-seller/produk"); // Redirect ke halaman daftar produk
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      coverImage: null,
      productImages: [],
      id: null,
    });
    setUploadedFiles({
      cover: null,
      products: []
    });
    setUploadSuccess(false);
    setIsSuccess(false);
    setCurrentTab(1);
  };

  // Cleanup function untuk URL.createObjectURL
  useEffect(() => {
    return () => {
      if (uploadedFiles.cover) {
        URL.revokeObjectURL(uploadedFiles.cover.preview);
      }
      uploadedFiles.products.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  return (
    <div className="relative">
      {!isSuccess ? (
        <div className="bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 p-8 rounded-2xl">
          <div className=" p-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
                Tambah Produk
              </h2>
              <button
                onClick={goToProductList}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kembali ke Daftar Produk
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden mb-6">
              <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-800">Detail Produk</h3>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Produk */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                        required
                      />
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Kategori
                      </label>
                      <div className="relative">
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={productData.categoryId}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-10 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition duration-150 ease-in-out"
                          required
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

                    {/* Harga */}
                    <div className="space-y-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Harga
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={productData.price}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                          required
                        />
                      </div>
                    </div>

                    {/* Stok */}
                    <div className="space-y-2">
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stok
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={productData.stock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                        required
                      />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                      required
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Foto Produk
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="coverImage"
                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="coverImage"
                              name="coverImage"
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, "cover")}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {uploadedFiles.cover && (
                      <div className="mt-4">
                        <img
                          src={uploadedFiles.cover.preview}
                          alt="Preview"
                          className="h-32 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Images Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Foto Produk Lainnya
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="productImages"
                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="productImages"
                              name="productImages"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, "product")}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {uploadedFiles.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedFiles.products.map((file, index) => (
                          <div key={index} className="relative group aspect-w-1 aspect-h-1">
                            <img
                              src={file.preview}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-500 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <button
                                onClick={() => {
                                  const newFiles = uploadedFiles.products.filter((_, i) => i !== index);
                                  setUploadedFiles(prev => ({ ...prev, products: newFiles }));
                                  const newProductImages = productData.productImages.filter((_, i) => i !== index);
                                  setProductData(prev => ({ ...prev, productImages: newProductImages }));
                                  toast.success('Gambar dihapus');
                                }}
                                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`px-6 py-2.5 ${
                        isLoading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90'
                      } text-white font-medium rounded-lg transition-all duration-200`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </div>
                      ) : (
                        'Simpan & Lanjutkan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {currentTab === 2 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden mb-6 mt-6">
                <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800">Upload Gambar</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Foto Produk
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="coverImage"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleFileChange(e, "cover")}
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                      {uploadedFiles.cover && (
                        <div className="mt-4">
                          <img
                            src={uploadedFiles.cover.preview}
                            alt="Preview"
                            className="h-32 w-auto rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Images Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Foto Produk Lainnya
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="productImages"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload files</span>
                              <input
                                id="productImages"
                                name="productImages"
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={(e) => handleFileChange(e, "product")}
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                      {uploadedFiles.products.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedFiles.products.map((file, index) => (
                            <div key={index} className="relative group aspect-w-1 aspect-h-1">
                              <img
                                src={file.preview}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-500 transition-colors"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    const newFiles = uploadedFiles.products.filter((_, i) => i !== index);
                                    setUploadedFiles(prev => ({ ...prev, products: newFiles }));
                                    const newProductImages = productData.productImages.filter((_, i) => i !== index);
                                    setProductData(prev => ({ ...prev, productImages: newProductImages }));
                                    toast.success('Gambar dihapus');
                                  }}
                                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`px-6 py-2.5 ${
                          isLoading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90'
                        } text-white font-medium rounded-lg transition-all duration-200`}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                          </div>
                        ) : (
                          'Upload Gambar'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 3 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden mb-6 mt-6">
                <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800">Review Produk</h3>
                </div>

                <div className="p-6">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-800">Produk berhasil ditambahkan!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Produk Anda telah berhasil ditambahkan dan siap untuk dijual.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={goToProductList}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Lihat Daftar Produk
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk Berhasil Ditambahkan!</h2>
            <p className="text-gray-600 mb-8">
              Produk baru telah berhasil ditambahkan ke katalog Anda. Apa yang ingin Anda lakukan selanjutnya?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToProductList}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4F46E5]/90 hover:to-[#7C3AED]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Lihat Daftar Produk
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#4F46E5] rounded-lg text-base font-medium text-[#4F46E5] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tambah Produk Lain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
