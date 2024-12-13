import React, { useState } from 'react';
import { ArrowDownTrayIcon, ChartBarIcon, CurrencyDollarIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

// Daftarkan komponen yang diperlukan
ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

Modal.setAppElement('#root');

const Keuangan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        type: 'line',
        label: 'Transaksi Berhasil',
        data: [10, 15, 20, 25, 20, 15, 10],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        type: 'bar',
        label: 'Pengeluaran',
        data: [500000, 1000000, 1500000, 1000000, 500000, 1000000, 1500000],
        backgroundColor: 'rgba(135, 206, 250, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Penjualan',
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
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value;
          }
        }
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Halaman Keuangan</h1>

      {/* Ringkasan Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Total Saldo</h2>
            <p className="text-2xl font-bold">Rp 10.000.000</p>
          </div>
          <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pesanan Berhasil</h2>
            <p className="text-2xl font-bold">150</p>
          </div>
          <ChartBarIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pendapatan Bulan Ini</h2>
            <p className="text-2xl font-bold">Rp 5.000.000</p>
          </div>
          <ChartBarIcon className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-white shadow rounded-lg border border-gray-300 mb-6">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center border rounded-lg p-2 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Cari Deskripsi Transaksi"
                className="ml-2 outline-none w-full"
              />
            </div>
            <div className="relative ml-4">
              <button className="flex items-center border rounded-lg p-2">
                <span className="mr-2">Filter Jenis</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <button className="flex items-center p-2 bg-blue-500 text-white rounded">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Unduh Laporan
          </button>
        </div>

        <table className="w-full border-t border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left p-4">Tanggal Transaksi</th>
              <th className="text-left p-4">Nominal</th>
              <th className="text-left p-4">Jenis Transaksi</th>
              <th className="text-left p-4">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-4">01/01/2024</td>
                <td className="p-4">Rp 1.000.000</td>
                <td className="p-4">Pemasukan</td>
                <td className="p-4">Penjualan Produk</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Penarikan Dana */}
      <button onClick={toggleModal} className="p-2 bg-green-500 text-white rounded mb-6">
        Ajukan Penarikan
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4">Penarikan Dana</h2>
        <p className="mb-2">Saldo Saat Ini: Rp 10.000.000</p>
        <select className="w-full p-2 border rounded mb-2">
          <option>Pilih Bank Tujuan</option>
          <option>Bank A</option>
          <option>Bank B</option>
        </select>
        <input
          type="text"
          placeholder="Jumlah Penarikan"
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex justify-end">
          <button onClick={toggleModal} className="p-2 bg-gray-300 rounded mr-2">
            Batal
          </button>
          <button className="p-2 bg-green-500 text-white rounded">
            Ajukan Penarikan
          </button>
        </div>
      </Modal>

      {/* Analitik Keuangan */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Analitik Keuangan</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Keuangan;
