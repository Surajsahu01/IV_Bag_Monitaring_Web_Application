import React, { useEffect, useState } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import image1 from '../assets/download-1.jpg';
import image2 from '../assets/download-2.jpg';
import image3 from '../assets/download-4.jpg';

const images = [
    image1,
    image2,
    image3
   
];

const HeroSection = () => {
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        AOS.init({ duration: 5000  });
        const interval = setInterval(() => {
        setCurrentImg((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
  return (
    <div className="bg-blue-50 py-16 px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-xl mb-10 md:mb-0" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Real-time IV Bag Monitoring System</h1>
        <p className="text-gray-500 text-lg mb-6 italic select-none">
          Eliminate manual IV checks. Track drip levels in real-time and receive immediate alerts when action is needed.
        </p>
        <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
          Get Started
        </Link>
      </div>
      <div className="w-[450px] h-[300px] flex justify-center items-center rounded-lg shadow-lg bg-white overflow-hidden hover:shadow-2xl hover:scale-105 duration-5000" data-aos="zoom-in">
        <img src={images[currentImg]} alt="IV Monitoring" className="w-full h-full object-cover transition-opacity duration-700" />
      </div>
    </div>
  )
}

export default HeroSection