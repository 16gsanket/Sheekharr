import React from 'react';

function Navbar() {
  return (
    <nav className="flex items-center p-4 bg-blue-900 text-white">
      <img src="/logo.png" alt="Sheekharr Logo" className="h-10 mr-4" />
      <span className="font-bold text-xl">Sheekharr Starch</span>
    </nav>
  );
}

export default Navbar;