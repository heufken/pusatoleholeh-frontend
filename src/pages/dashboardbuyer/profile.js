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
      const cleanedPath = url
        .replace(/^.*localhost:\d+\//, "/")
        .replace(/\\/g, "/");
      return `${cdnUrl}/${cleanedPath}`
        .replace(/\/\//g, "/")
        .replace(":/", "://");
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
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="mb-6">
          <div className="relative w-32 h-32 group">
            {userImage ? (
              <img
                src={normalizeUrl(userImage.url)}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-200"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex flex-col items-center justify-center space-y-2">
              <label className="cursor-pointer px-3 py-1 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition text-sm">
                {userImage ? 'Ubah Foto' : 'Upload Foto'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
              {userImage && (
                <button
                  onClick={handleDeleteImage}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nama</label>
            <p className="text-lg">{userData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{userData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <p className="text-lg capitalize">{userData.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Bergabung Sejak</label>
            <p className="text-lg">{formatDate(userData.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">
              Preview Foto Profil
            </h3>
            
            <div className="mb-4 w-32 h-32 mx-auto">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  setPreviewImage(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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