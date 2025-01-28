import React, { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../components/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = ({ userData, userImage, onUpdateImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
      try {
        // Create URL object for parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
        
        // Get pathname from URL (part after host)
        const pathname = urlObj.pathname;
        
        // Combine with CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // If URL is invalid, try alternative method
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Remove protocol and host (fix escape character)
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Ensure only one leading slash

        return `${cdnUrl}${cleanPath}`;
      }
    },
    [cdnUrl]
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsPreviewModalOpen(true);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;

    const toastId = toast.loading('Mengunggah foto profil...');
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const method = userImage ? 'PUT' : 'POST';
      const endpoint = `${apiUrl}/user/image`;

      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Foto profil berhasil diperbarui!', { id: toastId });
      setIsPreviewModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
      window.location.reload();
    } catch (error) {
      toast.error(`Gagal mengupload: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  const handleDeleteImage = async () => {
    const toastId = toast.loading("Menghapus foto profil...");
    try {
      await axios.delete(`${apiUrl}/user/image`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Foto profil berhasil dihapus!", { id: toastId });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting profile image:', error);
      toast.error(`Gagal menghapus foto profil: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Profile Image Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
          <h3 className="text-2xl font-bold text-gray-900">Foto Profil</h3>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-1">
              {userImage ? (
                <img
                  src={normalizeUrl(userImage.url)}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-110">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
          {userImage && (
            <button
              onClick={handleDeleteImage}
              className="inline-flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
          <h3 className="text-2xl font-bold text-gray-900">Informasi Profil</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Nama</label>
            <p className="text-lg font-medium text-gray-900 mt-1">{userData.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg font-medium text-gray-900 mt-1">{userData.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Username</label>
            <p className="text-lg font-medium text-gray-900 mt-1">{userData.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Bergabung Sejak</label>
            <p className="text-lg font-medium text-gray-900 mt-1">{formatDate(userData.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900">Pratinjau Foto Profil</h4>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  setPreviewImage(null);
                  setSelectedFile(null);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImage}
                className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4F46E5]/90 transition-colors duration-300"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;