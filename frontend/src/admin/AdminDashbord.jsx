import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Menu } from 'lucide-react';



const AdminDashbord = () => {
  const [stats, setSats] = useState({
    totalNurses: 0,
    totalPatients: 0,
    totalSensors: 0,
    totalRooms: 0,
    totalBeds: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSats(res.data);
        
      } catch (error) {
        console.log('Error fetching admin stats:', error);
        
        
      }
    };

    fetchStats();
  }, [user, token, navigate]);


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
        <div className="p-6 mt-20 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Admin Dashboard - {user.name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className='hover:scale-105 hover:shadow-lg'>
              <Card title="Total Nurses" value={stats.totalNurses} color="bg-green-500" />
            </div>

            <div className='hover:scale-105 hover:shadow-lg'>
              <Card title="Total Patients" value={stats.totalPatients} color="bg-blue-500" />
            </div>

            <div className='hover:scale-105 hover:shadow-lg'>
              <Card title="Total Sensors" value={stats.totalSensors} color="bg-purple-500" />
            </div>

            <div className='hover:scale-105 hover:shadow-lg'>
              <Card title="Total Rooms" value={stats.totalRooms} color="bg-yellow-500" />
            </div>

            <div className='hover:scale-105 hover:shadow-lg'>
              <Card title="Total Beds" value={stats.totalBeds} color="bg-pink-500" />
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-white ${color}`}>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AdminDashbord
