import React from 'react';

const DataToko = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Data Toko</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Nama Toko:</h2>
          <p>0123456789 -=+-</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Pemilik:</h2>
          <p>Dummy asdfghjkl ASDFGHJKL</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Alamat:</h2>
          <p>Dummy</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Nomor Telepon:</h2>
          <p>Dummy</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Status Toko:</h2>
          <p>
          Dummy
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Edit Data Toko
        </button>
      </div>
    </div>
  );
};

export default DataToko;
