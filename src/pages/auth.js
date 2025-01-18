import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "../components/context/AuthContext";

Modal.setAppElement("#root");

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Ambil fungsi login dari AuthContext
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRole(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      // Gunakan fungsi login dari AuthContext untuk menyimpan token dan memperbarui state global
      login(token);

      // Redirect berdasarkan role pengguna
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const role = decodedToken.role;

      if (role === "buyer") {
        navigate("/"); // Redirect ke halaman pembeli
      } else if (role === "seller") {
        navigate("/dashboard-seller"); // Redirect ke halaman penjual
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login gagal. Silakan cek kembali email dan password Anda.");
    }
  };

  const handleSubmit = () => {
    if (selectedRole === "user") {
      navigate("/register");
    } else if (selectedRole === "seller") {
      navigate("/register-seller");
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg lg:flex lg:gap-x-6 overflow-hidden">
        <div className="w-full lg:w-1/2 p-8 relative">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <img src="/logo.png" alt="PusatOlehOleh Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">PusatOlehOleh</h1>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">
            Masuk untuk eksplor oleh-oleh pilihan Nusantara!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Belum punya akun?{" "}
            <button onClick={openModal} className="text-[#4F46E5] font-bold hover:text-[#4338CA]">
              Daftar sekarang!
            </button>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <button className="text-[#4F46E5] text-sm hover:text-[#4338CA]">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white py-3 rounded-md hover:from-[#4338CA] hover:to-[#3730A3] transition duration-300 font-medium"
            >
              Masuk
            </button>
          </form>

          <footer className="mt-8 text-center text-xs text-gray-500">
            <p>© 2024 PusatOlehOleh. All Rights Reserved</p>
          </footer>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img className="object-cover w-full h-full" src="/placeholder.png" alt="Placeholder" />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Pilih Tipe Akun"
        className="modal bg-white p-8 rounded-lg shadow-lg max-w-md w-80 mx-auto flex flex-col items-center justify-center"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Mau daftar sebagai apa?</h2>
        <div className="flex flex-col space-y-4 mb-6 w-full">
          <button
            onClick={() => setSelectedRole("user")}
            className={`px-4 py-2 rounded-md transition w-full ${
              selectedRole === "user" 
                ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setSelectedRole("seller")}
            className={`px-4 py-2 rounded-md transition w-full ${
              selectedRole === "seller" 
                ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Seller
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white py-3 rounded-md hover:from-[#4338CA] hover:to-[#3730A3] transition duration-300 font-medium"
        >
          Lanjut
        </button>
      </Modal>
    </div>
  );
}

export default AuthPage;
