import React from 'react';

const Hero = () => {
  return (
    <div className="container mx-auto px-4 mt-6">
      <div
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(/placeholder.png)` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl font-semibold mb-4">Cari Oleh-Oleh Kesukaan Anda!</h1>
          <div className="flex items-center justify-center gap-2 bg-white rounded-full p-3 shadow-md max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Apa Yang Anda Inginkan?"
              className="w-full px-4 py-2 rounded-l-full text-black"
            />
            <button className="p-2 bg-gray-300 rounded-full">
              🔍
            </button>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {["Snack", "Kerajinan Tangan", "Souvenir", "Minuman"].map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white text-gray-700 rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
