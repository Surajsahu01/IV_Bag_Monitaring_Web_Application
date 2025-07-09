import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Utils/utils';
import signupImage from '../assets/Sign up-bro.svg'
import { useSnackbar } from '../context/SnackbarContext';

const Signup = () => {
  const [form, setForm ] = useState({
    name: '',
    email: '',
    password: '',
    role: 'nurse' // Default role
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    }); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(`${API_BASE_URL}/auth/signup`, form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      showSnackbar('Signup successful!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Signup failed. Please try again.', 'error');
      console.error("Signup error: ", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 px-4">
      
      <div className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full animate-fadeIn duration-700">
        
        {/* 🌟 Left Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-100 p-6">
          <img
            src={signupImage}
            alt="Signup Illustration"
            className="w-80 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* ✍️ Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Create an Account</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm mt-4 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
          <p className=' text-sm mt-4 text-center'>
            <a href="/" className="text-blue-600 hover:text-blue-800 hover:text-md">
             ← Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>

  )
}

export default Signup