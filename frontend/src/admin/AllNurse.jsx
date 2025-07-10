import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';
import { CircularProgress } from '@mui/material';

const AllNurse = () => {
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const {showSnackbar} = useSnackbar();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
    const fetchNurses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/nurses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNurses(res.data.nurses || []);
      } catch (error) {
        console.error('Error fetching nurses:', error);
        setMessage(error.response?.data?.message || 'Failed to load nurses');
        showSnackbar(error.response?.data?.message || 'Failed to load nurses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, [token]);
  return (
    <div className="flex bg-gray-100 min-h-screen overflow-x-hidden">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:block w-64">
            <Sidebar />
          </div>
    
          {/* Sidebar (Mobile Slide-in) */}
          <div
            className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative w-64 bg-white h-full shadow-lg z-10">
              <Sidebar />
            </div>
          </div>
    
          {/* Main content */}
          <div className="flex-1 flex flex-col w-full">
            {/* Navbar */}
            <div className="fixed w-full top-0 z-40">
              {/* Mobile Navbar */}
              <div className="md:hidden bg-white shadow-md flex items-center justify-between px-4 py-3">
                <button onClick={() => setSidebarOpen(true)}>
                  <Menu size={28} className="text-gray-700" />
                </button>
                <span className="text-lg font-semibold text-gray-800">Admin Dashboard</span>
              </div>
    
              {/* Desktop Navbar */}
              <div className="hidden md:block">
                <Navbar />
              </div>
            </div>
        <div className="p-6 mt-20">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">All Registered Nurses</h1>

          {loading ? (
            <div className="flex justify-center mt-20">
                          <CircularProgress />
                        </div>
          ) : message ? (
            <p className="text-red-600">{message}</p>
          ) : nurses.length === 0 ? (
            <p className="text-gray-500">No nurses found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-100 text-left">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {nurses.map((nurse) => (
                    <tr key={nurse._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{nurse.name}</td>
                      <td className="p-3">{nurse.email}</td>
                      <td className="p-3">{new Date(nurse.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>  
      </div>
    </div>
  )
}

export default AllNurse
