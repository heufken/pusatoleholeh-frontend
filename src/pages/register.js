import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg lg:flex overflow-hidden">
        {/* Bagian Kiri - Form */}
        <div className="w-full lg:w-1/2 p-8 relative">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <img src="/logo.png" alt="PusatOlehOleh Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">PusatOlehOleh</h1>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">Buat Akun Terlebih Dahulu</h2>
          <p className="text-sm text-gray-600 mb-6">
            Sudah Punya Akun?{" "}
            <button onClick={handleLoginRedirect} className="text-red-500 font-semibold">
              Masuk Sekarang!
            </button>
          </p>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan nama"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="repassword" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
              <input
                type="password"
                id="repassword"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan ulang password"
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white rounded-md py-3 px-4 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-6">
              Buat Akun
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
                  src="/google-icon.png"
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
          <img className="object-cover w-full h-full" src="/placeholder.jpg" alt="Placeholder" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
