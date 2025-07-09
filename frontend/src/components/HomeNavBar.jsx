import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react';

const HomeNavBar = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const  navigate = useNavigate();
    
    useEffect(() => {
        setIsLoggedIn(!!token);
    }, []);
    const handelLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    }
    
    const handelDashBoard = () => {
        if (user.role === 'nurse') {
          navigate('/nusreDashbord');
        } else if (user.role === 'admin') {
          navigate('/adminDashbord');
        } else {
          navigate('/login');
        }
      };
  return (
     <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white hover:text-blue-300 transition duration-300"
        >
          IV Monitor
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {isLoggedIn && (
            <button
              onClick={handelDashBoard}
              className="bg-green-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-500 transition duration-300 shadow"
            >
              Dashboard
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={handelLogout}
              className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 hover:text-blue-800 transition duration-300 shadow"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 hover:text-blue-800 transition duration-300 shadow"
            >
              Login
            </Link>
          )}

          <Link
            to="/signup"
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition duration-300 shadow"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={28} className="text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 px-6 space-y-2">
          {isLoggedIn && (
            <button
              onClick={() => {
                handelDashBoard();
                setMobileMenuOpen(false);
              }}
              className="block w-full bg-green-400 text-white px-4 py-2 rounded font-semibold hover:bg-green-500 transition duration-300 shadow"
            >
              Dashboard
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handelLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full bg-white text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 hover:text-blue-800 transition duration-300 shadow"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-white text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 hover:text-blue-800 transition duration-300 shadow text-center"
            >
              Login
            </Link>
          )}

          <Link
            to="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full bg-yellow-400 text-blue-900 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition duration-300 shadow text-center"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  )
}

export default HomeNavBar