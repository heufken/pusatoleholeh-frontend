import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      <div
        className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(/placeholder.png)` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
            Cari Oleh-Oleh Kesukaan Anda!
          </h1>
          <form onSubmit={handleSearch} className="flex items-center justify-center gap-2 bg-white rounded-full p-2 sm:p-3 shadow-md max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Lagi mau cari apa hari ini?"
              className="w-full px-3 py-2 text-sm md:text-base rounded-l-full rounded-r-full text-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {["Bakpia", "Pie Susu", "Gelang", "Kaos"].map((tag, index) => (
              <span
                key={index}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 text-xs md:text-sm bg-white text-gray-700 rounded-full shadow-sm cursor-pointer hover:bg-gray-200 transition-colors"
              >
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
