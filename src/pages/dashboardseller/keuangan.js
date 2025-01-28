import React, { useState } from 'react';
import { ArrowDownTrayIcon, ChartBarIcon, CurrencyDollarIcon, MagnifyingGlassIcon, BanknotesIcon, ArrowTrendingUpIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

// Register required components
ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

Modal.setAppElement('#root');

export default function Keuangan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Data dummy untuk grafik
  const data = {
    labels: ['30 May', '31 May', '01 Jun', '02 Jun', '03 Jun', '04 Jun', '05 Jun'],
    datasets: [
      {
        type: 'line',
        label: 'Jumlah Transaksi',
        data: [15, 20, 25, 20, 15, 10, 5],
        borderColor: '#2563EB', // Bright blue
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        type: 'line',
        label: 'Transaksi Berhasil',
        data: [10, 15, 20, 25, 20, 15, 10],
        borderColor: '#16A34A', // Green
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        type: 'bar',
        label: 'Pengeluaran',
        data: [500000, 1000000, 1500000, 1000000, 500000, 1000000, 1500000],
        backgroundColor: 'rgba(220, 38, 38, 0.2)', // Red
        borderColor: '#DC2626',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          color: '#4B5563'
        }
      },
      title: {
        display: true,
        text: 'Data Penjualan',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600'
        },
        color: '#374151'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Pengeluaran') {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#374151',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: 'Inter, system-ui, sans-serif'
        },
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          weight: '600'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          callback: function(value) {
            return value;
          },
          font: {
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      },
      x: {
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif'
          },
          color: '#6B7280'
        }
      }
    },
  };

  return (
    <div className="p-0 ">
       <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
          Halaman Keuangan
        </h1>
        <p className="text-gray-600 mb-6">Rangkuman keuangan anda</p>
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={toggleModal} 
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-2"
        >
          <BanknotesIcon className="w-5 h-5" />
          Ajukan Penarikan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Saldo</h2>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">Rp 10.000.000</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+15%</span> dari bulan lalu
          </p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Pesanan Berhasil</h2>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-[#4F46E5]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">150</p>
          <p className="text-sm text-gray-500">Dalam 30 hari terakhir</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Pendapatan Bulan Ini</h2>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-[#7C3AED]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">Rp 5.000.000</p>
          <p className="text-sm text-gray-500">Update terakhir: Hari ini</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
            Analitik Keuangan
          </h2>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-gray-600">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>3 Bulan Terakhir</option>
            </select>
          </div>
        </div>
        <Line data={data} options={options} className="min-h-[400px]" />
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Riwayat Transaksi
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 bg-gray-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 text-gray-600"
                >
                  <option>Semua</option>
                  <option>Pemasukan</option>
                  <option>Pengeluaran</option>
                </select>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105 gap-2">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left p-4 text-gray-600 font-medium">Tanggal</th>
                <th className="text-left p-4 text-gray-600 font-medium">Nominal</th>
                <th className="text-left p-4 text-gray-600 font-medium">Jenis</th>
                <th className="text-left p-4 text-gray-600 font-medium">Deskripsi</th>
                <th className="text-left p-4 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-700 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    01/01/2024
                  </td>
                  <td className="p-4 font-medium text-gray-900">Rp 1.000.000</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      index % 2 === 0 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {index % 2 === 0 ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">Penjualan Produk</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">
                      Berhasil
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Menampilkan 5 dari 50 transaksi</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                Sebelumnya
              </button>
              <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors duration-200">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-lg w-full mx-4 md:mx-auto mt-20 border border-gray-100"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start z-50"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
            Penarikan Dana
          </h2>
          <button 
            onClick={toggleModal}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-indigo-50/50 p-4 rounded-xl mb-6">
          <p className="text-gray-600">Saldo Tersedia</p>
          <p className="text-2xl font-bold text-gray-900">Rp 10.000.000</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Tujuan</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200">
              <option value="">Pilih Bank</option>
              <option value="bca">Bank BCA</option>
              <option value="mandiri">Bank Mandiri</option>
              <option value="bni">Bank BNI</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penarikan</label>
            <input
              type="text"
              placeholder="Masukkan jumlah"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
            <input
              type="text"
              placeholder="Masukkan nomor rekening"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={toggleModal} 
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Batal
          </button>
          <button 
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Ajukan Penarikan
          </button>
        </div>
      </Modal>
    </div>
  );
}
