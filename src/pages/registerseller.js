import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function RegisterSellerPage() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // State untuk input formulir
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tangani perubahan input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Tangani pengiriman formulir
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, repassword } = formData;

    // Validasi password dan repassword
    if (password !== repassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register/seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registrasi berhasil!");
        navigate("/login");
      } else {
        setError(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg lg:flex lg:gap-x-6 overflow-hidden">
        {/* Bagian Kiri - Form */}
        <div className="w-full lg:w-1/2 p-8 relative">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <img src="/logo.png" alt="PusatOlehOleh Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">PusatOlehOleh</h1>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">Buat akunmu dulu, yuk?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Sudah punya akun, nih?{" "}
            <button onClick={handleLoginRedirect} className="text-red-500 font-semibold">
              Masuk aja sekarang!
            </button>
          </p>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan nama"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="repassword" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
              <input
                type="password"
                id="repassword"
                value={formData.repassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan ulang password"
              />
            </div>

            <div className="text-right">
              <button className="text-red-500 text-sm">Lupa password?</button>
            </div>

            <button
              type="submit"
              className={`w-full bg-red-600 text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-6 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Buat Akun"}
            </button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <img
                className="h-5 w-5 mr-2"
                src="/google.svg"
                alt="Google logo"
              />
              Daftar dengan Google
            </button>
          </div>

          <footer className="mt-8 text-center text-xs text-gray-500">
            <p>© 2024 PusatOlehOleh. All Rights Reserved</p>
          </footer>
        </div>

        {/* Bagian Kanan - Gambar */}
        <div className="hidden lg:block lg:w-1/2">
          <img className="object-cover w-full h-full" src="/placeholder.png" alt="Placeholder" />
        </div>
      </div>
    </div>
  );
}

export default RegisterSellerPage;
