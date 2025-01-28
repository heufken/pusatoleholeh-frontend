import React, { useState, useEffect, createContext, useContext, useCallback, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../components/context/AuthContext';
import Header from '../../components/section/header';
import Sidebar from '../../components/dashboardseller/sidebar';
import Footer from '../../components/dashboardseller/footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Lazy load components
const Home = React.lazy(() => import('./home'));
const Produk = React.lazy(() => import('./produk'));
const DataToko = React.lazy(() => import('./datatoko'));
const Pesanan = React.lazy(() => import('./pesanan'));
const Keuangan = React.lazy(() => import('./keuangan'));
const ProfileSeller = React.lazy(() => import('./profile'));
const ProfilePopup = React.lazy(() => import('./ProfilePopup'));

export const ShopContext = createContext();
export const UserContext = createContext();

const DashboardSeller = () => {
  const [shopData, setShopData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback((url) => {
    if (!url) return null;
    const cleanedPath = url
      .replace(/^.*localhost:\d+\//, "/")
      .replace(/\\/g, "/");
    return `${cdnUrl}/${cleanedPath}`
      .replace(/\/\//g, "/")
      .replace(":/", "://");
  }, [cdnUrl]);

  const fetchData = useCallback(async () => {
    if (!token) {
      setError('Token tidak ditemukan');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const headers = { Authorization: `Bearer ${token}` };

      const [shopResponse, userResponse, addressResponse] = await Promise.all([
        axios.get(`${apiUrl}/shop`, { headers }),
        axios.get(`${apiUrl}/user`, { headers }),
        axios.get(`${apiUrl}/user/address`, { headers }),
      ]);

      setShopData({
        ...shopResponse.data.shop,
        shopImage: normalizeUrl(shopResponse.data.shopImage),
        shopBanner: normalizeUrl(shopResponse.data.shopBanner)
      });
      
      setUserData(userResponse.data.user || null);
      setAddressData(addressResponse.data.address || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, [apiUrl, token, cdnUrl, normalizeUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateAddressData = useCallback((newAddress) => {
    setAddressData(newAddress);
  }, []);

  const updateShopData = useCallback((newShopData) => {
    setShopData(newShopData);
  }, []);

  const isProfileIncomplete = !addressData || !shopData;

  const navigate = useNavigate();
  const handleClosePopup = () => {
    setPopupVisible(false);
    navigate(0);
  };

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const shouldShowPopup = initialLoadComplete && isProfileIncomplete && isPopupVisible;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-md">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-4/6 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ShopContext.Provider value={shopData}>
      <UserContext.Provider value={{ userData, addressData }}>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5">
          {/* Header */}
          <div className="sticky top-0 z-20">
            <Header toggleSidebar={toggleSidebar} />
          </div>

          {/* Main Content */}
          <div className="flex flex-1">
            {/* Content Area with right margin for sidebar */}
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
              <div className="p-6">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                      <LoadingSpinner />
                    </div>
                  }>
                    <Routes>
                      <Route path="home" element={<Home />} />
                      <Route path="produk" element={<Produk />} />
                      <Route path="datatoko" element={<DataToko />} />
                      <Route path="pesanan" element={<Pesanan />} />
                      <Route path="keuangan" element={<Keuangan />} />
                      <Route path="profile" element={<ProfileSeller />} />
                      <Route path="/" element={<Navigate to="home" />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
            />
          </div>

          {/* Footer */}
          <Footer />

          {/* Profile Popup */}
          {shouldShowPopup && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            }>
              <ProfilePopup
                onUpdateAddress={updateAddressData}
                onUpdateShop={updateShopData}
                onClose={handleClosePopup}
              />
            </Suspense>
          )}
        </div>
      </UserContext.Provider>
    </ShopContext.Provider>
  );
};

export default DashboardSeller;
