import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import socket from '../websocket/socket';
import { Menu } from 'lucide-react';


const LiveData = () => {
  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    // Fetch initial live data
    const fetchLiveData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/nurse/live-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLiveData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching live data:', error);
        setLoading(false);
      }
    };

    fetchLiveData();

    // Handle socket connection
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket:', socket.id);
    });


    const handleIVUpdate = (data) => {
      console.log('📡 Real-time update received:', data);
      setLiveData(prevData => {
        const index = prevData.findIndex(p => p.patientId === data.patientId);
        if (index !== -1) {
          const updated = [...prevData];
          updated[index].latestData = {
            weight: data.weight,
            dropCount: data.dropCount,
            timestamp: data.timestamp
          };
          return updated;
        } else {
          return [
            ...prevData,
            {
              patientId: data.patientId,
              patientName: data.patientName,
              latestData: {
                weight: data.weight,
                dropCount: data.dropCount,
                timestamp: data.timestamp
              }
            }
          ];
        }
      });
    };

    // ✅ Listen to 'iv-Data'
    socket.on('iv-Data', handleIVUpdate);

    return () => {
      socket.off('iv-Data', handleIVUpdate);
      // socket.offAny(); // Clean up debug listener
    };
  }, []);

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
        <div className="p-4 bg-gray-100 min-h-screen mt-20">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">Live IV Sensor Data</h1>

          {loading ? (
            <div className="flex justify-center mt-20">
              <CircularProgress />
            </div>
          ) : liveData.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No live data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveData.map((entry) => (
                <Link 
                to={`/iv-visual/${entry.patientId}`}
                state={{ weight: entry.latestData?.weight, patientName: entry.patientName }}
                key={entry.patientId}>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{entry.patientName}</h2>
                    <p className="text-gray-700">💧 <strong>Weight:</strong> {entry.latestData?.weight ?? 'N/A'} mL</p>
                    <p className="text-gray-700">📉 <strong>Drop Count:</strong> {entry.latestData?.dropCount ?? 'N/A'}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Last updated: {entry.latestData?.timestamp ? new Date(entry.latestData.timestamp).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
       
      </div>
    </div>
  );
};

export default LiveData;
