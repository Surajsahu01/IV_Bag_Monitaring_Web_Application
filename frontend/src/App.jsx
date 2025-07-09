import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login'
import NurseDashbord from './pages/nurseDashbord'
import AddPatient from './pages/AddPatient'
import LiveData from './pages/LiveData'
import AllPatients from './pages/AllPatients'
import PatientDetails from './pages/PatientDetails'
import Signup from './pages/Signup'
import AdminDashbord from './admin/AdminDashbord'
import IVVisual from './pages/IVVisual'
import AddSensor from './admin/AddSensor'
import AddRoomBed from './admin/AddRoomBed'
import AllNurse from './admin/AllNurse'
import AllPatient from './admin/AllPatient'
import PatientHistory from './admin/PatientHistory'
import PrivateRoute from './components/PrivateRoute'
import AddExistingPatient from './pages/AddExistingPatient'



function App() {
  
  return (
    <>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Nurse Routes */}
      <Route element = {<PrivateRoute role="nurse" />}>
        <Route path="/nusreDashbord" element={<NurseDashbord />} />
        <Route path="/addPatient" element={<AddPatient />} />
        <Route path ="/addExistingPatient" element={<AddExistingPatient />} />
        <Route path="/liveData" element={<LiveData />} />
        <Route path="/allPatients" element={<AllPatients />} />
        <Route path="/allPatients/:id" element={<PatientDetails />} />
        <Route path="/iv-visual/:patientId" element={<IVVisual />} />
      </Route>

        {/* Admin Routes */}
      <Route element={<PrivateRoute role="admin" />}>
        <Route path="/adminDashbord" element={<AdminDashbord />} />
        <Route path="/addSensor" element={<AddSensor />} />
        <Route path="/addRoomBed" element={<AddRoomBed />} />
        <Route path="/allNurse" element={<AllNurse />} />
        <Route path="/allPatient" element={<AllPatient />} />
        <Route path="/PatientsHistory/:id" element={<PatientHistory />} />
      </Route>

      <Route path='/unauthorized' element={<div className="text-center mt-20 text-red-600 text-2xl">Access Denied</div>}  />
      </Routes>
    </>
  )
}

export default App
