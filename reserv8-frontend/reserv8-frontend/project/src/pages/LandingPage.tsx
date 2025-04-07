import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'courts' | 'rooms' | 'cuisines' | 'chains' | 'facilities' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const baseSlides = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2070',
    '/images/pic1.jpeg',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070',
    '/images/pic3.jpeg',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070',
    '/images/food1.jpeg',
    '/images/restaurant.jpeg',
    '/images/pic2.jpeg',
  ];

  const slides = [...baseSlides, ...baseSlides, ...baseSlides];

  const courtsOptions = [
    'Badminton Court',
    'Volley Ball Court',
    'Snooker',
    'Tennis Court',
    'Throw Ball Court',
    'Cricket Nets',
    'Basketball Court'
  ];

  const roomsOptions = [
    'Library Rooms',
    'Auditorium',
    'Conference Rooms'
  ];

  const toggleDropdown = (dropdown: 'courts' | 'rooms') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentSlide >= baseSlides.length * 2 - 1) {
        setIsTransitioning(true);
        setCurrentSlide(baseSlides.length - 1);
        setTimeout(() => setIsTransitioning(false), 50);
      } else {
        setCurrentSlide(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSlide, baseSlides.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to verify credentials
    // For now, we'll just simulate a successful login
    setIsLoggedIn(true);
    setUsername(loginForm.email.split('@')[0]); // Using email username as display name
    setShowLoginModal(false);
    setLoginForm({ email: '', password: '' }); // Reset form
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleSignUp = () => {
    setShowLoginModal(false); // Close login modal if it's open
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#e3e1d9]">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="relative w-full h-full flex"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitioning ? 'none' : 'transform 1.5s ease-in-out'
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full h-full flex-shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${slide}')`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-4xl px-4">
          <h1 className="text-5xl font-bold text-white mb-8">
            Reserve with Ease!
          </h1>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log in to ReserV8</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Log in
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={handleSignUp}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Cards */}
      <div className="max-w-[90rem] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dining Card */}
          <Link to="/dining" className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-64">
              <img
                src="/images/table.jpeg"
                alt="Dining"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Dining</h3>
                <p className="text-sm mt-1">View the city's favorite dining venues</p>
              </div>
            </div>
          </Link>

          {/* MU Facilities Booking Card */}
          <Link to="/facilities" className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-64">
              <img
                src="/images/image.png"
                alt="MU Facilities"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">MU Facilities</h3>
                <p className="text-sm mt-1">Book university facilities and venues</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Explore Options Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Discover nearby choices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Popular Cuisine Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'cuisines' ? null : 'cuisines')}
              className="w-full bg-[#e3e1d9] border border-gray-400 rounded-lg px-4 py-3 flex justify-between items-center hover:bg-[#d1cfca] transition-colors"
            >
              <span className="font-semibold text-gray-800">POPULAR CUISINES</span>
              <svg className={`w-5 h-5 text-gray-800 transform transition-transform ${activeDropdown === 'cuisines' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute z-20 w-full mt-1 bg-[#e3e1d9] border border-gray-400 rounded-lg shadow-lg transition-all duration-200 ${activeDropdown === 'cuisines' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Indian</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Chinese</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Italian</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Mexican</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Japanese</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Thai</a>
              </div>
            </div>
          </div>

          {/* Popular Chain Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'chains' ? null : 'chains')}
              className="w-full bg-[#e3e1d9] border border-gray-400 rounded-lg px-4 py-3 flex justify-between items-center hover:bg-[#d1cfca] transition-colors"
            >
              <span className="font-semibold text-gray-800">POPULAR CHAINS</span>
              <svg className={`w-5 h-5 text-gray-800 transform transition-transform ${activeDropdown === 'chains' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute z-20 w-full mt-1 bg-[#e3e1d9] border border-gray-400 rounded-lg shadow-lg transition-all duration-200 ${activeDropdown === 'chains' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Paradise</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Mehfil</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Shah Ghouse</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Bawarchi</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]">Pista House</a>
              </div>
            </div>
          </div>

          {/* MU Facilities Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'facilities' ? null : 'facilities')}
              className="w-full bg-[#e3e1d9] border border-gray-400 rounded-lg px-4 py-3 flex justify-between items-center hover:bg-[#d1cfca] transition-colors"
            >
              <span className="font-semibold text-gray-800">MU FACILITIES</span>
              <svg className={`w-5 h-5 text-gray-800 transform transition-transform ${activeDropdown === 'facilities' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`absolute z-20 w-full mt-1 bg-[#e3e1d9] border border-gray-400 rounded-lg shadow-lg transition-all duration-200 ${activeDropdown === 'facilities' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className="py-1">
                <div className="px-4 py-2 font-semibold text-sm text-gray-800 bg-[#d1cfca]">Courts</div>
                {courtsOptions.map((option, index) => (
                  <Link
                    key={`court-${index}`}
                    to={`/facilities/courts/${option.toLowerCase().replace(/ /g, '-')}`}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300 last:border-b-0"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option}
                  </Link>
                ))}
                <div className="px-4 py-2 font-semibold text-sm text-gray-800 bg-[#d1cfca] mt-2">Rooms</div>
                {roomsOptions.map((option, index) => (
                  <Link
                    key={`room-${index}`}
                    to={`/facilities/rooms/${option.toLowerCase().replace(/ /g, '-')}`}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300 last:border-b-0"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Localities Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Restaurants around you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Cards */}
          <Link to="/restaurant/broadway" className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-full">
              <img
                src="/images/broadway.jpg"
                alt="Broadway"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Broadway</h3>
                <p className="text-sm mt-1">Jubilee Hills</p>
              </div>
            </div>
          </Link>

          <Link to="/restaurant/antera" className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-full">
              <img
                src="/images/antera.png"
                alt="Antera"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Antera</h3>
                <p className="text-sm mt-1">Gachibowli</p>
              </div>
            </div>
          </Link>

          <Link to="/restaurant/ishtaa" className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-full">
              <img
                src="/images/ishtaa.png"
                alt="Ishtaa Restaurant"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Ishtaa</h3>
                <p className="text-sm mt-1">Gachibowli</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* MU Facilities Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">MU Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Courts Card */}
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-48">
              <img
                src="/images/sports.png"
                alt="Sports Courts"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                <h3 className="text-2xl font-bold">Courts</h3>
                <button 
                  onClick={() => toggleDropdown('courts')}
                  className="bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors"
                >
                  <svg className={`w-5 h-5 text-gray-800 transform transition-transform ${activeDropdown === 'courts' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out bg-white ${activeDropdown === 'courts' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="border-t border-gray-100 px-4">
                {courtsOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={`/facilities/courts/${option.toLowerCase().replace(/ /g, '-')}`}
                    className="block w-full text-left py-3 hover:bg-gray-100 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 text-sm"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Card */}
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-48">
              <img
                src="/images/room.png"
                alt="Meeting Rooms"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                <h3 className="text-2xl font-bold">Rooms</h3>
                <button 
                  onClick={() => toggleDropdown('rooms')}
                  className="bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors"
                >
                  <svg className={`w-5 h-5 text-gray-800 transform transition-transform ${activeDropdown === 'rooms' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out bg-white ${activeDropdown === 'rooms' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="border-t border-gray-100 px-4">
                {roomsOptions.map((option, index) => (
                  <Link
                    key={index}
                    to={`/facilities/rooms/${option.toLowerCase().replace(/ /g, '-')}`}
                    className="block w-full text-left py-3 hover:bg-gray-100 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 text-sm"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#00172D] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Logo */}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="ReserV8 Logo"
                  className="h-12 w-auto brightness-0 invert"
                />
                <span className="text-2xl font-bold text-white">ReserV8</span>
              </Link>
            </div>

            {/* About Section */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-xl">About ReserV8</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Who We Are</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Contact Us</a></li>
              </ul>
            </div>

            {/* Learn More */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-xl">Learn More</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white hover:underline text-base">Terms</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-xl">Follow Us</h4>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-300 hover:text-white hover:underline">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.23 0H1.77C.8 0 0 .8 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.7c-1.15 0-2.08-.95-2.08-2.1 0-1.15.93-2.1 2.08-2.1 1.15 0 2.08.95 2.08 2.1 0 1.15-.93 2.1-2.08 2.1zm14.63 12.4h-3.62v-5.67c0-1.35-.02-3.1-1.88-3.1-1.88 0-2.17 1.47-2.17 3v5.77h-3.62V9.24h3.48v1.6h.05c.48-.92 1.65-1.88 3.4-1.88 3.65 0 4.32 2.4 4.32 5.53v5.61z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white hover:underline">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white hover:underline">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.5 6.2c-.2-.7-.7-1.2-1.4-1.4C20.3 4.3 12 4.3 12 4.3s-8.3 0-10.1.5c-.7.2-1.2.7-1.4 1.4C0 8 0 12 0 12s0 4 .5 5.8c.2.7.7 1.2 1.4 1.4 1.8.5 10.1.5 10.1.5s8.3 0 10.1-.5c.7-.2 1.2-.7 1.4-1.4.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.6V8.4l6.7 3.6-6.7 3.6z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white hover:underline">
                  <span>India</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white hover:underline">
                  <span>English</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-300">
                © 2025 ReserV8. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 