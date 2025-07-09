import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Button } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';


const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchPatients = async () => {
  
    try {
   
      const res = await axios.get(`${API_BASE_URL}/nurse/my-patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      showSnackbar("Failed to fetch patients. Please try again later.", 'error');  
      setErrorMsg("Failed to fetch patients. Please try again later."); 
    }finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (id) => {
    if (!window.confirm("Are you sure you want to discharge this patient?")) {
      return;  
    }

    try {
      const res = await axios.patch(`${API_BASE_URL}/nurse/discharge/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      showSnackbar("Patient discharged successfully!", 'success');
      fetchPatients(); // Refresh the patient list

    } catch (error) {
      console.error("Error discharging patient:", error);
      showSnackbar("Failed to discharge patient. Please try again later.", 'error');
      setErrorMsg("Failed to discharge patient. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPatients();
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

        {/* Page Content */}
        <div className="mt-20 p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">All Patients</h2>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : errorMsg ? (
            <p className="text-red-600">{errorMsg}</p>
          ) : patients.length === 0 ? (
            <p className="text-gray-500">No patients found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto shadow rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Age</th>
                      <th className="px-6 py-3 text-left">Gender</th>
                      <th className="px-6 py-3 text-left">Mobile</th>
                      <th className="px-6 py-3 text-left">Room</th>
                      <th className="px-6 py-3 text-left">Bed</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">{p.name}</td>
                        <td className="px-6 py-3">{p.age}</td>
                        <td className="px-6 py-3 capitalize">{p.gender}</td>
                        <td className="px-6 py-3">{p.mobile}</td>
                        <td className="px-6 py-3">{p.roomNumber || p.dischargeDetails?.roomNumber}</td>
                        <td className="px-6 py-3">{p.bedNumber || p.dischargeDetails?.bedNumber}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              p.isDischarged ? 'bg-red-500' : 'bg-green-600'
                            }`}
                          >
                            {p.isDischarged ? 'Discharged' : 'Admitted'}
                          </span>
                        </td>
                        <td className="px-6 py-3 flex flex-wrap gap-2">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/allPatients/${p._id}`)}
                          >
                            View
                          </Button>
                          {!p.isDischarged && (
                            <Button
                              size="small"
                              color="error"
                              variant="contained"
                              onClick={() => handleDischarge(p._id)}
                            >
                              Discharge
                            </Button>
                          )}
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
                        className={`text-xs font-semibold px-2 py-1 rounded text-white ${
                          p.isDischarged ? 'bg-red-500' : 'bg-green-600'
                        }`}
                      >
                        {p.isDischarged ? 'Discharged' : 'Admitted'}
                      </span>
                    </div>
                    <p className="text-sm"><strong>Age:</strong> {p.age}</p>
                    <p className="text-sm"><strong>Gender:</strong> {p.gender}</p>
                    <p className="text-sm"><strong>Mobile:</strong> {p.mobile}</p>
                    <p className="text-sm">
                      <strong>Room:</strong> {p.roomNumber || p.dischargeDetails?.roomNumber}
                    </p>
                    <p className="text-sm">
                      <strong>Bed:</strong> {p.bedNumber || p.dischargeDetails?.bedNumber}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/allPatients/${p._id}`)}
                      >
                        View
                      </Button>
                      {!p.isDischarged && (
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDischarge(p._id)}
                        >
                          Discharge
                        </Button>
                      )}
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

export default AllPatients