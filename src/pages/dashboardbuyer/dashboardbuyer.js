import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/context/AuthContext';
import axios from 'axios';
import Header from '../../components/section/header';
import Footer from '../../components/section/footer';
import Profile from './profile';
import Address from './address';
import Payment from './payment';
import { toast } from 'react-hot-toast';
import { UserIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const DashboardBuyer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    userData: null,
    userImage: null,
    addressData: [],
    paymentData: []
  });
  
  const { token, user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Protect route
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'buyer') {
      navigate('/');
      toast.error('Halaman ini hanya untuk pembeli');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [userResponse, paymentResponse] = await Promise.all([
          axios.get(`${apiUrl}/user`, { headers }),
          axios.get(`${apiUrl}/user/payment`, { headers }).catch(err => {
            // Handle payment method error separately
            if (err.response?.status === 404) {
              toast.error('Anda belum memiliki metode pembayaran');
              return { data: { paymentMethods: [] } };
            }
            throw err;
          })
        ]);
        
        setDashboardData({
          userData: userResponse.data.user,
          userImage: userResponse.data.image?.[0],
          addressData: userResponse.data.address || [],
          paymentData: paymentResponse.data.paymentMethods || []
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status !== 404) {
          setError('Terjadi kesalahan saat mengambil data');
          toast.error('Gagal memuat data dashboard');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token && isAuthenticated) {
      fetchDashboardData();
    }
  }, [token, apiUrl, isAuthenticated]);

  const navItems = [
    { path: 'profile', label: 'Biodata', icon: UserIcon },
    { path: 'address', label: 'Alamat', icon: MapPinIcon },
    { path: 'payment', label: 'Pembayaran', icon: CreditCardIcon }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Saya</h1>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap mb-8 bg-white/50 backdrop-blur-sm rounded-xl p-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 mr-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-600 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <Routes>
              <Route 
                path="profile" 
                element={
                  dashboardData.userData && (
                    <Profile 
                      userData={dashboardData.userData} 
                      userImage={dashboardData.userImage}
                    />
                  )
                } 
              />
              <Route 
                path="address" 
                element={
                  <Address 
                    addressData={dashboardData.addressData}
                    setDashboardData={setDashboardData}
                  />
                } 
              />
              <Route 
                path="payment" 
                element={
                  <Payment 
                    paymentData={dashboardData.paymentData}
                    setDashboardData={setDashboardData}
                  />
                } 
              />
              <Route path="/" element={<Navigate to="profile" replace />} />
            </Routes>
          </div>
        </main>

      <Footer />
    </div>
  );
};

export default DashboardBuyer;
