// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white text-center py-4">
    <p>&copy; {new Date().getFullYear()} IV Monitoring System. All rights reserved.</p>
  </footer>
  );
};

export default Footer;
