import React from 'react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
      <div>
        <button onClick={toggleSidebar} className="text-lg font-bold">☰</button>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Apa yang Anda Inginkan?"
          className="border p-2 rounded-lg mr-4"
        />
        <div className="flex items-center space-x-4">
          <button className="text-lg font-bold">🔔</button>
          <div className="font-bold">Fahmi Sumbul</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
