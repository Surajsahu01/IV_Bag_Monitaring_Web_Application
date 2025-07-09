import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Utils/utils';
import loginImage from '../assets/Login-bro.svg'
import { Alert, Snackbar } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'nurse' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const user = JSON.parse(atob(res.data.token.split('.')[1]));
      
      showSnackbar('Login successful!', 'success');
    
      setTimeout(() => {
        if (user.role === 'nurse') {
          navigate('/nusreDashbord');
        } else if (user.role === 'admin') {
          navigate('/adminDashbord');
        } else {
          showSnackbar('Unauthorized role', 'error');
          navigate('/login');
        }
      }, 1500);
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed'); 
        console.error('Login error:', err);
        showSnackbar(err.response?.data?.message, 'error');
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 px-4">
      <div className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full animate-fadeIn duration-700">
        
        {/* 🌄 Left Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-100 p-6">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-80 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 🧾 Right Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Login to Your Account</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
            
          </form>


          <p className="text-sm mt-4 text-center">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Signup
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

export default Login