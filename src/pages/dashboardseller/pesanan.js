import React, { useState, useEffect, useContext, useCallback } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, EyeIcon, PrinterIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';

const Pesanan = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    'Not Paid': 0,
    'Paid': 0,
    'Processed': 0,
    'Completed': 0,
    'Cancelled': 0
  });

  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/transaction/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactionStatuses);
      
      // Count transactions by status
      const counts = response.data.transactionStatuses.reduce((acc, transaction) => {
        acc[transaction.status] = (acc[transaction.status] || 0) + 1;
        return acc;
      }, {});
      setStatusCounts(counts);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching transactions');
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleProcessTransaction = async (transactionId) => {
    try {
      await axios.put(
        `${apiUrl}/transaction/${transactionId}/process`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchTransactions(); // Refresh data after processing
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing transaction');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Dummy data untuk informasi tambahan
  const getDummyInfo = (transactionId) => ({
    buyerName: `Pembeli ${transactionId.slice(-4)}`,
    productName: `Produk ${transactionId.slice(-4)}`,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Halaman Pesanan</h1>

      {/* Ringkasan Pesanan */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {['Not Paid', 'Paid', 'Processed', 'Completed', 'Cancelled'].map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{status}</h2>
              <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </div>
        ))}
      </div>

      {/* Tabel Daftar Pesanan */}
      <div className="bg-white shadow rounded-lg border border-gray-300">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center border rounded-lg p-2 w-full md:w-1/3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Cari Nomor Pesanan, Nama Pembeli, atau Produk"
                className="ml-2 outline-none w-full"
              />
            </div>
            <div className="relative ml-4">
              <button
                className="flex items-center border rounded-lg p-2"
                onClick={toggleDropdown}
              >
                <span className="mr-2">Filter Status</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <ul>
                    {['Semua', 'Not Paid', 'Paid', 'Processed', 'Completed', 'Cancelled'].map((status) => (
                      <li
                        key={status}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <table className="w-full border-t border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4">Nomor Pesanan</th>
              <th className="text-left p-4">Nama Pembeli</th>
              <th className="text-left p-4">Produk</th>
              <th className="text-center p-4">Total Harga</th>
              <th className="text-center p-4">Tanggal Pesanan</th>
              <th className="text-center p-4">Status Pesanan</th>
              <th className="text-center p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const dummyInfo = getDummyInfo(transaction.transactionId);
              return (
                <tr key={transaction._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="p-4">{transaction.transactionId}</td>
                  <td className="p-4">{dummyInfo.buyerName}</td>
                  <td className="p-4">{dummyInfo.productName}</td>
                  <td className="p-4 text-center">Rp {transaction.totalPrice?.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-center">
                    {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                      transaction.status === 'Processed' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {transaction.status === 'Paid' && (
                      <button
                        onClick={() => handleProcessTransaction(transaction.transactionId)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 text-sm"
                      >
                        Process
                      </button>
                    )}
                    <button className="mr-2" title="Lihat Detail">
                      <EyeIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button title="Cetak Invoice">
                      <PrinterIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pesanan;
