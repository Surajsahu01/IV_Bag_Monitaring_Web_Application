import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { API_BASE_URL } from '../Utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';

const AddPatient = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    roomNumber: '',
    bedNumber: '',
    ivSensorId: '',
    note: '',
  });

  const [rooms, setRooms ] = useState([]);
  const [availableBeds, setAvailableBeds ] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [message, setMessage] = useState('');
  const {showSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const roomRes = await axios.get(`${API_BASE_URL}/nurse/available-rooms`, {
          headers: { Authorization: `Bearer ${token}`}
        });

        setRooms(roomRes.data.rooms);

        const sensorRes = await axios.get(`${API_BASE_URL}/nurse/available-sensors`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (Array.isArray(sensorRes.data.sensore)) {
            setSensors(sensorRes.data.sensore);
          } else {
            setSensors([]);
          }
          // console.log("sensors", sensorRes.data.sensore);
      } catch (error) {
        console.error("Error fetching data:", error);
        
      }
    };
    fetchInitialData();
  }, [token]);

  const handelRoomChange = async (e) => {
    const selectedRoom  = e.target.value;
    setForm({ ...form, roomNumber: selectedRoom, bedNumber: '' });

    try {
      const res = await axios.get(`${API_BASE_URL}/nurse/available-beds/${selectedRoom}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(res.data.beds)) {
        setAvailableBeds(res.data.beds);
      } else {
        setAvailableBeds([]);
      }
      
    } catch (error) {
      console.error("Error fetching available beds:", error);
      setAvailableBeds([]);
      setMessage('Error fetching available beds');
      
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
    setMessage('');

    try {
    
      const res = await axios.post(`${API_BASE_URL}/nurse/add-patient`, form, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }

      });

      const data = res.data;
      if (res.status === 201 || res.status === 200) {
        // Set success message
        setMessage(data.message || 'Patient added successfully');
     
        showSnackbar(data.message || 'Patient added successfully', 'success');
        console.log("Patient added successfully:", data);
        
        // Reset form fields
        setForm({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          roomNumber: '',
          bedNumber: '',
          ivSensorId: '',
          note: '',
        });
        
        // Reset available beds
        setAvailableBeds([]);
        
        // Navigate to LiveData page
        navigate('/liveData')
        
      } else {
        // Set error message
        setMessage(data.message || 'Error adding patient');
        
        showSnackbar(data.message || 'Error adding patient', 'error');
        
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showSnackbar(error.response?.data?.message || 'Error adding patient', 'error');
      
    }
  }

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
          <h2 className="text-2xl font-bold mb-6">Add New Patient</h2>

      {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange}
          placeholder="Patient Name" required className="w-full p-2 border rounded" />

        <input type="number" name="age" value={form.age} onChange={handleChange}
          placeholder="Age" required className="w-full p-2 border rounded" />

        <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input type="text" name="mobile" value={form.mobile} onChange={handleChange}
          placeholder="Mobile Number" required className="w-full p-2 border rounded" />

        {/* IV Sensor Dropdown */}
          <select
            name="ivSensorId"
            value={form.ivSensorId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Sensor</option>
            {sensors.length > 0 ? (
              sensors.map(sensor => (
                <option key={sensor._id} value={sensor.sensorId}>
                  {sensor.sensorId}
                </option>
              ))
            ) : ( 
            <option value="IV001">IV001</option>
             )}
            {/* // : ( */}
            {/* //   <option disabled>No available sensors</option> */}
            {/* // )} */}
          </select> 

        {/* Room Dropdown */}
        <select name="roomNumber" value={form.roomNumber} onChange={handelRoomChange} required className="w-full p-2 border rounded">
          <option value="">Select Room</option>
          {rooms.map(room => (
            <option key={room._id} value={room.roomNumber}>Room {room.roomNumber}</option>
          ))}
        </select>

        {/* Bed Dropdown */}

         <select
            name="bedNumber"
            value={form.bedNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Bed</option>
            {Array.isArray(availableBeds) && availableBeds.length > 0 ? (
              availableBeds.map((bed) => (
                <option key={bed.bedNumber} value={bed.bedNumber}>
                  Bed {bed.bedNumber}
                </option>
              ))
            ) : (
              <option disabled>No beds available</option>
            )}
          </select>

        <textarea name="note" value={form.note} onChange={handleChange}
          placeholder="Notes (optional)" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          Add Patient
        </button>
        
          <p className=' text-sm mt-2 text-center'>
            <a href="/addExistingPatient" className="text-blue-600 hover:text-blue-800 hover:text-md text-lg">
             ← Add IV to Existing Patient
            </a>
          </p>
      </form>
    </div>
    
  </div>
</div>
  )
}

export default AddPatient