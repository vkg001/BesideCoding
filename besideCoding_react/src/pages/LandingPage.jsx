// src/components/LandingPage.jsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

import Lottie from "lottie-react";
import dashboardAnimation from "../assets/dashboard-animation.json";
import transitionAnimation from "../assets/transition-animation.json";

function LandingPage() {
  const exploreRef = useRef(null);
  const productRef = useRef(null);
  const developerRef = useRef(null);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const scrollToSection = (ref) => {
    console.log('Attempting to scroll to:', ref.current);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Scroll target is null. Element might not be in DOM or ref not attached correctly.');
    }
  };

  const gradientBackgroundStyle = {
    background: 'linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%)',
  };

  return (
    <>
      {showLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <Lottie
            animationData={transitionAnimation}
            loop={false}
            autoplay
            style={{ width: 300, height: 300 }}
          />
        </div>
      )}
      <div className="min-h-screen font-sans">
        <header
          className="fixed top-0 left-0 w-full z-50 py-4 px-8 flex justify-between items-center bg-opacity-70 backdrop-blur-sm shadow-lg"
          style={gradientBackgroundStyle}
        >
          <div className="flex items-center">
            <img
              src="src/assets/besideCoding-Logo.png"
              alt="besideCoding Logo"
              className="h-8 w-8 mr-2 rounded-md"
            />
            <span className="text-xl font-bold text-white">besideCoding</span>
          </div>
          <nav className="flex items-center space-x-6">
            {/* <a href="#" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-200">
            Premium
          </a> */}
            <button onClick={() => scrollToSection(exploreRef)} className="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none cursor-pointer">
              Explore
            </button>
            <button onClick={() => scrollToSection(productRef)} className="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none cursor-pointer">
              Product
            </button>
            <button onClick={() => scrollToSection(developerRef)} className="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none cursor-pointer">
              Developer
            </button>
            <button
              onClick={() => {
                setShowLoader(true);
                setTimeout(() => {
                  navigate("/signin");
                }, 2000);
              }}
              disabled={showLoader}
              className="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              Sign in
            </button>

          </nav>
        </header>

        <section
          className="relative h-screen flex items-center justify-center text-white overflow-hidden pt-16 md:pt-0"
          style={{
            ...gradientBackgroundStyle,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-11/12 md:w-4/5 mx-auto p-4 md:p-8">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1 mt-8 md:mt-0">
              <div className="max-w-full w-[400px] h-[250px] md:w-[600px] md:h-[350px]  rounded-lg shadow-2xl transform -rotate-6 flex items-center justify-center text-gray-400 text-lg">
                <Lottie
                  animationData={dashboardAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div className="md:w-1/2 text-center md:text-left p-4 md:p-8 order-1 md:order-2">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight">
                A New Way to Learn, Practice & Compete
              </h1>
              <p className="text-md md:text-lg mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                BesideCoding is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.
              </p>
              <button
                onClick={() => {
                  setShowLoader(true);
                  setTimeout(() => {
                    navigate("/signup");
                  }, 1500);
                }}
                disabled={showLoader}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-7 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                Create Account
              </button>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex items-center text-white text-md md:text-lg">
            <span className="mr-2">Start Exploring</span>
            <div className="bg-green-500 rounded-full p-2">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 12.586z"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Explore Section (ref={exploreRef}) ... */}
        <section ref={exploreRef} className="min-h-screen bg-white py-20 px-8 flex flex-col items-center justify-center text-gray-800 shadow-inner">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900">Explore BesideCoding</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl leading-relaxed text-gray-700">
            Dive into a vast collection of Aptitude, Operating System, Database Management System, Object Oriented Programming, Computer Network problems, and articles. Discover new concepts and master your skills in various programming languages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Problem Set</h3>
              <p className="text-gray-600">Thousands of problems to challenge yourself with, categorized by difficulty and topic.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Learn Resources</h3>
              <p className="text-gray-600">Comprehensive guides and articles to deepen your understanding of algorithms and data structures.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Contests</h3>
              <p className="text-gray-600">Participate in weekly contests to test your knowledge and compete with others.</p>
            </div>
          </div>
        </section>

        {/* Product Section (ref={productRef}) ... */}
        <section ref={productRef} className="min-h-screen bg-white py-20 px-8 flex flex-col items-center justify-center text-gray-800">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900">Our Product Features</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl leading-relaxed text-gray-700">
            BesideCoding offers powerful tools and features designed to accelerate your coding journey and interview preparation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full max-w-5xl">
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-start space-x-4">
              <span className="text-green-600 text-3xl">💡</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Interactive Playground</h3>
                <p className="text-gray-600">Practice coding directly in your browser with a robust code editor.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-start space-x-4">
              <span className="text-blue-600 text-3xl">📊</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Detailed Solutions</h3>
                <p className="text-gray-600">Access official solutions and community discussions for every problem.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-start space-x-4">
              <span className="text-purple-600 text-3xl">👥</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Community Support</h3>
                <p className="text-gray-600">Engage with a vibrant community, ask questions, and share insights.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-start space-x-4">
              <span className="text-red-600 text-3xl">📈</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">Progress Tracking</h3>
                <p className="text-gray-600">Monitor your performance and see your skills improve over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section (ref={developerRef}) ... */}
        <section ref={developerRef} className="min-h-screen bg-white py-20 px-8 flex flex-col items-center justify-center text-gray-800 shadow-inner">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900">For Developers</h2>
          <p className="text-lg md:text-xl text-center max-w-3xl leading-relaxed text-gray-700">
            BesideCoding is trusted by top tech companies and used by millions of developers worldwide for interview preparation and skill enhancement.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-12 max-w-6xl">
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Interview Prep</h3>
              <p className="text-gray-600">Master common interview patterns and ace your technical interviews.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Skill Building</h3>
              <p className="text-gray-600">Continuously improve your problem-solving abilities and coding proficiency.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Career Growth</h3>
              <p className="text-gray-600">Open doors to new opportunities with a strong coding foundation.</p>
            </div>
          </div>
        </section>

        <footer className="bg-gray-950 py-10 text-gray-400 text-center text-sm">
          <p>© 2025 BesideCoding. All rights reserved. (This is a replica for educational purposes.)</p>
          <p className="mt-2">Built with React and Tailwind CSS.</p>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;