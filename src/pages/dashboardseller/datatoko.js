import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

const DataToko = () => {
  // State untuk mengelola tab yang aktif
  const [activeTab, setActiveTab] = useState('Informasi');
  // State untuk menyimpan catatan toko
  const [catatan, setCatatan] = useState([]);
  // State untuk mengontrol tampilan modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State untuk menyimpan input judul catatan
  const [judulCatatan, setJudulCatatan] = useState('');
  // State untuk menyimpan input isi catatan
  const [isiCatatan, setIsiCatatan] = useState('');

  // State untuk menyimpan informasi lokasi toko
  const [lokasi, setLokasi] = useState({
    alamat: 'Jalan Turi, Tempel',
    kota: 'Sleman',
    provinsi: 'Sleman',
    kodePos: '55735',
  });

  // State untuk mengontrol mode edit lokasi
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk mengubah informasi lokasi
  const handleLokasiChange = (e) => {
    const { name, value } = e.target;
    setLokasi((prevLokasi) => ({
      ...prevLokasi,
      [name]: value,
    }));
  };

  // Fungsi untuk toggle mode edit lokasi
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Fungsi untuk menambah catatan baru
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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Data Tokomu</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Tab navigasi */}
        <div className="tabs flex mb-6 border-b">
          {['Informasi', 'Jadwal Operasional', 'Catatan', 'Lokasi'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 pb-2 text-center ${
                activeTab === tab ? 'border-b-2 border-black font-semibold' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Konten untuk tab Informasi */}
        {activeTab === 'Informasi' && (
          <>
            <div className="informasi-toko mb-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Toko</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block mb-1">Nama Toko</label>
                  <input type="text" value="Toko Anu" className="w-full p-2 border rounded" />
                </div>
                <div className="form-group">
                  <label className="block mb-1">Slogan</label>
                  <input type="text" className="w-full p-2 border rounded" />
                </div>
                <div className="form-group">
                  <label className="block mb-1">Domain Toko</label>
                  <input type="text" value="Pusatoleholeh.Com/TokoAnu" className="w-full p-2 border rounded" />
                  <button className="mt-2 p-2 bg-white border border-gray-300 rounded">Ubah</button>
                </div>
                <div className="form-group">
                  <label className="block mb-1">Deskripsi</label>
                  <textarea className="w-full p-2 border rounded"></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="mt-4 p-2 bg-red-500 text-white rounded">Simpan</button>
              </div>
            </div>
            <hr className="my-6 border-gray-300" />
            <div className="gambar-toko mb-6">
              <h2 className="text-lg font-semibold mb-4">Gambar Toko</h2>
              <div className="flex items-center">
                <img src="path/to/image.jpg" alt="Gambar Toko" className="w-48 h-48 object-cover mr-4" />
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
        {activeTab === 'Lokasi' && (
          <div className="lokasi-toko mb-6">
            <h2 className="text-lg font-semibold mb-4">Lokasi Toko</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Alamat</label>
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
                <label className="block mb-1">Kota</label>
                <input
                  type="text"
                  name="kota"
                  value={lokasi.kota}
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
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tambah Catatan Toko</h2>
          <button onClick={() => setIsModalOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
          </button>
        </div>
        <input
          type="text"
          value={judulCatatan}
          onChange={(e) => setJudulCatatan(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Judul Catatan"
          maxLength={128}
        />
        <textarea
          value={isiCatatan}
          onChange={(e) => setIsiCatatan(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Informasi penting apa yang ingin kamu tulis?"
          maxLength={6000}
          rows={4}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 bg-white border border-gray-300 rounded mr-2"
          >
            Batal
          </button>
          <button
            onClick={tambahCatatan}
            className="p-2 bg-red-500 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DataToko;
