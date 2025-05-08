import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'courts' | 'rooms' | 'cuisines' | 'chains' | 'facilities' | null>(null);
  const [showLocationNotification, setShowLocationNotification] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  // Popular cuisines and chains
  const popularCuisines = [
    'North Indian',
    'South Indian',
    'Chinese',
    'Italian',
    'Continental',
    'Mughlai',
    'Thai',
    'Mexican'
  ];

  const popularChains = [
    'Paradise',
    'Shah Ghouse',
    'Bawarchi',
    'Pista House',
    'Cream Stone'
  ];


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
    { name: 'Badminton Court', id: 'bc1' },
    { name: 'Volley Ball Court', id: 'vc1' },
    { name: 'Snooker', id: 'sn1' },
    { name: 'Tennis Court', id: 'tc1' },
    { name: 'Throw Ball Court', id: 'tbc1' },
    { name: 'Cricket Nets', id: 'cn1' },
    { name: 'Basketball Court', id: 'bbc1' }
  ];

  const roomsOptions = [
    { name: 'Library Rooms', id: 'lr1' },
    { name: 'Auditorium', id: 'au1' },
    { name: 'Conference Rooms', id: 'cr1' }
  ];

  const toggleDropdown = (dropdown: 'courts' | 'rooms') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Request location permission and get coordinates
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            localStorage.setItem('userLocation', JSON.stringify({ latitude: lat, longitude: lng }));
            
            // Only show notification if permission wasn't previously granted
            if (!localStorage.getItem('locationPermissionGranted')) {
              setLocationMessage('Location access granted!');
              setShowLocationNotification(true);
              setTimeout(() => setShowLocationNotification(false), 3000);
              localStorage.setItem('locationPermissionGranted', 'true');
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            // Only show error if permission wasn't previously granted
            if (!localStorage.getItem('locationPermissionGranted')) {
              setLocationMessage('Please enable location access for better service.');
              setShowLocationNotification(true);
              setTimeout(() => setShowLocationNotification(false), 3000);
            }
          }
        );
      } else {
        // Only show error if it wasn't previously shown
        if (!localStorage.getItem('locationPermissionGranted')) {
          setLocationMessage('Geolocation is not supported by your browser.');
          setShowLocationNotification(true);
          setTimeout(() => setShowLocationNotification(false), 3000);
        }
      }  
    };

    getLocation();
  }, []);

  // Image slider effect
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

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#e3e1d9] relative">
      {/* Location Notification */}
      {showLocationNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-500 opacity-90">
          <p className="text-sm font-medium">{locationMessage}</p>
        </div>
      )}
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
                {popularCuisines.map((cuisine, index) => (
                  <Link
                    key={`cuisine-${index}`}
                    to={`/dining?cuisine=${encodeURIComponent(cuisine)}`}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {cuisine}
                  </Link>
                ))}
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
                {popularChains.map((chain, index) => (
                  <Link
                    key={`chain-${index}`}
                    to={`/dining?chain=${encodeURIComponent(chain)}`}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca]"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {chain}
                  </Link>
                ))}
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
                <Link to="/facilities/bc1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Badminton Court</Link>
                <Link to="/facilities/vc1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Volley Ball Court</Link>
                <Link to="/facilities/sn1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Snooker</Link>
                <Link to="/facilities/tc1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Tennis Court</Link>
                <Link to="/facilities/tbc1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Throw Ball Court</Link>
                <Link to="/facilities/cn1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Cricket Nets</Link>
                <Link to="/facilities/bbc1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Basketball Court</Link>

                <div className="px-4 py-2 font-semibold text-sm text-gray-800 bg-[#d1cfca] mt-2">Rooms</div>
                <Link to="/facilities/lr1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Library Rooms</Link>
                <Link to="/facilities/au1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300" onClick={() => setActiveDropdown(null)}>Auditorium</Link>
                <Link to="/facilities/cr1" className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#d1cfca] transition-colors border-b border-gray-300 last:border-b-0" onClick={() => setActiveDropdown(null)}>Conference Rooms</Link>
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
                {courtsOptions.map((option) => (
                  <Link
                    key={option.id}
                    to={`/facilities/${option.id}`}
                    className="block w-full text-left py-3 hover:bg-gray-100 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 text-sm"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option.name}
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
                {roomsOptions.map((option) => (
                  <Link
                    key={option.id}
                    to={`/facilities/${option.id}`}
                    className="block w-full text-left py-3 hover:bg-gray-100 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 text-sm"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage; 