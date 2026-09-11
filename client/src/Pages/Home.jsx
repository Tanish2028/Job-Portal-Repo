import React from 'react'
import  NavBar  from '../Components/NavBar.jsx'
import Hero from '../Components/Hero.jsx'
import JobListing from '../Components/JobListing.jsx'
import Footer from '../Components/Footer.jsx'
const Home = () => {
  return (
    <div>
        <NavBar />
        <Hero/>
        <JobListing/>
        <Footer/>
    </div>
  )
}

export default Home