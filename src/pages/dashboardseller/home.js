import React, { useEffect, useState, useContext } from 'react';
import { ExclamationTriangleIcon, ChartBarIcon, EyeIcon, ShoppingCartIcon, CurrencyDollarIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../components/context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, loading, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">{label}</h2>
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <Icon className="w-6 h-6 text-[#4F46E5]" />
      </div>
    </div>
    {loading ? (
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-2/3"></div>
      </div>
    ) : (
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    )}
  </div>
);

const Home = () => {
  const [stats, setStats] = useState({
    transactions: {
      newOrders: 0,
      readyToShip: 0,
      totalSales: 0,
      newChats: 0,
      revenue: 0,
      visitors: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const transactionResponse = await axios.get(`${apiUrl}/transaction/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const transactionStats = transactionResponse.data.transactionStatuses.reduce((acc, transaction) => {
        switch (transaction.status) {
          case 'Paid':
            acc.newOrders++;
            break;
          case 'Processed':
            acc.readyToShip++;
            break;
          case 'Completed':
            acc.totalSales++;
            break;
          default:
            break;
        }
        return acc;
      }, { newOrders: 0, readyToShip: 0, totalSales: 0, newChats: 0 });

      setStats({
        transactions: transactionStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, apiUrl]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <ClockIcon className="h-5 w-5 mr-2" />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-2">
          Selamat Datang Kembali!
        </h1>
        <p className="text-gray-600">Berikut ringkasan aktivitas toko Anda hari ini</p>
      </div>
      
      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard
          label="Pesanan Baru"
          value={stats.transactions.newOrders}
          icon={ShoppingCartIcon}
          loading={loading}
          onClick={() => window.location.href = '/dashboard-seller/pesanan'}
        />
        <StatCard
          label="Siap Kirim"
          value={stats.transactions.readyToShip}
          icon={ShoppingCartIcon}
          loading={loading}
          onClick={() => window.location.href = '/dashboard-seller/pesanan'}
        />
        <StatCard
          label="Pendapatan"
          value={formatCurrency(stats.transactions.revenue || 0)}
          icon={CurrencyDollarIcon}
          loading={loading}
        />
        <StatCard
          label="Pengunjung"
          value={stats.transactions.visitors || 0}
          icon={UsersIcon}
          loading={loading}
        />
      </div>

      {/* Shop Statistics */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
            Statistik Toko
          </h2>
          <p className="text-gray-500 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Update Terakhir: {new Date().toLocaleString('id-ID', { 
              dateStyle: 'long', 
              timeStyle: 'short' 
            })}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Penjualan</h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-2/3"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-[#4F46E5] mb-2">{stats.transactions.totalSales}</p>
                  <p className="text-gray-600">Total Transaksi Selesai</p>
                </>
              )}
            </div>
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pesanan Baru</h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-2/3"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-[#4F46E5] mb-2">{stats.transactions.newOrders}</p>
                  <p className="text-gray-600">Menunggu Diproses</p>
                </>
              )}
            </div>
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan Bulan Ini</h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-2/3"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-[#4F46E5] mb-2">{formatCurrency(stats.transactions.revenue || 0)}</p>
                  <p className="text-gray-600">Total Pendapatan</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-6">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/dashboard-seller/produk" className="block">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <EyeIcon className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Kelola Produk</h3>
                  <p className="text-gray-600">
                    Tambah atau edit produk Anda
                  </p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/dashboard-seller/pesanan" className="block">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <ShoppingCartIcon className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Kelola Pesanan</h3>
                  <p className="text-gray-600">
                    Lihat dan proses pesanan masuk
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
