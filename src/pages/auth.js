import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";

Modal.setAppElement("#root");

function AuthPage() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  console.log("Rendering AuthPage component");
  console.log("API URL:", apiUrl);

  const openModal = () => {
    console.log("Opening modal");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalIsOpen(false);
    setSelectedRole(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in with email:", email);

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      console.log("Login response:", response);

      const { token } = response.data;
      console.log("Received token:", token);

      // Simpan token dalam cookie
      Cookies.set("authToken", token, { expires: 1 });
      console.log("Token stored in cookies");

      // Mendekode token JWT untuk mendapatkan data dari payload
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      // Ambil role dari token yang telah didekode
      const role = decoded.role;  // Sesuaikan dengan struktur token Anda
      console.log("User role:", role);

      // Redirect berdasarkan role
      if (role === "buyer") {
        console.log("Navigating to home page");
        navigate("/");  // Arahkan ke halaman beranda untuk pembeli
      } else if (role === "seller") {
        console.log("Navigating to seller dashboard");
        navigate("/dashboard-seller");  // Arahkan ke halaman dashboard penjual
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login gagal. Silakan cek kembali nama dan password Anda.");
    }
  };

  const handleSubmit = () => {
    console.log("Selected role:", selectedRole);

    if (selectedRole === "user") {
      console.log("Navigating to register page");
      navigate("/register");
    } else if (selectedRole === "seller") {
      console.log("Navigating to register seller page");
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
            <button onClick={openModal} className="text-red-500 font-bold">
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Masukkan password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <button
                onClick={() => alert("Navigasi ke halaman lupa password")}
                className="text-red-500 text-sm"
              >
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300 font-medium"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 mb-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2" />
            Masuk dengan Google
          </button>

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
        <h3 className="text-sm font-normal mb-4 text-center">Pilih tipe akunmu, yuk!</h3>

        <div className="flex flex-col space-y-4 mb-6 w-full">
          <button
            onClick={() => setSelectedRole("user")}
            className={`px-4 py-2 rounded-md transition w-full ${
              selectedRole === "user" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            User
          </button>

          <div className="mt-4 mb-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedRole("seller")}
            className={`px-4 py-2 rounded-md transition w-full ${
              selectedRole === "seller" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Seller
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300 font-medium"
        >
          Lanjut
        </button>
      </Modal>
    </div>
  );
}

export default AuthPage;
