import React from 'react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
      <div>
        <button onClick={toggleSidebar} className="text-lg font-bold">☰</button>
      </div>
    </header>
  );
};

export default Header;
