import React, { useState, useContext, useEffect } from 'react';
import { ShopContext, UserContext } from './dashboardseller';  // Pastikan context sudah diimport
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../components/context/AuthContext'; // Tambahkan impor ini

Modal.setAppElement('#root');

const DataToko = () => {
  const shopData = useContext(ShopContext);  // Ambil data dari ShopContext
  const { addressData } = useContext(UserContext);  // Ambil data dari UserContext
  const { token } = useContext(AuthContext); // Dapatkan token dari AuthContext
  const apiUrl = process.env.REACT_APP_API_BASE_URL; // Dapatkan apiUrl dari variabel lingkungan
  const cdnUrl = process.env.REACT_APP_CDN_URL; // Definisikan cdnUrl dengan variabel lingkungan yang sesuai

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
  const [shopDataState, setShopData] = useState(shopData); // Gunakan useState untuk shopData

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

  const saveChanges = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        name: shopDataState.name,
        description: shopDataState.description,
        // Tambahkan data lain yang ingin disimpan
      };

      const response = await axios.put(`${apiUrl}/shop/update`, payload, { headers });
      setShopData(response.data.shop); // Perbarui state dengan data terbaru
      toast.success('Data toko berhasil disimpan!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving shop data:', error);
      toast.error('Gagal menyimpan data toko. Silakan coba lagi.');
    }
  };

  // Fungsi untuk memastikan gambar dapat diakses
  const getImageUrl = (imagePath) => {
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }
    // Jika tidak ada URL lengkap, tambahkan domain atau base URL
    return `${cdnUrl}${imagePath}`;  // Sesuaikan dengan domain backend Anda
  };

  const tambahCatatan = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        title: judulCatatan,
        content: isiCatatan,
        // Tambahkan data lain yang diperlukan
      };

      await axios.post(`${apiUrl}/shop/notes`, payload, { headers });
      toast.success('Catatan berhasil ditambahkan!');
      setIsModalOpen(false);
      // Tambahkan logika untuk memperbarui state catatan jika diperlukan
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Gagal menambahkan catatan. Silakan coba lagi.');
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
                  <button onClick={saveChanges} className="mt-4 p-2 bg-blue-500 text-white rounded">Simpan</button>
                ) : (
                  <button onClick={toggleEdit} className="mt-4 p-2 bg-red-500 text-white rounded">Ubah</button>
                )}
              </div>
            </div>
            <hr className="my-6 border-gray-300" />
            
            {/* Gambar Banner Toko */}
            <div className="gambar-banner mb-6">
              <h2 className="text-lg font-semibold mb-4">Banner Toko</h2>
              <div className="flex items-center">
                <img
                  src={getImageUrl(shopDataState?.shopBanner)}
                  alt="Banner Toko"
                  className="w-full h-48 object-cover rounded mb-4"
                />
              </div>
            </div>

            {/* Gambar Toko */}
            <div className="gambar-toko mb-6">
              <h2 className="text-lg font-semibold mb-4">Gambar Toko</h2>
              <div className="flex items-center">
                <img
                  src={getImageUrl(shopDataState?.shopImage)}
                  alt="Gambar Toko"
                  className="w-48 h-48 object-cover mr-4"
                />
                <div>
                  <p className="mb-2">Ukuran Foto Harus 300x300</p>
                  <button className="p-2 bg-white border border-gray-300 rounded">Upload</button>
                </div>
              </div>
            </div>
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
