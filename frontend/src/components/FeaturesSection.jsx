import React from 'react'


const features = [
  {
    title: 'Nurse Dashboard',
    desc: 'Nurses can add patients, monitor real-time IV fluid status, and view patient history.'
  },
  {
    title: 'Admin Control Panel',
    desc: 'Admins can manage nurses, assign rooms & beds, and monitor sensor allocations.'
  },
  {
  title: 'Live IV Weight View',
  desc: 'Monitor real-time IV fluid levels with smooth animations and color indicators for critical low-weight alerts.'
    },
  {
    title: 'Socket-based Live Data',
    desc: 'Live IV data pushed directly from ESP32 sensors via WebSocket.'
  },
  {
    title: 'Secure Login System',
    desc: 'Role-based login access for nurse and admin using JWT authentication.'
  },
  {
    title: 'Patient History Logs',
    desc: 'Detailed logs of all IV sensor usage, assignments, and vitals timeline.'
  }
];

const FeaturesSection = () => (
    <div className="bg-blue-50 py-16 px-6" data-aos="fade-up">
    <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 select-none">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105"
          data-aos="zoom-in-up"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
)

export default FeaturesSection