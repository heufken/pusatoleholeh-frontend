import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { UserContext } from './dashboardseller';
import { CameraIcon } from '@heroicons/react/24/outline';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-hot-toast';

const ProfileSeller = () => {
  const { token } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      const cleanedPath = url
        .replace(/^.*localhost:\d+\//, '/')
        .replace(/\\/g, '/');
      return `${cdnUrl}/${cleanedPath}`
        .replace(/\/\//g, '/')
        .replace(':/', '://');
    },
    [cdnUrl]
  );

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.image && response.data.image.length > 0) {
          setExistingImage(response.data.image[0]);
          setPreviewImage(normalizeUrl(response.data.image[0].url));
        }
      } catch (error) {
        console.error('Error fetching user image:', error);
      }
    };

    if (token) {
      fetchUserImage();
    }
  }, [token, apiUrl, normalizeUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const notify = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      notify('Password tidak cocok');
      return;
    }
    try {
      await axios.put(
        `${apiUrl}/user/update`,
        { name: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify('Profil berhasil diperbarui');
    } catch (error) {
      notify('Gagal memperbarui profil');
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      if (existingImage) {
        await axios.put(`${apiUrl}/user/image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        notify('Foto profil berhasil diperbarui');
      } else {
        await axios.post(`${apiUrl}/user/image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        notify('Foto profil berhasil diunggah');
      }

      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.image && response.data.image.length > 0) {
        setExistingImage(response.data.image[0]);
        setPreviewImage(normalizeUrl(response.data.image[0].url));
      }
    } catch (error) {
      notify(existingImage ? 'Gagal memperbarui foto profil' : 'Gagal mengunggah foto profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus foto profil?')) return;
    setIsDeletingImage(true);
    try {
      await axios.delete(`${apiUrl}/user/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingImage(null);
      setPreviewImage(null);
      setSelectedImage(null);
      notify('Foto profil berhasil dihapus');
    } catch (error) {
      notify('Gagal menghapus foto profil');
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-2">
          Data Pengguna
        </h1>
        <p className="text-gray-600">Kelola informasi profil Anda di sini</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#4F46E5]/20 group-hover:ring-[#4F46E5]/40 transition-all duration-300">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <CameraIcon className="w-12 h-12 text-[#4F46E5]/40" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label className="w-full h-full cursor-pointer flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <CameraIcon className="w-8 h-8 text-white" />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {formData.name || 'Nama Tidak Diketahui'}
            </h2>
            <p className="text-gray-500 mt-1">
              {formData.email || 'Email Tidak Diketahui'}
            </p>
          </div>

          <div className="mt-4 space-x-3">
            <button
              onClick={handleImageUpload}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </span>
              ) : existingImage ? 'Perbarui Foto' : 'Unggah Foto'}
            </button>
            {existingImage && (
              <button
                onClick={handleDeleteImage}
                disabled={isDeletingImage}
                className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingImage ? 'Menghapus...' : 'Hapus Foto'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all duration-300"
                required
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all duration-300"
                required
                placeholder="Masukkan email Anda"
              />
            </div>
            <div className="pt-6 border-t border-gray-100">
              <label className="block text-gray-700 font-medium mb-2">Password Baru</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all duration-300"
                placeholder="Kosongkan jika tidak ingin mengubah password"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all duration-300"
                placeholder="Konfirmasi password baru Anda"
              />
            </div>
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Perbarui Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSeller;
