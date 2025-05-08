import React, { useState, useEffect } from 'react';
import { Search, MapPin, LogIn, UserPlus, DollarSign } from 'lucide-react';

function App() {
  const [location, setLocation] = useState('Jubilee Hills, Hyderabad');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]); // Store API data

  // 1️⃣ Fetch All Restaurants when the component loads
  useEffect(() => {
    fetch("http://localhost:5001/restaurants")
      .then(response => response.json())
      .then(data => {
        console.log("✅ All Restaurants Data:", data); // Debugging
        setRestaurants(data);
      })
      .catch(error => console.error("❌ Error fetching restaurants:", error));
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      console.log("Search query is empty");
      return;
    }

    console.log("Searching for:", searchQuery);

    try {
      const url = `http://localhost:5001/restaurants/cuisine/${searchQuery}`;
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!Array.isArray(data)) {
        console.error("Received non-array data:", data);
        setRestaurants([]);
        return;
      }

      setRestaurants(data);
    } catch (error) {
      console.error("Error during search:", error);
      setRestaurants([]); // Clear results on error
    }
  };

  // 2️⃣ Fetch Restaurants by Location
  const fetchRestaurantsByLocation = () => {
    if (!location) return;
    fetch(`http://localhost:5001/restaurants/location/${location}`)
      .then(response => response.json())
      .then(data => {
        console.log(`✅ Restaurants at ${location}:`, data);
        setRestaurants(data);
      })
      .catch(error => console.error("❌ Error fetching by location:", error));
  };

  // 3️⃣ Fetch Restaurants by Cuisine
  const fetchRestaurantsByCuisine = () => {
    if (!searchQuery) return;
    fetch(`http://localhost:5001/restaurants/cuisine/${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        console.log(`✅ Restaurants serving ${searchQuery}:`, data);
        setRestaurants(data);
      })
      .catch(error => console.error("❌ Error fetching by cuisine:", error));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070')`
        }}
      >
        {/* Navigation */}
        <nav className="absolute w-full py-4 px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Search Bar */}
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-[500px]">
              <div className="flex items-center px-4 border-r border-gray-300">
                <MapPin className="text-red-500" size={20} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="p-2 outline-none w-[150px]"
                  placeholder="Location"
                />
              </div>
              <div className="flex-1 flex items-center px-4">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 outline-none"
                  placeholder="Search for restaurants, cuisines or dishes"
                />
              </div>
              <button 
                onClick={handleSearch} 
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Auth Links */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-white hover:text-gray-200 flex items-center gap-2">
                <LogIn size={20} />
                Log in
              </a>
              <a href="#" className="text-white hover:text-gray-200 flex items-center gap-2">
                <UserPlus size={20} />
                Sign up
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-4xl px-4">
          <h1 className="text-5xl font-bold text-white mb-8">
            Discover the best food & drinks in Hyderabad
          </h1>
          <button 
            onClick={fetchRestaurantsByLocation} 
            className="bg-white text-red-500 px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Find Restaurants Near You
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Online Card */}
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1576866206061-0e142b423f55?auto=format&fit=crop&q=80&w=1000"
                alt="Order Online"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Order Online</h3>
                <p className="text-sm mt-1">Stay home and order to your doorstep</p>
              </div>
            </div>
          </div>

          {/* Dining Card */}
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
                alt="Dining"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">Dining</h3>
                <p className="text-sm mt-1">View the city's favorite dining venues</p>
              </div>
            </div>
          </div>

          {/* Investors Card */}
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000"
                alt="Investors"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign size={24} />
                  Investors
                </h3>
                <p className="text-sm mt-1">Partner with us in the food revolution</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Restaurants */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Restaurants</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
                  <p className="text-gray-600 mt-1">{restaurant.cuisines}</p>
                  <p className="text-gray-500 mt-2">{restaurant.address}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4">⭐ {restaurant.rating || 'N/A'}</span>
                    <span>💰 {restaurant.price_range || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No restaurants found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
