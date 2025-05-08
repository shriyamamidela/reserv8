import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Search, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

interface RestaurantSearchResult {
  Links?: string;
  Name: string;
  Cuisines: string;
  Address?: string;
  Rating?: string | number;
  Cost?: string | number;
  Collections?: string;
}

interface HeaderProps {
  bgColor?: string;
}

export default function Header({ bgColor = 'bg-transparent' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const isRestaurantPage = location.pathname.includes('/restaurant/');
  const isFacilityBookingPage = location.pathname.startsWith('/facilities/') && location.pathname !== '/facilities';

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
        fetch(`http://localhost:5001/restaurants/cuisine/${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }),
        // Search by name
        fetch(`http://localhost:5001/restaurants/name/${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }),
        // Search by location
        fetch(`http://localhost:5001/restaurants/location/${encodeURIComponent(searchQuery)}`, {
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
            data.forEach((restaurant: RestaurantSearchResult) => {
              if (restaurant && restaurant.Name && restaurant.Cuisines) {
                allResults.add(JSON.stringify({
                  id: (restaurant.Links && typeof restaurant.Links === 'string') ? restaurant.Links.split('/').pop() || String(Math.random()) : String(Math.random()),
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
      const validResults = Array.from(allResults).map((item) => {
        if (typeof item === 'string') {
          return JSON.parse(item);
        }
        return null;
      }).filter((item): item is Restaurant => item !== null);
      
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className={`absolute w-full py-4 px-8 z-50 ${bgColor}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Company Logo and Name */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="ReserV8 Logo"
              className="h-16 w-auto -my-4"
            />
            <span className="text-white text-xl font-bold">ReserV8</span>
          </Link>
          
          {(isRestaurantPage || isFacilityBookingPage) && (
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white hover:text-gray-200 flex items-center gap-2">
                <Home size={20} />
                Home
              </Link>
              {isRestaurantPage ? (
                <Link to="/dining" className="text-white hover:text-gray-200">
                  Dining
                </Link>
              ) : (
                <Link to="/facilities" className="text-white hover:text-gray-200">
                  Facilities
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Side Navigation */}
        <div className="flex items-center space-x-6">
          {/* Search Bar - Only show if not on restaurant page or facility booking page */}
          {!isRestaurantPage && !isFacilityBookingPage && (
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
          )}

          {/* User Profile */}
          {currentUser ? (
            <div className="relative group">
              <button className="text-white hover:text-gray-200 flex items-center gap-2 transition-colors">
                <User size={20} />
                <span>{currentUser.email?.split('@')[0]}</span>
              </button>
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>


    </nav>
  );
}