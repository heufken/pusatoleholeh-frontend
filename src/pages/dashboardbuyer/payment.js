import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../components/context/AuthContext';

const BalanceAndTopUp = ({ 
  paymentData, 
  selectedPayment, 
  setSelectedPayment, 
  amount, 
  setAmount, 
  handleAddCredit,
  formatCurrency 
}) => (
  <div className="space-y-8">
    {/* Payment Methods List */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Saldo Tersedia</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentData.map((payment) => (
          <div
            key={payment._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm mb-1">Metode Pembayaran</span>
              <span className="font-medium text-lg mb-3">{payment.name}</span>
              <span className="text-gray-600 text-sm">Saldo</span>
              <span className="font-semibold text-xl text-green-600">
                {formatCurrency(payment.credit || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Up Form */}
    {paymentData.length > 0 && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Up Saldo</h3>
        <form onSubmit={handleAddCredit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="paymentSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Metode Pembayaran
              </label>
              <select
                id="paymentSelect"
                value={selectedPayment || ''}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Top Up
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan jumlah"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Top Up Saldo
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
);

const ManagePaymentMethods = ({ 
  newPaymentName, 
  setNewPaymentName, 
  handleAddPayment 
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Tambah Metode Pembayaran
        </button>
      </div>
    </form>
  </div>
);

const Payment = ({ paymentData }) => {
  const [newPaymentName, setNewPaymentName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('balance');
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPaymentName.trim()) return;
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `${apiUrl}/user/payment`,
        { name: newPaymentName },
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!selectedPayment || !amount) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `${apiUrl}/user/payment/${selectedPayment}?amount=${amount}`,
        {},
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.error('Error adding credit:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'balance'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Saldo & Top Up
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'manage'
              ? 'bg-white text-blue-600 shadow-sm'
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
        />
      ) : (
        <ManagePaymentMethods
          newPaymentName={newPaymentName}
          setNewPaymentName={setNewPaymentName}
          handleAddPayment={handleAddPayment}
        />
      )}
    </div>
  );
};

export default Payment; 