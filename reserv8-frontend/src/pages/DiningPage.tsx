import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import { Filter, Star, MapPin, Plus, Minus } from 'lucide-react';

// Update interface to match actual API response
interface Restaurant {
  Name: string;
  Links: string;
  Cuisines: string;
  Rating: string;
  Cost: number;
  Address: string;
  Collections?: string;
  image_url?: string;
  Latitude?: number;
  Longitude?: number;
  distance?: number; // Distance from user's location in kilometers
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(15); // Default radius is 15km
  const [minRating, setMinRating] = useState(4.5); // Default minimum rating
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [costFilter, setCostFilter] = useState<string>('all'); // 'all', 'budget', 'moderate', 'expensive'
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const location = useLocation();

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cuisineParam = params.get('cuisine');
    const chainParam = params.get('chain');

    if (cuisineParam) {
      setSelectedCuisines([cuisineParam]);
    }

    if (chainParam) {
      setSelectedChain(chainParam);
    }
  }, [location]);

  // Extract unique cuisines from all restaurants
  const allCuisines = useMemo(() => {
    const cuisineSet = new Set<string>();
    restaurants.forEach(restaurant => {
      const cuisines = restaurant.Cuisines.split(',').map(c => c.trim());
      cuisines.forEach(cuisine => cuisineSet.add(cuisine));
    });
    return Array.from(cuisineSet).sort();
  }, [restaurants]);

  // Get user location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    console.log('Saved location from localStorage:', savedLocation);
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      console.log('Parsed user location:', location);
      setUserLocation(location);
    }
  }, []);

  // Fetch restaurants from your backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5001/restaurants');
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        
        // Calculate distance for each restaurant if user location is available
        if (userLocation) {
          console.log('Calculating distances with user location:', userLocation);
          const restaurantsWithDistance = data.map((restaurant: Restaurant) => {
            console.log('Restaurant coordinates:', {
              name: restaurant.Name,
              latitude: restaurant.Latitude, // Note: Capital L in Latitude
              longitude: restaurant.Longitude // Note: Capital L in Longitude
            });
            if (restaurant.Latitude && restaurant.Longitude) { // Changed to capital L
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                restaurant.Latitude, // Changed to capital L
                restaurant.Longitude // Changed to capital L
              );
              console.log(`Distance to ${restaurant.Name}: ${distance.toFixed(2)} km`);
              return { ...restaurant, distance };
            }
            console.log(`No coordinates for ${restaurant.Name}`);
            return restaurant;
          });
          setRestaurants(restaurantsWithDistance);
        } else {
          setRestaurants(data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [userLocation]); // Re-fetch and calculate distances when user location changes

  const filterOptions = [
    { label: `Rating: ${minRating}+`, value: 'rating-4.5+', icon: Star },
    { label: 'Nearby', value: 'nearby', icon: MapPin },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    // Apply cuisine filter
    if (selectedCuisines.length > 0) {
      const restaurantCuisines = restaurant.Cuisines.split(',').map(c => c.trim());
      if (!selectedCuisines.some(cuisine => restaurantCuisines.includes(cuisine))) {
        return false;
      }
    }

    // Apply chain filter
    if (selectedChain && !restaurant.Name.includes(selectedChain)) {
      return false;
    }

    // Apply cost filter
    if (costFilter !== 'all') {
      const cost = restaurant.Cost;
      if (costFilter === 'budget' && (cost < 0 || cost > 500)) return false;
      if (costFilter === 'moderate' && (cost < 500 || cost > 1500)) return false;
      if (costFilter === 'expensive' && cost < 1500) return false;
    }

    if (activeFilters.length === 0) return true;
    
    return activeFilters.some(filter => {
      if (filter === 'rating-4.5+') {
        return parseFloat(restaurant.Rating) >= minRating;
      }
      if (filter === 'nearby') {
        return restaurant.distance !== undefined && restaurant.distance <= radiusKm;
      }
      return false;
    });
  });

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Restaurants in Hyderabad
          </h1>

          {/* Filters */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Filter size={18} />
              <span>Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
            </button>

            {/* Filter Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button
                      onClick={() => setIsFilterModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Cuisine Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Cuisines</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {allCuisines.map((cuisine: string) => (
                        <button
                          key={cuisine}
                          onClick={() => {
                            setSelectedCuisines(prev =>
                              prev.includes(cuisine)
                                ? prev.filter(c => c !== cuisine)
                                : [...prev, cuisine]
                            );
                          }}
                          className={`px-3 py-2 text-sm rounded border ${selectedCuisines.includes(cuisine)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCostFilter(costFilter === 'budget' ? 'all' : 'budget')}
                        className={`px-4 py-2 rounded border ${costFilter === 'budget' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        Budget (₹0-500)
                      </button>
                      <button
                        onClick={() => setCostFilter(costFilter === 'moderate' ? 'all' : 'moderate')}
                        className={`px-4 py-2 rounded border ${costFilter === 'moderate' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        Moderate (₹500-1500)
                      </button>
                      <button
                        onClick={() => setCostFilter(costFilter === 'expensive' ? 'all' : 'expensive')}
                        className={`px-4 py-2 rounded border ${costFilter === 'expensive' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        Expensive (₹1500+)
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setActiveFilters([]);
                        setCostFilter('all');
                        setSelectedCuisines([]);
                        setSelectedChain('');
                        setIsFilterModalOpen(false);
                      }}
                      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setIsFilterModalOpen(false)}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeFilters.includes('nearby') && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-300 bg-white">
                <span className="text-sm text-gray-600">Radius:</span>
                <button
                  onClick={() => setRadiusKm(prev => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Decrease radius"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(radiusKm - 1) * 2}%, #e5e7eb ${(radiusKm - 1) * 2}%, #e5e7eb 100%)`
                  }}
                />
                <button
                  onClick={() => setRadiusKm(prev => Math.min(50, prev + 1))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Increase radius"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-600 min-w-[4rem]">{radiusKm} km</span>
              </div>
            )}
            {activeFilters.includes('rating-4.5+') && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-300 bg-white">
                <span className="text-sm text-gray-600">Min Rating:</span>
                <button
                  onClick={() => setMinRating(prev => Math.max(1, prev - 0.1))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Decrease rating"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(minRating - 1) * 25}%, #e5e7eb ${(minRating - 1) * 25}%, #e5e7eb 100%)`
                  }}
                />
                <button
                  onClick={() => setMinRating(prev => Math.min(5, prev + 0.1))}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Increase rating"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-600 min-w-[4rem]">{minRating.toFixed(1)}★</span>
              </div>
            )}
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => toggleFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                    activeFilters.includes(filter.value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Restaurant Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading restaurants...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  id={restaurant.Links.split('/').pop() || String(index)}
                  name={restaurant.Name}
                  cuisines={restaurant.Cuisines}
                  rating={parseFloat(restaurant.Rating) || 0}
                  priceForTwo={`₹${restaurant.Cost} for two`}
                  location={restaurant.Address}
                  image={restaurant.image_url || "/images/default-restaurant.jpg"}
                  distance={restaurant.distance ? `${restaurant.distance.toFixed(1)} km away` : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DiningPage;