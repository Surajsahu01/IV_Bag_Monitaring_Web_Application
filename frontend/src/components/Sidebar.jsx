import React, { use } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import HomeIcon from '@mui/icons-material/Home';


const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = localStorage.getItem('user');
  let role = '';

  if (user) {
    try {
      const userData = JSON.parse(user);
      role = userData.role || '';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
 

  const nurseLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/nusreDashbord', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/addPatient', label: 'Add Patient', icon: <PersonAddIcon /> },
    { to: '/addExistingPatient', label: 'Add Existing Patient', icon: <PersonAddIcon /> },
    { to: '/liveData', label: 'Live IV Data', icon: <MonitorHeartIcon /> },
    { to: '/allPatients', label: 'All Patients', icon: <PeopleIcon /> },
  ];

  const adminLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/adminDashbord', label: 'Admin Dashboard', icon: <DashboardIcon /> },
    { to: '/addSensor', label: 'Add Sensor', icon:  <VaccinesIcon />},
    { to: '/addRoomBed', label: 'Add Room & Bed', icon: <LocalHotelIcon /> },
    { to: '/allNurse', label: 'All Nurse', icon: <PeopleIcon /> },
    { to: '/allPatient', label: 'All Patient', icon: <PeopleIcon /> },

  ];

  const selectedLinks = role === 'nurse' ? nurseLinks : adminLinks;
  const penelTitle = role === 'nurse' ? 'Nurse Panel' : 'Admin Panel';

  return (
    <Drawer variant="permanent" anchor="left">
      <div className="w-64 h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg flex flex-col">
        <div className="text-center py-6 border-b border-blue-400">
          <h1 className="text-2xl font-bold tracking-wide">{penelTitle}</h1>
        </div>
        <List className="flex-1 px-2">
          {selectedLinks.map((item) => (
            <ListItem
              disablePadding
              key={item.to}
              className={`rounded-lg my-1 ${
                location.pathname === item.to ? 'bg-blue-500' : ''
              }`}
            >
              <ListItemButton
                component={Link}
                to={item.to}
                className="hover:bg-blue-400 rounded-md transition-all duration-200"
              >
                <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding className="rounded-lg mt-4">
            <ListItemButton
              onClick={handleLogout}
              className="hover:bg-red-500 rounded-md transition-all duration-200"
            >
              <ListItemIcon className="text-white">
                <ExitToAppIcon />
              </ListItemIcon>
             
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
