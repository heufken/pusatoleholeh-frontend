import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { UserContext } from './dashboardseller';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [message, setMessage] = useState('');
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
    <div className="p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">Profil Penjual</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="rounded-full w-full h-full object-cover border-4 border-blue-400"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                <CameraIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <h2 className="mt-2 text-lg font-semibold text-gray-700">
            {formData.name || 'Nama Tidak Diketahui'}
          </h2>
          <p className="text-gray-500">
            {formData.email || 'Email Tidak Diketahui'}
          </p>
          <button
            onClick={handleImageUpload}
            className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Mengunggah...' : existingImage ? 'Perbarui Foto' : 'Unggah Foto'}
          </button>
          {existingImage && (
            <button
              onClick={handleDeleteImage}
              className={`mt-2 ${
                isDeletingImage ? 'text-gray-400' : 'text-red-500'
              } hover:underline`}
              disabled={isDeletingImage}
            >
              {isDeletingImage ? 'Menghapus...' : 'Hapus Foto'}
            </button>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Masukkan nama Anda"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              required
              placeholder="Masukkan email Anda"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan password baru"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Konfirmasi password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Perbarui Profil
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSeller;
