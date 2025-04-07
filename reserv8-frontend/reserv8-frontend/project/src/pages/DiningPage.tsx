import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import { Filter, Star, Clock, Utensils, MapPin } from 'lucide-react';

// Update interface to match actual API response
interface Restaurant {
  Name: string;
  Links: string;
  Cuisines: string;
  Rating: string;
  Cost: number;
  Address: string;
  Collections?: string;
}

function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch restaurants from your backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5001/restaurants');
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filterOptions = [
    { label: 'Rating: 4.5+', value: 'rating-4.5+', icon: Star },
    { label: 'Open Now', value: 'open-now', icon: Clock },
    { label: 'Outdoor Seating', value: 'outdoor', icon: Utensils },
    { label: 'Nearby', value: 'nearby', icon: MapPin },
  ];

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
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
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
              {restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  id={restaurant.Links.split('/').pop() || String(index)}
                  name={restaurant.Name}
                  cuisines={restaurant.Cuisines}
                  rating={parseFloat(restaurant.Rating) || 0}
                  priceForTwo={`₹${restaurant.Cost} for two`}
                  location={restaurant.Address}
                  image="/images/default-restaurant.jpg"
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