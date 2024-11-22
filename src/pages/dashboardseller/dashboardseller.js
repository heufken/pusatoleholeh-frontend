import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/section/header';
import Sidebar from '../../components/dashboardseller/sidebar';
import Footer from '../../components/dashboardseller/footer';
import Home from './home';
import Produk from './produk';
import DataToko from './datatoko';
import Pesanan from './pesanan';
import Keuangan from './keuangan';
import { AuthContext } from '../../components/context/AuthContext';
import ProfilePopup from '../../components/landing/ProfilePopup';

export const ShopContext = createContext();
export const UserContext = createContext();

const DashboardSeller = () => {
  const [shopData, setShopData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(true); // State untuk kontrol popup

  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [shopResponse, userResponse, addressResponse] = await Promise.all([
          axios.get(`${apiUrl}/shop`, { headers }),
          axios.get(`${apiUrl}/user`, { headers }),
          axios.get(`${apiUrl}/user/address`, { headers }),
        ]);

        setShopData(shopResponse.data.shop || null);
        setUserData(userResponse.data.user || null);
        setAddressData(addressResponse.data.address || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) fetchData();
  }, [apiUrl, token]);

  const updateAddressData = (newAddress) => {
    setAddressData(newAddress);
  };

  const updateShopData = (newShopData) => {
    setShopData(newShopData);
  };

  // Cek apakah data address atau shop belum lengkap
  const isProfileIncomplete = !addressData || !shopData;

  // Fungsi untuk menutup popup
  const handleClosePopup = () => {
    setPopupVisible(false); // Sembunyikan popup setelah berhasil
  };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <ShopContext.Provider value={shopData}>
      <UserContext.Provider value={{ userData, addressData }}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-10">
            <Header toggleSidebar={toggleSidebar} />
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
             {/* Sidebar */}
             <div
              className={`bg-white shadow-md transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
              }`}
            >
              <Sidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-gradient-to-b from-red-200 via-red-50 to-gray-200 p-6 overflow-auto">
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="produk" element={<Produk />} />
                <Route path="datatoko" element={<DataToko />} />
                <Route path="pesanan" element={<Pesanan />} />
                <Route path="keuangan" element={<Keuangan />} />
                <Route path="/" element={<Navigate to="home" />} />
              </Routes>
            </div>
          </div>

          {/* Footer */}
          <Footer />

          {/* Profile Popup */}
          {isProfileIncomplete && isPopupVisible && (
            <ProfilePopup
              onUpdateAddress={updateAddressData}
              onUpdateShop={updateShopData}
              onClose={handleClosePopup} // Berikan fungsi onClose
            />
          )}
        </div>
      </UserContext.Provider>
    </ShopContext.Provider>
  );
};

export default DashboardSeller;
