import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../Utils/utils';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';

const AddExistingPatient = () => {
  const [form, setForm] = useState({
    mobile: '',
    ivSensorId: '',
    roomNumber: '',
    bedNumber: '',
    note: ''
  });

  const [rooms, setRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [sensors, setSensors] = useState([]);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const roomRes = await axios.get(`${API_BASE_URL}/nurse/available-rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(roomRes.data.rooms);

        const sensorRes = await axios.get(`${API_BASE_URL}/nurse/available-sensors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSensors(Array.isArray(sensorRes.data.sensore) ? sensorRes.data.sensore : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Failed to load initial data", "error");
      }
    };
    fetchInitialData();
  }, [token, showSnackbar]);

  const handleRoomChange = async (e) => {
    const selectedRoom = e.target.value;
    setForm({ ...form, roomNumber: selectedRoom, bedNumber: '' });

    try {
      const res = await axios.get(`${API_BASE_URL}/nurse/available-beds/${selectedRoom}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAvailableBeds(Array.isArray(res.data.beds) ? res.data.beds : []);
    } catch (error) {
      console.error("Error fetching beds:", error);
      showSnackbar("Error loading beds", "error");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/nurse/add-Existing-patient`, form, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.data;
      showSnackbar(data.message || 'IV bottle added to patient', 'success');

      // Reset form and redirect
      setForm({
        mobile: '',
        ivSensorId: '',
        roomNumber: '',
        bedNumber: '',
        note: ''
      });
      setAvailableBeds([]);
      navigate('/liveData');
    } catch (error) {
      console.error("Submission error:", error);
      showSnackbar(error.response?.data?.message || 'Failed to add IV bottle', 'error');
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
            <span className="text-lg font-semibold text-gray-800">Nurse Dashboard</span>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div>

        <div className="mt-20 p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Add IV Bottle to Existing Patient</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Patient Mobile Number"
              required
              className="w-full p-2 border rounded"
            />

            <select
              name="ivSensorId"
              value={form.ivSensorId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select IV Sensor</option>
              {sensors.length > 0 ? (
                sensors.map(sensor => (
                  <option key={sensor._id} value={sensor.sensorId}>
                    {sensor.sensorId}
                  </option>
                ))
              ) : (
                <option disabled>No available sensors</option>
              )}
            </select>

            <select
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleRoomChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Room</option>
              {rooms.map(room => (
                <option key={room._id} value={room.roomNumber}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>

            <select
              name="bedNumber"
              value={form.bedNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Bed</option>
              {availableBeds.length > 0 ? (
                availableBeds.map(bed => (
                  <option key={bed.bedNumber} value={bed.bedNumber}>
                    Bed {bed.bedNumber}
                  </option>
                ))
              ) : (
                <option disabled>No beds available</option>
              )}
            </select>

            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Note (optional)"
              className="w-full p-2 border rounded"
            />

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
              Add IV Bottle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExistingPatient;
