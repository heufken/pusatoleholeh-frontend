import React from "react";

function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form Section */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-start px-8 md:px-16">
        <div className="mb-8 mt-12 md:mt-0">
          <img src="/logo.png" alt="PusatOlehOleh Logo" className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-avenir font-bold mb-2">
          Masuk Terlebih Dahulu
        </h2>
        <p className="text-gray-600 mb-4 font-avenir text-left">
          Belum punya akun?{" "}
          <button
            onClick={() => alert("Navigasi ke halaman daftar")}
            className="text-red-500"
          >
            Daftar sekarang!
          </button>
        </p>

        <form className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 font-avenir">Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-avenir">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="text-right mb-4">
            <button
              onClick={() => alert("Navigasi ke halaman lupa password")}
              className="text-red-500"
            >
              Lupa password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-custom-red text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 font-avenir font-medium"
          >
            Masuk
          </button>

          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-avenir font-medium">
              atau
            </p>
          </div>

          <button
            type="button"
            className="w-full mt-3 border border-gray-300 py-2 rounded-lg flex items-center justify-center hover:bg-gray-100 transition duration-300 font-avenir font-medium"
          >
            <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
            Masuk dengan Google
          </button>
        </form>

        <footer className="mt-16 mb-8 text-gray-500 text-left">
          <p>© 2024 PusatOlehOleh</p>
        </footer>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-gray-100">
        <img
          src="/placeholder.jpg"
          alt="Display"
          className="w-3/4 h-auto object-contain rounded-r-lg"
        />
      </div>
    </div>
  );
}

export default AuthPage;
