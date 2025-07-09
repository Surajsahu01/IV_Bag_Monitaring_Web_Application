// src/components/Navbar.jsx
import React from 'react';

const Navbar = ({toggleSidebar}) => {
  return (
    <div className="w-full py-4 px-6 bg-blue-100 shadow fixed top-0 left-64 z-10">
      <h2 className="text-xl font-semibold text-gray-800">IV Monitoring Dashboard</h2>
    </div>
  );
};

export default Navbar;
