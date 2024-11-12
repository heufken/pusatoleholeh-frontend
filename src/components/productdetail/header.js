import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <header className="header bg-white shadow p-4 flex items-center justify-between border-b border-gray-300">
      <div className="logo flex items-center">
        <img src="/logo.png" alt="Pusat Oleh-Oleh" className="h-10 w-auto mr-2" />
        <span className="font-bold text-lg hidden md:block">Pusat Oleh-Oleh</span>
      </div>
      <div className="flex items-center flex-grow mx-4 max-w-full md:max-w-md border border-gray-300 rounded-full bg-white">
        <button type="button" className="p-2 pl-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
        </button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <input 
          type="text" 
          placeholder="Apa Yang Anda Inginkan?" 
          className="bg-transparent border-none rounded-full p-2 flex-grow focus:outline-none"
        />
      </div>
      <div className="user-icon flex items-center">
        <FontAwesomeIcon icon={faUser} className="bg-gray-200 rounded-full p-2 text-gray-600" />
        <span className="ml-2 hidden md:block">Fahmi Sumbul</span>
      </div>
    </header>
  );
}

export default Header;
