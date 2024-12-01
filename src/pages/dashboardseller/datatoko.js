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
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
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

  // Fungsi untuk menangani preview file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsPreviewModalOpen(true);
    }
  };

  // Fungsi untuk menyimpan perubahan
  const handleSaveImage = async () => {
    if (!selectedFile) return;

    const toastId = toast.loading(`Mengunggah ${uploadType === 'logo' ? 'logo' : 'banner'} toko...`);
    const formData = new FormData();
    
    if (uploadType === 'logo') {
      formData.append('image', selectedFile);
    } else {
      formData.append('banner', selectedFile);
    }

    try {
      const method = uploadType === 'logo' ? 
        (shopData?.shopImage ? 'PUT' : 'POST') : 
        (shopData?.shopBanner ? 'PUT' : 'POST');
      
      const endpoint = `${apiUrl}/shop/${uploadType === 'logo' ? 'logo' : 'banner'}`;
      
      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`${uploadType === 'logo' ? 'Logo' : 'Banner'} toko berhasil diperbarui!`, { id: toastId });
      setIsPreviewModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
      window.location.reload();
    } catch (error) {
      toast.error(`Gagal mengupload: ${error.response?.data?.message || error.message}`, { id: toastId });
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

  // Tambahkan fungsi untuk menyimpan perubahan
  const saveChanges = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        name: shopDataState.name,
        description: shopDataState.description,
      };

      const response = await axios.put(`${apiUrl}/shop/update`, payload, { headers });
      setShopData(response.data.shop);
      toast.success('Data toko berhasil disimpan!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving shop data:', error);
      toast.error('Gagal menyimpan data toko. Silakan coba lagi.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Data Tokomu</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="tabs flex mb-6 border-b">
          {['Informasi', 'Jadwal Operasional', 'Catatan', 'Lokasi'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 pb-2 text-center ${activeTab === tab ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Informasi */}
        {activeTab === 'Informasi' && (
          <>
            <div className="informasi-toko mb-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Toko</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block mb-1">Nama Toko</label>
                  <input
                    type="text"
                    value={shopDataState?.name || ''}
                    onChange={(e) => setShopData({ ...shopDataState, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    readOnly={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-1">Domain Toko</label>
                  <input
                    type="text"
                    value={`Pusatoleholeh.Com/${shopDataState?.username || ''}`}
                    className="w-full p-2 border rounded"
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-1">Deskripsi</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={shopDataState?.description || ''}
                    onChange={(e) => setShopData({ ...shopDataState, description: e.target.value })}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                {isEditing ? (
                  <button onClick={saveChanges} className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Simpan
                  </button>
                ) : (
                  <button onClick={toggleEdit} className="mt-4 p-2 bg-red-500 text-white rounded">
                    Ubah
                  </button>
                )}
              </div>
            </div>
            <hr className="my-6 border-gray-300" />
            
            {/* Section Banner dan Logo */}
            <div className="shop-images mb-8">
              <h2 className="text-lg font-semibold mb-4">Preview Toko</h2>
              {/* Banner Section */}
              <div className="banner-section relative h-48 mb-6 group">
                {shopData?.shopBanner ? (
                  <img
                    src={shopData.shopBanner}
                    alt="Banner Toko"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Belum ada banner toko</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-4">
                  <label className="cursor-pointer px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition">
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
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Hapus Banner
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Section */}
              <div className="logo-section flex items-center space-x-4 shadow-md">
                <div className="relative w-32 h-32 group">
                  {shopData?.shopImage ? (
                    <img
                      src={shopData.shopImage}
                      alt="Logo Toko"
                      className="w-full h-full object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <p className="text-gray-500">No Logo</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex flex-col items-center justify-center space-y-2">
                    <label className="cursor-pointer px-3 py-1 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition text-sm">
                      Upload Logo
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
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{shopData?.name}</h1>
                  <p className="text-gray-600">{shopData?.description}</p>
                </div>
              </div>
            </div>

            {/* Modal Preview */}
            {isPreviewModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl">
                  <h3 className="text-xl font-semibold mb-4">
                    Preview {uploadType === 'logo' ? 'Logo' : 'Banner'} Toko
                  </h3>
                  
                  <div className={`mb-4 ${uploadType === 'logo' ? 'w-32 h-32 mx-auto' : 'w-full h-48'}`}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className={`${
                        uploadType === 'logo' 
                          ? 'w-full h-full object-cover rounded-full' 
                          : 'w-full h-full object-cover rounded-lg'
                      }`}
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
          </>
        )}

        {/* Konten untuk tab Jadwal Operasional */}
        {activeTab === 'Jadwal Operasional' && (
          <div className="jadwal-operasional mb-6">
            <h2 className="text-lg font-semibold mb-2">Jam Operasional</h2>
            <p className="text-sm text-gray-600 mb-4">
              Atur Jam Operasional Tokomu Secara Keseluruhan Selama Seminggu
            </p>
            <div className="flex items-center mb-6 border p-2 rounded">
              <span className="w-1/4">Senin - Minggu</span>
              <span className="w-px h-5 bg-gray-300 mx-2"></span>
              <span className="w-3/4 flex justify-between items-center">
                <span>Buka 24 Jam</span>
                <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5 text-gray-500 cursor-pointer" />
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Tanggal Libur</h2>
            <p className="text-sm text-gray-600 mb-4">
              Atur Tanggal Libur Tokomu Secara Keseluruhan Selama Seminggu
            </p>
            <div className="flex justify-end">
              <button className="p-2 bg-white border border-gray-300 rounded">Atur Tanggal</button>
            </div>
          </div>
        )}

        {/* Konten untuk tab Catatan */}
        {activeTab === 'Catatan' && (
          <div className="catatan-toko mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Catatan Toko</h2>
                <p className="text-sm text-gray-600">Atur Catatan Toko Maksimal 10</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center p-2 bg-white border border-red-500 text-red-500 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Catatan Toko
              </button>
            </div>
            <div className="border p-6 rounded">
              {catatan.length === 0 ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Kamu belum punya Catatan Toko</h3>
                  <p className="text-gray-600">
                    Yuk, tingkatkan kredibilitas toko dan produkmu dengan buat Catatan Toko untuk pembeli!
                  </p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="border-b p-2">TANGGAL UPDATE</th>
                      <th className="border-b p-2">JUDUL CATATAN</th>
                      <th className="border-b p-2">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catatan.map((item, index) => (
                      <tr key={index}>
                        <td className="border-b p-2">{item.tanggal}</td>
                        <td className="border-b p-2">{item.judul}</td>
                        <td className="border-b p-2">
                          <button className="mr-2">
                            <FontAwesomeIcon icon={faPencilAlt} className="text-gray-500" />
                          </button>
                          <button>
                            <FontAwesomeIcon icon={faTrash} className="text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Konten untuk tab Lokasi */}

        {/* Tab Lokasi */}
        {activeTab === 'Lokasi' && (
          <div className="lokasi-toko mb-6">
            <h2 className="text-lg font-semibold mb-4">Lokasi Toko</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Nama Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={lokasi.alamat}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block mb-1">Subdistrik</label>
                <input
                  type="text"
                  name="subdistrict"
                  value={lokasi.subdistrict}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block mb-1">Distrik</label>
                <input
                  type="text"
                  name="district"
                  value={lokasi.district}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block mb-1">Kota</label>
                <input
                  type="text"
                  name="city"
                  value={lokasi.city}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block mb-1">Provinsi</label>
                <input
                  type="text"
                  name="provinsi"
                  value={lokasi.provinsi}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label className="block mb-1">Kode Pos</label>
                <input
                  type="text"
                  name="kodePos"
                  value={lokasi.kodePos}
                  onChange={handleLokasiChange}
                  className="w-full p-2 border rounded"
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <button onClick={toggleEdit} className="p-2 bg-white border border-gray-300 rounded">
              {isEditing ? 'Simpan' : 'Ubah'}
            </button>
          </div>
        )}
      </div>

      {/* Modal untuk menambah catatan */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
      >
        <h2 className="text-lg font-semibold mb-4">Tambah Catatan</h2>
        <div>
          <label className="block mb-1">Judul</label>
          <input
            type="text"
            value={judulCatatan}
            onChange={(e) => setJudulCatatan(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <label className="block mb-1">Isi Catatan</label>
          <textarea
            value={isiCatatan}
            onChange={(e) => setIsiCatatan(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={tambahCatatan} className="p-2 bg-blue-500 text-white rounded mr-2">Simpan</button>
          <button onClick={() => setIsModalOpen(false)} className="p-2 bg-red-500 text-white rounded">Batal</button>
        </div>
      </Modal>
    </div>
  );
};

export default DataToko;
