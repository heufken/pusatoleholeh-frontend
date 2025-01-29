import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import toast from 'react-hot-toast';

const ProfilePopup = ({ onUpdateAddress, onUpdateShop, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    province: "",
    city: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });
  const [shopData, setShopData] = useState({
    shopName: "",
    description: "",
    username: "",
  });
  const [addressId, setAddressId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const { token } = useContext(AuthContext);

  const handleChange = (e, dataKey) => {
    const { name, value } = e.target;
    if (dataKey === "address") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (dataKey === "shop") {
      setShopData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${apiUrl}/user/address`, formData, { headers });
  
      let createdAddressId = response.data?.address?._id;
      if (!createdAddressId) {
        const getAddressResponse = await axios.get(`${apiUrl}/user/address`, { headers });
        const latestAddress = getAddressResponse.data.address?.[0];
        createdAddressId = latestAddress?._id;
      }
  
      if (!createdAddressId) throw new Error('Failed to retrieve address ID.');
  
      setAddressId(createdAddressId);
      toast.success('Address successfully saved!');
      onUpdateAddress(response.data.address);
  
      // Lanjut ke step berikutnya (form toko)
      setStep(4); // Karena sekarang form toko ada di step 4
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        name: shopData.shopName,
        description: shopData.description,
        addressId,
        username: shopData.username,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        subdistrict: formData.subdistrict,
        postalCode: formData.postalCode
      };
  
      const response = await axios.post(`${apiUrl}/shop/create`, payload, { headers });
  
      toast.success('Shop data successfully saved!');
      onUpdateShop(response.data.shop);
  
      // Ubah dari setStep(4) menjadi setStep(5)
      setStep(5);  // Beralih ke halaman konfirmasi selesai
    } catch (error) {
      console.error('Error saving shop data:', error);
      toast.error('Failed to save shop data. Please try again.');
    }
  };
  

  const handleNext = () => {
    setStep(step + 1);
  };

  // const handleSkip = () => {
  //   setStep(step + 1); // Skip to the next step
  // };

  // const togglePopup = () => {
  //   onClose(); // Close the popup
  // };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      handleNext(); // Skip jika tidak ada gambar yang dipilih
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      await axios.post(`${apiUrl}/user/image`, formData, { headers });
      toast.success('Profile picture uploaded successfully!');
      handleNext();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB dalam bytes
        toast.error('Image size must be less than 3MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size must be less than 3MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Selamat Datang!
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Mari lengkapi informasi akun Anda untuk pengalaman berbelanja yang lebih baik!
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Mulai
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Foto Profil
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Tambahkan foto profil untuk melengkapi identitas Anda
            </p>
            <div 
              className="border-2 border-dashed border-indigo-200 p-8 mb-6 text-center cursor-pointer rounded-xl hover:border-indigo-400 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {selectedImage ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-full mb-4"
                  />
                  <p className="text-indigo-600 font-medium">{selectedImage.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Klik atau seret foto di sini</p>
                  <p className="text-sm text-gray-500">Maksimal 3MB</p>
                </div>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <button
              onClick={handleImageUpload}
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Lanjutkan
            </button>
          </>
        )}

        {step === 3 && (
          <form onSubmit={handleAddressSubmit}>
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Alamat Anda
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Lengkapi informasi alamat untuk memudahkan pengiriman
            </p>
            {["name", "province", "city", "district", "subdistrict", "postalCode"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 capitalize">
                  {field === "postalCode" ? "Kode Pos" : field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  placeholder={`Masukkan ${field === "postalCode" ? "kode pos" : field}`}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Simpan Alamat
            </button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleShopSubmit}>
            <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Informasi Toko
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Lengkapi informasi toko Anda untuk mulai berjualan
            </p>
            {[
              { name: "shopName", label: "Nama Toko" },
              { name: "description", label: "Deskripsi" },
              { name: "username", label: "Username" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {field.name === "description" ? (
                  <textarea
                    name={field.name}
                    value={shopData[field.name]}
                    onChange={(e) => handleChange(e, "shop")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 min-h-[100px] resize-none"
                    placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={shopData[field.name]}
                    onChange={(e) => handleChange(e, "shop")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    required
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Simpan Informasi Toko
            </button>
          </form>
        )}

        {step === 5 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Selamat!
            </h2>
            <p className="mb-8 text-gray-600">
              Profil Anda telah lengkap. Sekarang Anda dapat mulai berjualan di platform kami.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium hover:from-[#4338CA] hover:to-[#6D28D9] transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Mulai Berjualan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
