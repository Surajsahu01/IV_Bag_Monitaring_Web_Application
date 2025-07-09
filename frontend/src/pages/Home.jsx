import React from 'react'
import HomeNavBar from '../components/HomeNavBar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='bg-gray-100'>
      <HomeNavBar/>
      <HeroSection />
      <FeaturesSection />
      <Footer />

    </div>
  )
}

export default Home