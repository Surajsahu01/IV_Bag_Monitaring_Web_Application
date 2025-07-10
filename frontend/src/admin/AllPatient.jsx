import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { API_BASE_URL } from '../Utils/utils';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';
import { CircularProgress } from '@mui/material';

const AllPatient = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/patients`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
            setPatients(res.data.patient || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setErrorMsg(error.response?.data?.message || 'Failed to load patients');
            showSnackbar(error.response?.data?.message || 'Failed to load patients', 'error');
        } finally {
            setLoading(false);
        }
        };

        fetchPatients();
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
      <h1 className="text-2xl font-bold text-blue-700 mb-6">All Patients</h1>

      {loading ? (
        <div className="flex justify-center mt-20">
                          <CircularProgress />
                        </div>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Bed</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.age}</td>
                        <td className="px-4 py-3">{p.gender}</td>
                        <td className="px-4 py-3">{p.mobile}</td>
                        <td className="px-4 py-3">{p.roomNumber || 'N/A'}</td>
                        <td className="px-4 py-3">{p.bedNumber || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {p.isDischarged ? (
                            <span className="text-red-500 font-semibold">Discharged</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Admitted</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            onClick={() => navigate(`/PatientsHistory/${p._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-4">
                {patients.map((p) => (
                  <div key={p._id} className="bg-white rounded shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-blue-700">{p.name}</h3>
                      <span
                        className={`text-sm font-medium ${
                          p.isDischarged ? 'text-red-500' : 'text-green-600'
                        }`}
                      >
                        {p.isDischarged ? 'Discharged' : 'Admitted'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Age:</strong> {p.age}</p>
                    <p className="text-sm text-gray-700"><strong>Gender:</strong> {p.gender}</p>
                    <p className="text-sm text-gray-700"><strong>Mobile:</strong> {p.mobile}</p>
                    <p className="text-sm text-gray-700"><strong>Room:</strong> {p.roomNumber || 'N/A'}</p>
                    <p className="text-sm text-gray-700"><strong>Bed:</strong> {p.bedNumber || 'N/A'}</p>

                    <div className="mt-3 text-right">
                      <button
                        className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        onClick={() => navigate(`/PatientsHistory/${p._id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
      )}
    </div>
  </div>
</div>
  )
}

export default AllPatient
