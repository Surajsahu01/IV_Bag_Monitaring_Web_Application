import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../Utils/utils';
import { Menu } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/nurse/my-patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data.patient);
      setHistory(res.data.history);
      // console.log('Patient details:', res.data);
    } catch (err) {
      console.error('Error loading patient details:', err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!patient) return <div className="ml-64 mt-24 text-center">Loading...</div>;

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

        <div className="mt-20 px-4 sm:px-6 py-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Patient Details</h2>

          <div className="bg-white p-4 sm:p-6 rounded shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
            <div className="text-sm sm:text-base space-y-1">
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Mobile:</strong> {patient.mobile}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`${patient.isDischarged ? 'text-red-500' : 'text-green-600'}`}>
                  {patient.isDischarged ? 'Discharged' : 'Admitted'}
                </span>
              </p>

              {!patient.isDischarged ? (
                <>
                  <p><strong>Room:</strong> {patient.roomNumber}</p>
                  <p><strong>Bed:</strong> {patient.bedNumber}</p>
                </>
              ) : (
                <>
                  <p><strong>Room No.:</strong> {patient.dischargeDetails?.roomNumber}</p>
                  <p><strong>Bed No.:</strong> {patient.dischargeDetails?.bedNumber}</p>
                  <p className="text-gray-500 text-sm">
                    Discharged on {new Date(patient.dischargeDetails?.dischargeDate).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* IV Bottle History */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-800">IV Bottle History</h3>
            <div className="space-y-3">
              {patient.ivBottleHistory?.map((entry, i) => (
                <div key={i} className="bg-white p-4 sm:p-5 rounded shadow-md text-sm sm:text-base">
                  <p><strong>IV Sensor:</strong> {entry.ivsensor?.sensorId || 'N/A'}</p>
                  <p><strong>Nurse:</strong> {patient.nurse?.name || 'N/A'}</p>
                  <p><strong>Note:</strong> {entry.note || '-'}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Assigned at {new Date(entry.assignedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* IV Weight & Drop History */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-blue-800">IV Weight & Drop History</h3>
            {history.length === 0 ? (
              <p className="text-gray-500">No IV data available.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto bg-white p-4 sm:p-5 rounded shadow-md text-sm sm:text-base">
                {history.map((entry, i) => (
                  <div key={i} className="border-b py-2">
                    <p><strong>Weight:</strong> {entry.weight}g | <strong>Drops:</strong> {entry.dropCount}</p>
                    <p className="text-gray-500 text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDetails