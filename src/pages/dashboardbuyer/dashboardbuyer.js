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
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [userResponse, paymentResponse] = await Promise.all([
          axios.get(`${apiUrl}/user`, { headers }),
          axios.get(`${apiUrl}/user/payment`, { headers })
        ]);
        
        setDashboardData({
          userData: userResponse.data.user,
          userImage: userResponse.data.image?.[0],
          addressData: userResponse.data.address || [],
          paymentData: paymentResponse.data.paymentMethods || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
        toast.error('Gagal memuat data dashboard');
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
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard Saya</h1>
            {dashboardData.userImage && (
              <img
                src={dashboardData.userImage}
                alt="Profile"
                className="w-10 h-10 rounded-full ml-4 object-cover border-2 border-blue-500"
              />
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b mb-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mr-4 transition-colors ${
                    isActive
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Routes */}
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
