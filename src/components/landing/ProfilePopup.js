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
  
      // Setelah alamat berhasil disimpan, lanjutkan ke tab 3 (form untuk data toko)
      setStep(3); // Ganti ke tab 3
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
      };
  
      const response = await axios.post(`${apiUrl}/shop/create`, payload, { headers });
  
      toast.success('Shop data successfully saved!');
      onUpdateShop(response.data.shop);
  
      // Beralih ke tab 4 setelah berhasil menyimpan data toko
      setStep(4);  // Beralih ke tab 4 (konfirmasi selesai)
    } catch (error) {
      console.error('Error saving shop data:', error);
      toast.error('Failed to save shop data. Please try again.');
    }
  };
  

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSkip = () => {
    setStep(step + 1); // Skip to the next step
  };

  const togglePopup = () => {
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full md:w-1/2">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Complete your profile!</h2>
            <p className="mb-6">Please complete your account information to access the website!</p>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Okay
            </button>
          </>
        )}
        {step === 2 && (
          <form onSubmit={handleAddressSubmit}>
            <h2 className="text-xl font-bold mb-4">Tell us about your address</h2>
            {[ "name", "province", "city", "district", "subdistrict", "postalCode" ].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleChange(e, "address")}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Save Address
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleShopSubmit}>
            <h2 className="text-xl font-bold mb-4">Complete Your Shop Information</h2>
            {["shopName", "description", "username"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 capitalize">{field === "shopName" ? "Name" : field}</label>
                <input
                  type="text"
                  name={field}
                  value={shopData[field]}
                  onChange={(e) => handleChange(e, "shop")}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Save Shop Data
            </button>
          </form>
        )}
        {step === 4 && (
          <>
            <h2 className="text-xl font-bold mb-4">Profile setup completed!</h2>
            <p className="mb-6">You can now browse the website and shop freely.</p>
            <div className="flex justify-center mb-6">
              <span className="text-4xl">✔️</span>
            </div>
            <button
               onClick={onClose}  // Menutup popup setelah konfirmasi
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Let's Go
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
