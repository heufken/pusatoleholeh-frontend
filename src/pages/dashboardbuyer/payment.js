import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../components/context/AuthContext';
import { toast } from 'react-hot-toast';

const BalanceAndTopUp = ({ 
  paymentData, 
  selectedPayment, 
  setSelectedPayment, 
  amount, 
  setAmount, 
  handleAddCredit,
  formatCurrency,
  isLoading 
}) => (
  <div className="space-y-8">
    {/* Payment Methods List */}
    <div>
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
        <h3 className="text-2xl font-bold text-gray-900">Saldo Tersedia</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentData.length === 0 ? (
          <div className="col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">Belum ada metode pembayaran</p>
            <p className="text-sm text-gray-500">Tambahkan metode pembayaran untuk mulai bertransaksi</p>
          </div>
        ) : (
          paymentData.map((payment) => (
            <div
              key={payment._id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 group hover:-translate-y-1 transition-all duration-300 ${
                selectedPayment === payment._id ? 'ring-2 ring-[#4F46E5]' : ''
              }`}
              onClick={() => setSelectedPayment(payment._id)}
              role="button"
              tabIndex={0}
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Metode Pembayaran</span>
                <span className="text-xl font-medium text-gray-900 mb-4">{payment.name}</span>
                <span className="text-sm text-gray-600 mb-1">Saldo</span>
                <span className="text-2xl font-bold text-[#4F46E5]">
                  {formatCurrency(payment.credit || 0)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Top Up Form */}
    {paymentData.length > 0 && (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
          <h3 className="text-2xl font-bold text-gray-900">Top Up Saldo</h3>
        </div>
        <form onSubmit={handleAddCredit} className="space-y-6">
          <div>
            <label htmlFor="paymentSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Metode Pembayaran
            </label>
            <select
              id="paymentSelect"
              value={selectedPayment || ''}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
              disabled={isLoading}
            >
              <option value="">Pilih metode pembayaran</option>
              {paymentData.map((payment) => (
                <option key={payment._id} value={payment._id}>
                  {payment.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Top Up
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-white text-gray-900"
              disabled={isLoading || !selectedPayment}
              min="10000"
              step="10000"
            />
            <p className="text-sm text-gray-500 mt-2">Minimal top up Rp10.000</p>
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-[#4F46E5]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !selectedPayment || !amount || amount < 10000}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : 'Top Up Saldo'}
          </button>
        </form>
      </div>
    )}
  </div>
);

const ManagePaymentMethods = ({ 
  newPaymentName, 
  setNewPaymentName, 
  handleAddPayment,
  isLoading 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold mb-4">Tambah Metode Pembayaran</h3>
    <form onSubmit={handleAddPayment}>
      <div className="space-y-4">
        <div>
          <label htmlFor="paymentName" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Metode Pembayaran
          </label>
          <input
            id="paymentName"
            type="text"
            value={newPaymentName}
            onChange={(e) => setNewPaymentName(e.target.value)}
            placeholder="Contoh: Bank BCA, OVO, dll"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#4F46E5] focus:border-[#4F46E5]"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !newPaymentName.trim()}
        >
          {isLoading ? 'Memproses...' : 'Tambah Metode Pembayaran'}
        </button>
      </div>
    </form>
  </div>
);

const Payment = ({ paymentData, setDashboardData }) => {
  const [newPaymentName, setNewPaymentName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('balance');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPaymentName.trim()) {
      toast.error('Nama metode pembayaran harus diisi');
      return;
    }
    
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `${apiUrl}/user/payment`,
        { name: newPaymentName },
        { headers }
      );
      toast.success('Metode pembayaran berhasil ditambahkan');
      setNewPaymentName('');
      setDashboardData(prev => ({
        ...prev,
        paymentData: [...prev.paymentData, {
          _id: Date.now(),
          name: newPaymentName,
          credit: 0
        }]
      }));
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error(error.response?.data?.message || 'Gagal menambahkan metode pembayaran');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!selectedPayment || !amount) {
      toast.error('Pilih metode pembayaran dan masukkan jumlah');
      return;
    }
    if (amount < 10000) {
      toast.error('Minimal top up Rp10.000');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${apiUrl}/user/payment/${selectedPayment}?amount=${amount}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success('Top up berhasil');
      setAmount('');
      setSelectedPayment(null);
      
      // Refresh page to show updated balance
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding credit:', error);
      toast.error(error.response?.data?.message || 'Gagal melakukan top up');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      // Simulasi penghapusan payment method
      // Dalam implementasi nyata, ini akan memanggil API
      setDashboardData(prev => ({
        ...prev,
        paymentData: prev.paymentData.filter(p => p._id !== paymentId)
      }));
      
      toast.success('Metode pembayaran berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus metode pembayaran');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'balance'
              ? 'bg-white text-[#4F46E5] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Saldo & Top Up
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'manage'
              ? 'bg-white text-[#4F46E5] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Kelola Metode Pembayaran
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'balance' ? (
        <BalanceAndTopUp
          paymentData={paymentData}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          amount={amount}
          setAmount={setAmount}
          handleAddCredit={handleAddCredit}
          formatCurrency={formatCurrency}
          isLoading={isLoading}
        />
      ) : (
        <div>
          <ManagePaymentMethods
            newPaymentName={newPaymentName}
            setNewPaymentName={setNewPaymentName}
            handleAddPayment={handleAddPayment}
            isLoading={isLoading}
          />
          <div className="space-y-4">
            {paymentData.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Belum ada metode pembayaran yang tersimpan
              </p>
            ) : (
              paymentData.map((payment) => (
                <div
                  key={payment._id}
                  className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-sm text-gray-600">
                      Saldo: {formatCurrency(payment.credit || 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePayment(payment._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
