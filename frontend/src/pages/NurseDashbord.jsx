import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { API_BASE_URL } from '../Utils/utils'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Menu } from 'lucide-react';


const NurseDashbord = () => {

  const [stats, setSats] = useState({
      totalSensors: 0,
      totalRooms: 0,
      totalBeds: 0
    });
    
  const [sidebarOpen, setSidebarOpen] = useState(false);
    
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
  
      const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/room/dashbord-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSats(res.data);
        
      } catch (error) {
        console.log('Error fetching admin stats:', error);  
        
      }
    };

    useEffect(() => {
      fetchStats();
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
            <span className="text-lg font-semibold text-gray-800">Nurse Dashboard</span>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center mb-10">
            Welcome {user?.name}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card title="Total Sensors" value={stats.totalSensors} color="bg-purple-500" />
            <Card title="Total Rooms" value={stats.totalRooms} color="bg-yellow-500" />
            <Card title="Total Beds" value={stats.totalBeds} color="bg-pink-500" />
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

export default NurseDashbord
