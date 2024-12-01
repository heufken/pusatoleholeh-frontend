import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { UserContext } from './dashboardseller';

const ProfileSeller = () => {
  const { token } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [existingImage, setExistingImage] = useState(null);

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      const cleanedPath = url
        .replace(/^.*localhost:\d+\//, "/")
        .replace(/\\/g, "/");
      return `${cdnUrl}/${cleanedPath}`
        .replace(/\/\//g, "/")
        .replace(":/", "://");
    },
    [cdnUrl]
  );

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` }
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

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handler untuk pemilihan gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handler untuk update profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${apiUrl}/user/update`,
        { name: formData.name },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setMessage('Profil berhasil diperbarui');
    } catch (error) {
      setMessage('Gagal memperbarui profil');
    }
  };

  // Handler untuk upload/update gambar
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      if (existingImage) {
        await axios.put(
          `${apiUrl}/user/image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setMessage('Foto profil berhasil diperbarui');
      } else {
        await axios.post(
          `${apiUrl}/user/image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setMessage('Foto profil berhasil diunggah');
      }
      
      // Refresh data image dan gunakan normalizeUrl
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.image && response.data.image.length > 0) {
        setExistingImage(response.data.image[0]);
        setPreviewImage(normalizeUrl(response.data.image[0].url));
      }
    } catch (error) {
      setMessage(existingImage ? 'Gagal memperbarui foto profil' : 'Gagal mengunggah foto profil');
    }
  };

  // Tambahkan handler untuk menghapus foto profil
  const handleDeleteImage = async () => {
    try {
      await axios.delete(`${apiUrl}/user/image`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExistingImage(null);
      setPreviewImage(null);
      setSelectedImage(null);
      setMessage('Foto profil berhasil dihapus');
    } catch (error) {
      setMessage('Gagal menghapus foto profil');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profil Pengguna</h2>
      
      {/* Form Profil */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Perbarui Profil
        </button>
      </form>

      {/* Upload Foto Profil */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Foto Profil</h3>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            <button
              onClick={handleImageUpload}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              {existingImage ? 'Perbarui Foto' : 'Upload Foto'}
            </button>
            {existingImage && (
              <button
                onClick={handleDeleteImage}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Hapus Foto
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pesan Status */}
      {message && (
        <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700">
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfileSeller;
