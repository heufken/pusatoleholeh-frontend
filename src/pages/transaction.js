import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/section/header';
import { AuthContext } from '../components/context/AuthContext';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const $apiUrl = process.env.REACT_APP_API_BASE_URL;
  const { isAuthenticated, token, isLoading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${$apiUrl}/transaction`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(response.data.transactions);
      setStatuses(response.data.statuses);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching transactions');
      setLoading(false);
    }
  }, [$apiUrl, token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePayTransaction = async (transactionId, paymentId) => {
    try {
      await axios.put(
        `${$apiUrl}/transaction/${transactionId}/pay/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing payment');
    }
  };

  const handleCompleteTransaction = async (transactionId) => {
    try {
      await axios.put(
        `${$apiUrl}/transaction/${transactionId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing transaction');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Paid':
        return 'bg-red-100 text-red-800';
      case 'Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Processed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatus = useCallback((transactionId) => {
    const status = statuses.find(s => s.transactionId === transactionId);
    return status?.status || 'Unknown';
  }, [statuses]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10">
      <Header />
      <div className="container mx-auto px-4 py-6 mt-1 max-w-7xl">
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Transaksi Anda
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Pantau dan kelola semua transaksi Anda di satu tempat.</p>
        </div>
        
        <div className="grid gap-6">
          {transactions.map((transaction) => {
            const status = getTransactionStatus(transaction._id);
            return (
              <div key={transaction._id} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">ID: {transaction._id}</p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {status === 'Not Paid' && (
                      <button
                        onClick={() => handlePayTransaction(transaction._id, transaction.paymentId._id)}
                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                      >
                        <span>Bayar Sekarang</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    {status === 'Processed' && (
                      <button
                        onClick={() => handleCompleteTransaction(transaction._id)}
                        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                      >
                        <span>Selesaikan Pesanan</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    {status === 'Completed' && (
                      <span className="inline-flex items-center text-emerald-600 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Transaksi Selesai
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Metode Pembayaran</p>
                      <p className="text-base font-semibold text-gray-900">{transaction.paymentId.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Kurir</p>
                      <p className="text-base font-semibold text-gray-900">
                        {transaction.courierId.name}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          (Rp {transaction.courierId.cost.toLocaleString()})
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-sm font-medium text-gray-500">Total Pembayaran</p>
                      <p className="text-lg font-bold text-[#4F46E5]">
                        Rp {transaction.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {transaction.note && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-lg border border-[#4F46E5]/10">
                      <p className="text-sm font-medium text-gray-500 mb-1">Catatan:</p>
                      <p className="text-base text-gray-900">{transaction.note}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Transaction;