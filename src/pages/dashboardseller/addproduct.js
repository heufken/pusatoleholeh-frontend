import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../../components/context/AuthContext";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const AddProduct = () => {
  const { token } = useContext(AuthContext); // Mengambil token dari AuthContext
  const navigate = useNavigate(); // Hook untuk melakukan navigasi

  const [currentTab, setCurrentTab] = useState(1);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    coverImage: null,
    productImages: [],
    id: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false); // Menyimpan status upload gambar

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.categories) {
          setCategories(response.data.categories);
        } else {
          console.error("Kategori tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "cover") {
      setProductData({ ...productData, coverImage: files[0] });
    } else {
      setProductData({ ...productData, productImages: files });
    }
  };

  const goToNextTab = () => setCurrentTab(currentTab + 1);
  const goToPreviousTab = () => setCurrentTab(currentTab - 1);

  const handleProductSubmit = async () => {
    try {
      if (!productData.name || !productData.price || !productData.stock || !productData.categoryId) {
        setErrorMessage("Semua field harus diisi dengan benar.");
        return;
      }

      const productResponse = await axios.post(
        `${apiUrl}/product/create`,
        {
          name: productData.name,
          description: productData.description,
          price: parseInt(productData.price, 10),
          stock: parseInt(productData.stock, 10),
          categoryId: productData.categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productId = productResponse.data.product?._id;
      if (!productId) {
        console.error("Gagal membuat produk: ID produk tidak ditemukan.");
        setErrorMessage("Gagal membuat produk, ID produk tidak ditemukan.");
        return;
      }

      setProductData((prevData) => ({
        ...prevData,
        id: productId,
      }));

      setErrorMessage("");
      goToNextTab(); // Pindah ke tab berikutnya untuk upload gambar
    } catch (error) {
      console.error("Error saat menambahkan produk:", error);
      setErrorMessage("Gagal menambahkan produk. Silakan coba lagi.");
    }
  };

  const handleImageUpload = async () => {
    const { coverImage, productImages, id } = productData;

    if (!id) {
      console.error("ID produk tidak ditemukan. Tidak dapat mengunggah gambar.");
      setErrorMessage("Produk ID tidak ditemukan.");
      return;
    }

    try {
      if (coverImage) {
        const coverFormData = new FormData();
        coverFormData.append("image", coverImage);
        await axios.post(
          `${apiUrl}/product/upload/cover/${id}`,
          coverFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (productImages && productImages.length > 0) {
        const imageFormData = new FormData();
        productImages.forEach((file) => {
          imageFormData.append("image", file);
        });
        await axios.post(
          `${apiUrl}/product/upload/image/${id}`,
          imageFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setUploadSuccess(true); // Tandai upload berhasil
    } catch (error) {
      console.error("Error saat mengunggah gambar:", error);
      setErrorMessage("Gagal mengunggah gambar. Silakan coba lagi.");
    }
  };

  const handleSubmit = async () => {
    if (!productData.id) {
      await handleProductSubmit();
    }

    await handleImageUpload();
  };

  // Fungsi untuk navigasi ke halaman daftar produk
  const goToProductList = () => {
    navigate("/dashboard-seller/produk"); // Redirect ke halaman daftar produk
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Tambah Produk Baru</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {["Deskripsi Produk", "Upload Gambar", "Review Produk"].map((tab, index) => (
          <button
            key={index}
            onClick={() => setCurrentTab(index + 1)}
            className={`px-6 py-2 ${
              currentTab === index + 1 ? "font-bold border-b-4 border-green-500" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
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
              <label className="block mb-2 font-semibold">Harga Produk</label>
              <input
                type="number"
                name="price"
                placeholder="Harga Produk"
                className="border p-2 w-full rounded-lg"
                value={productData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Stok Produk</label>
              <input
                type="number"
                name="stock"
                placeholder="Stok Produk"
                className="border p-2 w-full rounded-lg"
                value={productData.stock}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Kategori</label>
              <select
                name="categoryId"
                className="border p-2 w-full rounded-lg"
                value={productData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        )}

        {currentTab === 2 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Upload Gambar</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Cover Image</label>
              <input
                type="file"
                className="border p-2 w-full rounded-lg"
                onChange={(e) => handleFileChange(e, "cover")}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Product Images</label>
              <input
                type="file"
                multiple
                className="border p-2 w-full rounded-lg"
                onChange={(e) => handleFileChange(e, "product")}
              />
            </div>
            <button
              onClick={handleImageUpload}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Upload Gambar
            </button>
            {uploadSuccess && (
              <button
                onClick={goToNextTab}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
              >
                Next
              </button>
            )}
          </div>
        )}

        {currentTab === 3 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Review Produk</h2>
            {productData.id && (
              <div>
                <h3 className="font-semibold">Nama Produk: {productData.name}</h3>
                <p>Deskripsi: {productData.description}</p>
                <p>Harga: {productData.price}</p>
                <p>Stok: {productData.stock}</p>
                <p>Kategori: {productData.categoryId}</p>
              </div>
            )}
            <button
              onClick={goToProductList}
              className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
