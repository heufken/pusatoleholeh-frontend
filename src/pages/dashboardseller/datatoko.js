import React, { useState, useContext, useEffect } from 'react';
import { ShopContext, UserContext } from './dashboardseller';  // Pastikan context sudah diimport
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { toast } from 'react-hot-toast';

Modal.setAppElement('#root');

const DataToko = () => {
  const shopData = useContext(ShopContext);  // Ambil data dari ShopContext
  const { addressData } = useContext(UserContext);  // Ambil data dari UserContext
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [activeTab, setActiveTab] = useState('Informasi');
  const [catatan, setCatatan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judulCatatan, setJudulCatatan] = useState('');
  const [isiCatatan, setIsiCatatan] = useState('');
  const [lokasi, setLokasi] = useState({
    alamat: '',
    subdistrict: '',
    district: '',
    city: '',
    provinsi: '',
    kodePos: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null); // 'logo' atau 'banner'
  const [shopDataState, setShopData] = useState(shopData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${apiUrl}/shop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setShopData(response.data.shop);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Gagal memuat data toko';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [apiUrl, token]);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      const userAddress = addressData[0];
      setLokasi({
        alamat: userAddress.name || '',
        subdistrict: userAddress.subdistrict || '',
        district: userAddress.district || '',
        city: userAddress.city || '',
        provinsi: userAddress.province || '',
        kodePos: userAddress.postalCode || '',
      });
    } else {
      console.log('No address found in userData');
    }
  }, [addressData]); // Mengambil data alamat saat addressData berubah

  const handleLokasiChange = (e) => {
    const { name, value } = e.target;
    setLokasi((prevLokasi) => ({
      ...prevLokasi,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const tambahCatatan = () => {
    if (judulCatatan.trim() && isiCatatan.trim()) {
      const newCatatan = {
        judul: judulCatatan,
        isi: isiCatatan,
        tanggal: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
      setCatatan([...catatan, newCatatan]);
      setJudulCatatan('');
      setIsiCatatan('');
      setIsModalOpen(false);
    }
  };

  // File validation
  const validateFile = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Hanya file JPG dan PNG yang diperbolehkan');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Ukuran file maksimal 5MB');
    }

    return true;
  };

  // Handle file selection with validation
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadError(null);

    try {
      if (file) {
        validateFile(file);
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          setIsPreviewModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setUploadError(error.message);
      e.target.value = null; // Reset input
    }
  };

  // Handle image upload
  const handleSaveImage = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    const toastId = toast.loading(`Mengupload ${uploadType === 'logo' ? 'logo' : 'banner'} toko...`);

    try {
      const formData = new FormData();
      if (uploadType === 'logo') {
        formData.append('image', selectedFile);
      } else {
        formData.append('banner', selectedFile);
      }

      const endpoint = uploadType === 'logo' ? '/shop/logo' : '/shop/banner';
      
      const response = await axios.post(`${apiUrl}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted);
        },
      });

      if (response.data) {
        // Fetch updated shop data
        const shopResponse = await axios.get(`${apiUrl}/shop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (shopResponse.data) {
          setShopData(shopResponse.data);
          toast.success(`${uploadType === 'logo' ? 'Logo' : 'Banner'} berhasil diupload`, {
            id: toastId,
          });
        }
        
        setIsPreviewModalOpen(false);
        setPreviewImage(null);
        setSelectedFile(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengupload gambar';
      setUploadError(errorMessage);
      toast.error(errorMessage, {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fungsi untuk menghapus logo
  const handleDeleteLogo = async () => {
    const toastId = toast.loading("Menghapus logo toko...");
    try {
      await axios.delete(`${apiUrl}/shop/logo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Logo toko berhasil dihapus!", { id: toastId });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error(`Gagal menghapus logo toko: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  // Fungsi untuk menghapus banner
  const handleDeleteBanner = async () => {
    const toastId = toast.loading("Menghapus banner toko...");
    try {
      await axios.delete(`${apiUrl}/shop/banner`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Banner toko berhasil dihapus!", { id: toastId });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(`Gagal menghapus banner toko: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  // Validate form fields
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name?.trim()) {
      errors.name = 'Nama toko wajib diisi';
    }
    
    if (!data.description?.trim()) {
      errors.description = 'Deskripsi toko wajib diisi';
    } else if (data.description.length < 10) {
      errors.description = 'Deskripsi toko minimal 10 karakter';
    }
    
    return errors;
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const errors = validateForm(shopDataState);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error('Mohon periksa kembali form anda');
        return;
      }

      const response = await axios.put(`${apiUrl}/shop/update`, {
        name: shopDataState.name,
        description: shopDataState.description
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Data toko berhasil diperbarui');
        setShopData(response.data.shop);
        setIsEditing(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data';
      toast.error(errorMessage);
      console.error('Error updating shop data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-2">
          Data Toko
        </h1>
        <p className="text-gray-600">Kelola informasi toko Anda di sini</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {['Informasi', 'Lokasi', 'Catatan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 relative font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-[#4F46E5]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="animate-pulse space-y-8">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
          
          {/* Tab Navigation Skeleton */}
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Preview Section Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-500 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4F46E5]/90 transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Muat Ulang</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/60 rounded-xl border border-gray-100">
          {/* Tab Informasi */}
          {activeTab === 'Informasi' && (
            <div className="p-6 space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Toko</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/* Nama Toko */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Toko <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={shopDataState?.name || ''}
                          onChange={(e) => setShopData({ ...shopDataState, name: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#4F46E5]'
                          } focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all duration-200`}
                          placeholder="Masukkan nama toko"
                          disabled={!isEditing}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                        )}
                      </div>

                      {/* Deskripsi */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          value={shopDataState?.description || ''}
                          onChange={(e) => setShopData({ ...shopDataState, description: e.target.value })}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#4F46E5]'
                          } focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all duration-200 resize-none`}
                          placeholder="Deskripsikan toko anda"
                          disabled={!isEditing}
                        />
                        {formErrors.description && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={toggleEdit}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                          isEditing
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white'
                        }`}
                      >
                        {isEditing ? 'Batal' : 'Edit'}
                      </button>
                      {isEditing && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2.5 ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-[#4F46E5]/90'
                          } text-white rounded-lg transition flex items-center space-x-2`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Menyimpan...</span>
                            </>
                          ) : (
                            <span>Simpan Perubahan</span>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
              
              {/* Section Banner */}
              <div className="relative h-64 bg-white/10 backdrop-blur-sm rounded-t-xl overflow-hidden group">
                {shopData?.shopBanner ? (
                  <img
                    src={shopData.shopBanner}
                    alt="Banner Toko"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-600/50 to-purple-600/50 backdrop-blur-sm flex items-center justify-center">
                    <p className="text-white/70">Belum ada banner toko</p>
                  </div>
                )}
                {/* Upload/Delete Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                      </svg>
                      Upload Banner
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          setUploadType('banner');
                          handleFileSelect(e);
                        }}
                      />
                    </label>
                    {shopData?.shopBanner && (
                      <button
                        onClick={handleDeleteBanner}
                        className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white relative group">
                      {shopData?.shopImage ? (
                        <img
                          src={shopData.shopImage}
                          alt="Logo Toko"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {/* Upload/Delete Controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                          <label className="cursor-pointer p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                              <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                            </svg>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                setUploadType('logo');
                                handleFileSelect(e);
                              }}
                            />
                          </label>
                          {shopData?.shopImage && (
                            <button
                              onClick={handleDeleteLogo}
                              className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">
                      <h1 className="text-2xl font-bold">{shopData?.name || "Nama Toko"}</h1>
                      <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {shopData?.address?.province || "Lokasi tidak tersedia"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Preview */}
              {isPreviewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                  <div className="bg-white w-full max-w-[800px] p-8 rounded-xl shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-semibold">
                        Preview {uploadType === 'logo' ? 'Logo' : 'Banner'} Toko
                      </h3>
                      <button
                        onClick={() => {
                          setIsPreviewModalOpen(false);
                          setPreviewImage(null);
                          setSelectedFile(null);
                          setUploadError(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {uploadError && (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                        {uploadError}
                      </div>
                    )}

                    <div className={`mb-6 ${uploadType === 'logo' ? 'w-48 h-48 mx-auto' : 'w-full h-[400px]'}`}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className={`${
                          uploadType === 'logo' 
                            ? 'w-full h-full object-cover rounded-full shadow-lg' 
                            : 'w-full h-full object-cover rounded-lg shadow-lg'
                        }`}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setIsPreviewModalOpen(false);
                          setPreviewImage(null);
                          setSelectedFile(null);
                          setUploadError(null);
                        }}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        disabled={isUploading}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveImage}
                        disabled={isUploading || !selectedFile}
                        className={`px-6 py-2.5 ${
                          isUploading || !selectedFile 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#4F46E5] hover:bg-[#4F46E5]/90'
                        } text-white rounded-lg transition flex items-center space-x-2`}
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Mengupload...</span>
                          </>
                        ) : (
                          <span>Simpan</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Lokasi dengan styling yang diperbarui */}
          {activeTab === 'Lokasi' && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Lokasi Toko</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(lokasi).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleLokasiChange}
                      className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200"
                      readOnly={!isEditing}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={toggleEdit}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isEditing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white'
                  }`}
                >
                  {isEditing ? 'Simpan' : 'Ubah'}
                </button>
              </div>
            </div>
          )}

          {/* Tab Catatan dengan styling yang diperbarui */}
          {activeTab === 'Catatan' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Catatan Toko</h2>
                  <p className="text-sm text-gray-600">Atur Catatan Toko Maksimal 10</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-white border border-[#4F46E5] text-[#4F46E5] rounded-xl hover:bg-[#4F46E5] hover:text-white transition-all duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Tambah Catatan
                </button>
              </div>
              <div className="bg-white/40 rounded-xl border border-gray-100 p-6">
                {catatan.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada catatan</h3>
                    <p className="text-gray-600">
                      Tambahkan catatan untuk meningkatkan kredibilitas toko Anda
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Tanggal</th>
                          <th className="text-left py-3 px-4">Judul</th>
                          <th className="text-right py-3 px-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catatan.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4">{item.tanggal}</td>
                            <td className="py-3 px-4">{item.judul}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button className="text-gray-600 hover:text-[#4F46E5]">
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </button>
                              <button className="text-gray-600 hover:text-red-500">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal dengan styling yang diperbarui */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white/95 backdrop-blur-sm p-8 rounded-xl border border-gray-100 max-w-[800px] w-full mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tambah Catatan</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="addNote" className="block text-sm font-medium text-gray-700 mb-2">
            Catatan
          </label>
          <textarea
            id="addNote"
            value={isiCatatan}
            onChange={(e) => setIsiCatatan(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200 resize-none"
            placeholder="Tulis catatan anda di sini..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setIsiCatatan('');
            }}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={tambahCatatan}
            disabled={!isiCatatan.trim()}
            className={`px-6 py-2.5 ${
              !isiCatatan.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4F46E5] hover:bg-[#4F46E5]/90'
            } text-white rounded-lg transition flex items-center space-x-2`}
          >
            <span>Simpan</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DataToko;
