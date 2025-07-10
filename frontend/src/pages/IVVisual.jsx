import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import socket from '../websocket/socket';


const IVVisual = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [weight, setWeight] = useState(location.state?.weight || 0);
  const [patientName, setPatientName] = useState(location.state?.patientName || '');

  // Optional: Listen for live updates if needed
  useEffect(() => {
    const handleUpdate = (data) => {
      if (data.patientId === patientId) {
        setWeight(data.weight);
        setPatientName(data.patientName);
      }
    };

    socket.on('iv-Data', handleUpdate);

    return () => {
      socket.off('iv-Data', handleUpdate);
    };
  }, [patientId]);

  const maxWeight = 500;
  const levelPercent = Math.max(0, Math.min(100, (weight / maxWeight) * 100));
  const waterColor = weight < 100 ? 'fill-red-500' : 'fill-blue-500';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        {patientName || 'Patient'}
      </h1>

      {/* Drop SVG Visualization */}
      <div className="relative w-40 h-60 mb-6">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <path
            d="M50 0 C20 50, 0 90, 50 150 C100 90, 80 50, 50 0 Z"
            fill="#e0f2ff"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <defs>
            <clipPath id="dropClip">
              <path d="M50 0 C20 50, 0 90, 50 150 C100 90, 80 50, 50 0 Z" />
            </clipPath>
          </defs>
          <rect
            x="0"
            y={`${150 - (150 * levelPercent) / 100}`}
            width="100"
            height="150"
            className={`transition-all duration-700 ${waterColor}`}
            clipPath="url(#dropClip)"
          />
        </svg>

        <div
          className={`absolute bottom-25 left-1/2 transform -translate-x-1/2 font-bold text-xl ${
            weight < 100 ? 'text-red-600' : 'text-green-400'
          }`}
        >
          {Math.round(weight)} mL
        </div>
      </div>

      {weight < 100 && (
        <div className="text-red-600 font-semibold mb-4 animate-pulse">
          ⚠️ Critical Low IV Fluid!
        </div>
      )}

      <button
        onClick={() => navigate('/liveData')}
        className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        ← Back to Live Data
      </button>
    </div>
  );
};

export default IVVisual;
