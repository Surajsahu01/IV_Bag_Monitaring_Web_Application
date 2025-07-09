import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_BASE_URL } from '../Utils/utils';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';

const AddSensor = () => {
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sensorId, setSensorId] = useState('');
    const [message, setMessage] = useState('');
    const {showSnackbar} = useSnackbar();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const token = localStorage.getItem('token');

    const fetchSensors = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/allsensor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSensors(res.data || []);
      } catch (error) {
        console.error('Error fetching sensors:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchSensors();
    }, []);

    const handleAddSensor = async () => {
        if(!sensorId) return alert("Please enter sensor Id");
        try {
          const res = await axios.post(`${API_BASE_URL}/admin/add-sensor`, { sensorId }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setMessage(res.data.message);
          setSensorId('');
          fetchSensors();
          // alert(res.data.message || 'Sensor added successfully');
          showSnackbar(res.data.message || 'Sensor added successfully', 'success');
        } catch (error) {
          console.error('Error adding sensor:', error);
          setMessage(error.response.data.message || 'Failed to add sensor');
          showSnackbar(error.response.data.message || 'Failed to add sensor', 'error');
        }
    };

    const handleDeleteSensor = async (id) => {
        try {
          const res = await axios.delete(`${API_BASE_URL}/admin/delete-sensor/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setMessage(res.data.message || 'Sensor deleted successfully');
          fetchSensors();
          // alert(res.data.message || 'Sensor deleted successfully');
          showSnackbar(res.data.message || 'Sensor deleted successfully', 'success');
        } catch (error) {
          console.error('Error deleting sensor:', error);
          setMessage(error.response.data.message || 'Failed to delete sensor');
          showSnackbar(error.response.data.message || 'Failed to delete sensor', 'error');
        }
    };
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
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add New IV Sensor</h2>
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded"
              placeholder="Enter sensor ID"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAddSensor}
            >
              Add Sensor
            </button>
          </div>
          {/* {message && <p className="text-sm text-green-600 mb-4 ">{message}</p>} */}
          <h2 className="text-xl font-bold mb-2">All Sensors</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-sm rounded">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">Sensor ID</th>
                    <th className="p-3">Assigned</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((sensor) => (
                    <tr key={sensor._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{sensor.sensorId}</td>
                      <td className="p-3">{sensor.assigned ? 'Yes' : 'No'}</td>
                      <td className="p-3">{sensor.patient ? sensor.patient.name : 'None'}</td>
                      <td className="p-3">
                        {!sensor.assigned && (
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteSensor(sensor._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
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

export default AddSensor