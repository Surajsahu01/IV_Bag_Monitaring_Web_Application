import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../Utils/utils';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSnackbar } from '../context/SnackbarContext';
import { Menu } from 'lucide-react';
import { CircularProgress } from '@mui/material';

const PatientHistory = () => {
    const { id } = useParams(); // patient ID from URL
    const [patient, setPatient] = useState(null);
    // const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const token = localStorage.getItem('token');
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/patients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
            setPatient(res.data.patient);
        } catch (error) {
            console.error('Error fetching patient history:', error);
            setErrorMsg(error.response?.data?.message || 'Failed to fetch patient history');
            showSnackbar(error.response?.data?.message || 'Failed to fetch patient history', 'error');
        } finally {
            setLoading(false);
        }
        };

        fetchHistory();
    }, [id, token]);


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
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Patient IV History</h1>

          {loading ? (
            <div className="flex justify-center mt-20">
                          <CircularProgress />
                        </div>
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <>
              {/* Patient Details */}
              <div className="bg-white shadow rounded p-4 mb-6">
                <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Mobile:</strong> {patient.mobile}</p>
                {/* <p><strong>Room Number:</strong> {patient.roomNumber || 'N/A'}</p>
                <p><strong>Bed Number:</strong> {patient.bedNumber || 'N/A'}</p> */}
                {!patient.isDischarged ? (
                    <>
                        <p><strong>Room:</strong> {patient.roomNumber}</p>
                        <p><strong>Bed:</strong> {patient.bedNumber}</p>
                    </>
                    ): (
                    <>
                    <p><strong>Room No.:</strong> {patient.dischargeDetails.roomNumber}</p>
                    <p><strong>Bed No.:</strong> {patient.dischargeDetails.bedNumber}</p>
                    </>

                    )}
                <p><strong>Status: </strong> 
                <span className={` ${patient.isDischarged ? 'text-red-500 ' : 'text-green-600'}`}>
                {patient.isDischarged ? 'Discharged' : 'Admitted'}
                </span></p>
                <p><strong>Nurse:</strong> {patient.nurse?.name || 'N/A'} ({patient.nurse?.email || 'N/A'})</p>
                <p><strong>Total IV Bottles Used:</strong> {patient.iVBottleCount || 0}</p>
              </div>

              {/* IV Bottle History */}
              <div className="overflow-x-auto bg-white shadow rounded">
                <h2 className="text-lg font-semibold text-gray-800 px-4 pt-4">IV Bottle History</h2>
                <table className="min-w-full text-sm text-left mt-2">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Bottle Number</th>
                      <th className="px-4 py-2">Sensor ID</th>
                      <th className="px-4 py-2">Note</th>
                      <th className="px-4 py-2">Assigned Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.ivBottleHistory?.length > 0 ? (
                      patient.ivBottleHistory.map((entry, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{entry.ivsensor?.sensorId || 'N/A'}</td>
                          <td className="px-4 py-2">{entry.note || 'N/A'}</td>
                          <td className="px-4 py-2">
                            {entry.assignedAt
                              ? new Date(entry.assignedAt).toLocaleString()
                              : entry.startTime
                              ? new Date(entry.startTime).toLocaleString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-gray-500 py-4">No IV bottle history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>
       
      </div>
    </div>
  )
}

export default PatientHistory
