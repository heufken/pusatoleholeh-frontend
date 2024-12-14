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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Daftar Alamat</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Alamat
        </button>
      </div>

      {/* Daftar Alamat */}
      <div className="grid gap-4">
        {Array.isArray(addressData) && addressData.map((address) => (
          <div key={address._id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{address.name}</h3>
                <p className="text-gray-600">
                  {address.subdistrict}, {address.district}, {address.city}
                </p>
                <p className="text-gray-600">
                  {address.province}, {address.postalCode}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(address)}
                  className="p-2 text-blue-500 hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[600px] p-6 rounded-xl shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Alamat' : 'Tambah Alamat Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Alamat
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kelurahan
                  </label>
                  <input
                    type="text"
                    name="subdistrict"
                    value={formData.subdistrict}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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