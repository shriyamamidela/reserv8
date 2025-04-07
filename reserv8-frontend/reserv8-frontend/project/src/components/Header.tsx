import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, X, User, Mail, Search } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisines: string;
  address: string;
  rating: number;
  price_range?: string;
  description?: string;
  image?: string;
  opening_hours?: string;
}

interface HeaderProps {
  bgColor?: string;
}

export default function Header({ bgColor = 'bg-transparent' }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState(['', '', '', '']);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      console.log('Empty search query, clearing results');
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Search across all three endpoints
      const searchPromises = [
        // Search by cuisine
        fetch(`http://localhost:5000/restaurants/cuisine/${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }),
        // Search by name
        fetch(`http://localhost:5000/restaurants/name/${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }),
        // Search by location
        fetch(`http://localhost:5000/restaurants/location/${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        })
      ];

      const responses = await Promise.allSettled(searchPromises);
      const allResults = new Set(); // Use Set to remove duplicates

      // Process each response
      for (const response of responses) {
        if (response.status === 'fulfilled' && response.value.ok) {
          const data = await response.value.json();
          if (Array.isArray(data)) {
            data.forEach(restaurant => {
              if (restaurant && restaurant.Name && restaurant.Cuisines) {
                allResults.add(JSON.stringify({
                  id: restaurant.Links?.split('/').pop() || String(Math.random()),
                  name: restaurant.Name,
                  cuisines: restaurant.Cuisines,
                  address: restaurant.Address || 'Gachibowli, Hyderabad',
                  rating: restaurant.Rating || 'N/A',
                  price_range: `₹${restaurant.Cost || 'N/A'} for two`,
                  description: restaurant.Collections
                }));
              }
            });
          }
        }
      }

      // Convert Set back to array and parse JSON strings
      const validResults = Array.from(allResults).map(item => JSON.parse(item));
      
      console.log('✅ Valid results:', validResults);
      console.log(`📊 Found ${validResults.length} valid restaurants`);
      
      setSearchResults(validResults);
      setShowResults(true);
    } catch (error) {
      console.error('❌ Error searching restaurants:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Search as user types with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hide login modal and show OTP modal
    setShowLoginModal(false);
    setShowOtpModal(true);
    // In a real application, you would make an API call here to send the OTP
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify OTP (in a real app, this would be validated against the server)
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      setIsLoggedIn(true);
      setUsername(loginForm.email.split('@')[0]);
      setShowOtpModal(false);
      setLoginForm({ email: '', password: '' });
      setOtp(['', '', '', '']);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value !== '' && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
      <nav className={`absolute w-full py-4 px-8 z-50 ${bgColor}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Company Logo and Name */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="ReserV8 Logo"
              className="h-16 w-auto -my-4"
            />
            <span className="text-white text-xl font-bold">ReserV8</span>
          </Link>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div id="search-container" className="relative">
              <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-[400px]">
                <div className="flex-1 flex items-center px-3">
                  <Search className="text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-2 outline-none"
                    placeholder="Search restaurants, cuisines, or locations..."
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-[400px] overflow-y-auto z-50">
                  <div className="p-2 text-sm text-gray-500 border-b">
                    Found {searchResults.length} restaurants
                  </div>
                  {searchResults.map((restaurant, index) => (
                    <Link
                      key={restaurant.id || `restaurant-${index}`}
                      to={`/restaurant/${restaurant.id || index}`}
                      className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600">{restaurant.cuisines}</p>
                          <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                          {restaurant.price_range && (
                            <p className="text-sm text-gray-500 mt-1">
                              Price Range: {restaurant.price_range}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-sm text-gray-600">{restaurant.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Conditional rendering based on login state */}
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="text-white hover:text-gray-200 flex items-center gap-2 transition-colors"
                >
                  <LogIn size={20} />
                  Log in
                </button>
                <button
                  onClick={handleSignUp}
                  className="text-white hover:text-gray-200 flex items-center gap-2 transition-colors"
                >
                  <UserPlus size={20} />
                  Sign up
                </button>
              </>
            ) : (
              <div className="relative group">
                <button className="text-white hover:text-gray-200 flex items-center gap-2 transition-colors">
                  <User size={20} />
                  <span>{username}</span>
                </button>
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtp(['', '', '', '']);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Enter Verification Code</h2>
              <p className="text-gray-600 mt-2">
                We've sent a code to {loginForm.email}
              </p>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center gap-4 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={() => {
                    // In a real app, this would trigger sending a new OTP
                    setOtp(['', '', '', '']);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 