import React, { useState, useContext } from 'react';
import { AuthContext } from '../../components/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const Address = ({ addressData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
    postalCode: ''
  });
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      province: '',
      city: '',
      district: '',
      subdistrict: '',
      postalCode: ''
    });
    setSelectedAddress(null);
    setIsEditing(false);
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setFormData(address);
      setSelectedAddress(address);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(isEditing ? 'Memperbarui alamat...' : 'Menambah alamat...');

    try {
      if (isEditing && selectedAddress) {
        await axios.put(
          `${apiUrl}/user/address/${selectedAddress._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Alamat berhasil diperbarui!', { id: toastId });
      } else {
        await axios.post(
          `${apiUrl}/user/address`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Alamat berhasil ditambahkan!', { id: toastId });
      }
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      toast.error(`Gagal ${isEditing ? 'memperbarui' : 'menambahkan'} alamat: ${error.response?.data?.message || error.message}`, { id: toastId });
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      const toastId = toast.loading('Menghapus alamat...');
      try {
        await axios.delete(`${apiUrl}/user/address/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Alamat berhasil dihapus!', { id: toastId });
        window.location.reload();
      } catch (error) {
        toast.error(`Gagal menghapus alamat: ${error.response?.data?.message || error.message}`, { id: toastId });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
          <h3 className="text-2xl font-bold text-gray-900">Daftar Alamat</h3>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Tambah Alamat
        </button>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addressData.length === 0 ? (
          <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">Belum ada alamat tersimpan</p>
            <p className="text-sm text-gray-500">Tambahkan alamat untuk memudahkan proses pengiriman</p>
          </div>
        ) : (
          addressData.map((address) => (
            <div
              key={address._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1"
            >
              <div className="mb-4">
                <h4 className="text-xl font-medium text-gray-900 mb-2">{address.name}</h4>
                <div className="space-y-1 text-gray-600">
                  <p>{address.subdistrict}, {address.district}</p>
                  <p>{address.city}, {address.province}</p>
                  <p>Kode Pos: {address.postalCode}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleOpenModal(address)}
                  className="inline-flex items-center px-4 py-2 text-[#4F46E5] hover:text-[#4F46E5]/80 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Alamat' : 'Tambah Alamat'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label Alamat
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  placeholder="Contoh: Rumah, Kantor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota/Kabupaten
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelurahan
                </label>
                <input
                  type="text"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4F46E5]/90 transition-colors duration-300"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;