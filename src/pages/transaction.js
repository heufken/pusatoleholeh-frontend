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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
        
        <div className="grid gap-4">
          {transactions.map((transaction) => {
            const status = getTransactionStatus(transaction._id);
            return (
              <div key={transaction._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-semibold">Transaction ID: {transaction._id}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {status === 'Not Paid' && (
                      <button
                        onClick={() => handlePayTransaction(transaction._id, transaction.paymentId._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                    {status === 'Processed' && (
                      <button
                        onClick={() => handleCompleteTransaction(transaction._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Complete Order
                      </button>
                    )}
                    {status === 'Completed' && (
                      <span className="text-green-600 font-medium">
                        Transaction Completed ✓
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Additional Transaction Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Payment Method:</p>
                      <p className="font-medium">{transaction.paymentId.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Courier:</p>
                      <p className="font-medium">{transaction.courierId.name} (Rp {transaction.courierId.cost.toLocaleString()})</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Total Price:</p>
                      <p className="font-medium">Rp {transaction.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  {transaction.note && (
                    <div className="mt-2">
                      <p className="text-gray-600">Note:</p>
                      <p className="font-medium">{transaction.note}</p>
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