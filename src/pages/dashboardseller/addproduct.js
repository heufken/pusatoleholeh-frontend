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

  // Tambahkan state untuk upload
  const [uploadedFiles, setUploadedFiles] = useState({
    cover: null,
    products: []
  });
  const [isUploading, setIsUploading] = useState(false);

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
          
        }
      } catch (error) {
       
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

  const handleProductSubmit = async () => {
    const toastId = toast.loading("Menyimpan data produk...");
  
    try {
      if (!productData.name || !productData.price || !productData.stock || !productData.categoryId) {
        setErrorMessage("Semua field harus diisi dengan benar.");
        toast.error("Gagal menyimpan: pastikan semua data terisi.", { id: toastId });
        return;
      }
  
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
        setErrorMessage("Gagal membuat produk, ID produk tidak ditemukan.");
        toast.error("Gagal menyimpan produk. Coba lagi nanti.", { id: toastId });
        return;
      }
  
      setProductData((prevData) => ({
        ...prevData,
        id: productId,
      }));
  
      toast.success("Produk berhasil disimpan!", { id: toastId });
      setErrorMessage("");
      goToNextTab(); // Pindah ke tab berikutnya
    } catch (error) {
      
      setErrorMessage("Gagal menambahkan produk. Silakan coba lagi.");
      toast.error(`Gagal menyimpan produk: ${error.message}`, { id: toastId });
    }
  };

  const handleImageUpload = async () => {
    if (!productData.coverImage && productData.productImages.length === 0) {
      toast.error('Pilih minimal satu gambar untuk diupload');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Mengupload gambar...');

    try {
      // Upload cover image
      if (productData.coverImage) {
        const coverFormData = new FormData();
        coverFormData.append("image", productData.coverImage);
        await axios.post(
          `${apiUrl}/product/upload/cover/${productData.id}`,
          coverFormData,
          { headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }}
        );
      }

      // Upload product images
      if (productData.productImages.length > 0) {
        const imageFormData = new FormData();
        // Ubah nama field menjadi "image" (sesuaikan dengan backend)
        productData.productImages.forEach((file) => {
          imageFormData.append("image", file);
        });
        
        await axios.post(
          `${apiUrl}/product/upload/image/${productData.id}`, // Pastikan endpoint sesuai
          imageFormData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      setUploadSuccess(true);
      toast.success('Gambar berhasil diupload!', { id: toastId });
      goToNextTab(); // Otomatis pindah ke tab berikutnya setelah sukses
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(
        error.response?.data?.message || 'Gagal mengupload gambar', 
        { id: toastId }
      );
      setErrorMessage('Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!productData.id) {
      await handleProductSubmit();
    }
  
    await handleImageUpload();
  };

  // Fungsi untuk navigasi ke halaman daftar produk
  const goToProductList = () => {
    navigate("/dashboard-seller/produk"); // Redirect ke halaman daftar produk
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Tambah Produk Baru</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-8 mb-10">
          {["Deskripsi Produk", "Upload Gambar", "Review Produk"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setCurrentTab(index + 1)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200
                ${currentTab === index + 1 
                  ? "text-[#4F46E5]" 
                  : "text-gray-500 hover:text-gray-700"}
              `}
            >
              {tab}
              {currentTab === index + 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {currentTab === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Deskripsi Produk</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama produk"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-colors"
                    value={productData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
                  <textarea
                    name="description"
                    placeholder="Deskripsikan produk Anda"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-colors"
                    value={productData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        name="price"
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-colors"
                        value={productData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-colors"
                      value={productData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    name="categoryId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-colors"
                    value={productData.categoryId}
                    onChange={handleInputChange}
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

              {errorMessage && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]"
                >
                  Simpan & Lanjutkan
                </button>
              </div>
            </div>
          )}

          {currentTab === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Gambar</h2>
              
              <div className="space-y-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image 
                    {uploadedFiles.cover && 
                      <span className="text-green-500 ml-2">✓</span>
                    }
                  </label>
                  <div className="mt-1">
                    {uploadedFiles.cover ? (
                      <div className="relative group">
                        <img
                          src={uploadedFiles.cover.preview}
                          alt="Cover preview"
                          className="h-64 w-full object-cover rounded-lg border-2 border-[#4F46E5]"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center space-x-4">
                          <button
                            onClick={() => {
                              setUploadedFiles(prev => ({ ...prev, cover: null }));
                              setProductData(prev => ({ ...prev, coverImage: null }));
                              toast.success('Cover image dihapus');
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                          <label className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#7C3AED] transition-colors cursor-pointer">
                            Ganti
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, "cover")}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#4F46E5] transition-colors">
                        <div className="space-y-2 text-center">
                          <div className="mx-auto h-24 w-24 text-gray-400">
                            <svg className="h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#4F46E5] hover:text-[#7C3AED] focus-within:outline-none">
                              <span>Upload file</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleFileChange(e, "cover")}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                              />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP hingga 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                    {uploadedFiles.products.length > 0 && 
                      <span className="text-green-500 ml-2">
                        {uploadedFiles.products.length} gambar ✓
                      </span>
                    }
                  </label>
                  <div className="mt-1 space-y-4">
                    {uploadedFiles.products.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedFiles.products.map((file, index) => (
                          <div key={index} className="relative group aspect-w-1 aspect-h-1">
                            <img
                              src={file.preview}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#4F46E5] transition-colors"
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
                        <label className="relative group cursor-pointer">
                          <div className="h-full w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4F46E5] transition-colors">
                            <div className="text-center p-4">
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M8 14v20c0 4.418 3.582 8 8 8h20M20 8h20c4.418 0 8 3.582 8 8v20M4 4h4m4 0h4M4 8h4m4 0h4M4 12h4m4 0h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">Tambah Gambar</p>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={(e) => handleFileChange(e, "product")}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                            />
                          </div>
                        </label>
                      </div>
                    )}

                    {uploadedFiles.products.length === 0 && (
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#4F46E5] transition-colors">
                        <div className="space-y-2 text-center">
                          <div className="mx-auto h-24 w-24 text-gray-400">
                            <svg className="h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#4F46E5] hover:text-[#7C3AED] focus-within:outline-none">
                              <span>Upload files</span>
                              <input
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={(e) => handleFileChange(e, "product")}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                              />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP hingga 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading || (!productData.coverImage && productData.productImages.length === 0)}
                  className={`inline-flex items-center px-6 py-2.5 rounded-lg
                    ${isUploading || (!productData.coverImage && productData.productImages.length === 0)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90'
                    } text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengupload...
                    </>
                  ) : (
                    'Upload Gambar'
                  )}
                </button>
                {uploadSuccess && (
                  <button
                    onClick={goToNextTab}
                    className="px-6 py-2.5 text-[#4F46E5] border-2 border-[#4F46E5] font-medium rounded-lg hover:bg-[#4F46E5] hover:text-white transition-colors"
                  >
                    Lanjutkan
                  </button>
                )}
              </div>
            </div>
          )}

          {currentTab === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Produk</h2>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]"
                >
                  Lihat Daftar Produk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
