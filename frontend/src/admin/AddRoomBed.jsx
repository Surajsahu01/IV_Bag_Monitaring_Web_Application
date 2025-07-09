import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';

const AddRoomBed = () => {
    const [roomNumber, setRoomNumber] = useState('');
    const [bedNumber, setBedNumber] = useState('');
    const [newBeds, setNewBeds] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState('');
    const {showSnackbar} = useSnackbar();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const token = localStorage.getItem('token');

    useEffect( () => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
        const res = await axios.get(`${API_BASE_URL}/room/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("Eooms Response", res.data);
        // const data = Array.isArray(res.data) ? res.data : [];
        
        setRooms(Array.isArray(res.data.rooms) ? res.data.rooms : []);

        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        }
    };


    const handleAddBedField = () => {
        if (!bedNumber) return showSnackbar('Please provide bed number', 'error');
        setNewBeds([...newBeds, { bedNumber }]);
        setBedNumber('');
        
    };


    const handleCreateRoom = async () => {
        if (!roomNumber || newBeds.length === 0) {
        return showSnackbar('Please provide room number and at least one bed', 'error');
        }

        try {
        const res = await axios.post(`${API_BASE_URL}/room/create`, {
            roomNumber,
            beds: newBeds
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setMessage(res.data.message);
        showSnackbar(res.data.message, 'success');
        setRoomNumber('');
        setNewBeds([]);
        fetchRooms();
        } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || 'Error creating room');
        }
    };

    const handleAddBedToExistingRoom = async () => {
        if (!roomNumber || !bedNumber) {
        return showSnackbar('Please provide room number and bed number', 'error');
        }

        try {
        const res = await axios.post(`${API_BASE_URL}/room/add-bed`, {
            roomNumber,
            bedNumber
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setMessage(res.data.message);
        showSnackbar(res.data.message, 'success');
        setRoomNumber('');
        setBedNumber('');
        fetchRooms();
        } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || 'Error adding bed');
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
        {/* Page content */}
    <div className="pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Rooms & Beds</h2>

      {/* Inputs and Buttons */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Bed Number"
          value={bedNumber}
          onChange={(e) => setBedNumber(e.target.value)}
        />
        <button
          onClick={handleAddBedField}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          ➕ Add Bed Field
        </button>
        <button
          onClick={handleAddBedToExistingRoom}
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
        >
          ✏️ Add Bed to Existing Room
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={handleCreateRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          🏠 Create New Room
        </button>
      </div>

      {/* New Beds List */}
      {newBeds.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">New Beds to Add:</h4>
          <ul className="list-disc pl-5">
            {newBeds.map((b, i) => (
              <li key={i}>{b.bedNumber}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

      {/* Room Table */}
      <h3 className="text-xl font-semibold mb-3">All Rooms</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Room</th>
              <th className="p-3">Beds</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-t">
                <td className="p-3 font-medium">{room.roomNumber}</td>
                <td className="p-3">
                  <ul className="list-disc pl-5">
                    {room.beds.map((b, i) => (
                      <li key={i}>
                        <span
                          className={b.isOccupied ? 'text-red-500' : 'text-green-600'}
                        >
                          {b.bedNumber} - {b.isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  )
}

export default AddRoomBed