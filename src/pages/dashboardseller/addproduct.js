import React, { useState } from 'react';

const AddProduct = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    quantity: 0,
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      image: e.target.files[0],
    });
  };

  const goToNextTab = () => {
    if (currentTab === 1) {
      console.log("Submitting description data:", productData);
    } else if (currentTab === 2) {
      console.log("Submitting image data:", productData.image);
    }
    setCurrentTab(currentTab + 1);
  };

  const goToPreviousTab = () => {
    setCurrentTab(currentTab - 1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Tambah Produk Baru</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentTab(1)}
          className={`px-6 py-2 ${currentTab === 1 ? 'font-bold border-b-4 border-green-500' : 'text-gray-500'}`}
        >
          Deskripsi Produk
        </button>
        <button
          onClick={() => setCurrentTab(2)}
          className={`px-6 py-2 ${currentTab === 2 ? 'font-bold border-b-4 border-green-500' : 'text-gray-500'}`}
        >
          Upload Gambar
        </button>
        <button
          onClick={() => setCurrentTab(3)}
          className={`px-6 py-2 ${currentTab === 3 ? 'font-bold border-b-4 border-green-500' : 'text-gray-500'}`}
        >
          Review Produk
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {currentTab === 1 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Deskripsi Produk</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Nama Produk</label>
              <input
                type="text"
                name="name"
                placeholder="Nama Produk"
                className="border p-2 w-full rounded-lg"
                value={productData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Deskripsi Produk</label>
              <textarea
                name="description"
                placeholder="Deskripsi Produk"
                className="border p-2 w-full rounded-lg"
                value={productData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Jumlah Produk</label>
              <input
                type="number"
                name="quantity"
                placeholder="Jumlah Produk"
                className="border p-2 w-full rounded-lg"
                value={productData.quantity}
                onChange={handleInputChange}
              />
            </div>
            <button
              onClick={goToNextTab}
              className="bg-green-500 text-white px-6 py-2 rounded-lg w-full"
            >
              Next
            </button>
          </div>
        )}

        {currentTab === 2 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Upload Gambar</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Upload Gambar Produk</label>
              <input
                type="file"
                className="border p-2 w-full rounded-lg"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={goToPreviousTab}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={goToNextTab}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentTab === 3 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Review Produk</h2>
            <div className="border p-4 rounded-lg mb-4 shadow-sm bg-gray-50">
              <h3 className="font-semibold">Nama Produk:</h3>
              <p className="mb-2">{productData.name}</p>
              <h3 className="font-semibold">Deskripsi:</h3>
              <p className="mb-2">{productData.description}</p>
              <h3 className="font-semibold">Jumlah:</h3>
              <p className="mb-2">{productData.quantity}</p>
              <h3 className="font-semibold">Gambar:</h3>
              {productData.image && (
                <img
                  src={URL.createObjectURL(productData.image)}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
            <button
              onClick={goToPreviousTab}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-4"
            >
              Back
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Submit Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
