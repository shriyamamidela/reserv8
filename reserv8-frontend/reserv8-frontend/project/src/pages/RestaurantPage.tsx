import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Armchair, Star, MapPin, IndianRupee } from 'lucide-react';
import RestaurantHeader from '../components/RestaurantHeader';

interface Restaurant {
  Name: string;
  Links: string;
  Cost: number;
  Collections: string;
  Cuisines: string;
  Timings: string;
  Rating: number;
  Address: string;
  Reviews: {
    Reviewer: string;
    Review: string;
    Rating: number;
  }[];
}

function RestaurantPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    people: 1,
    name: '',
    email: '',
    phone: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        console.log('Fetching restaurant with ID:', restaurantId);
        const response = await fetch(`http://localhost:5000/restaurants/${restaurantId}`);
        if (!response.ok) {
          throw new Error('Restaurant not found');
        }
        const data = await response.json();
        console.log('Fetched restaurant data:', data);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  // Mock data for UI layout
  const mockTimeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', 
    '1:00 PM', '1:30 PM', '2:00 PM', '5:00 PM', 
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Restaurant Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{restaurant.Name}</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Image */}
            <div className="md:w-1/2">
              <img
                src="/images/restaurant-interior.jpg"
                alt={restaurant.Name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Right Column - Details */}
            <div className="md:w-1/2 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-semibold">Hours:</span>
                    <p className="mt-1">{restaurant.Timings}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-semibold">Cuisine:</span>
                    <p className="mt-1">{restaurant.Cuisines}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <IndianRupee className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-semibold">Price:</span>
                    <p className="mt-1">₹{restaurant.Cost} for two</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-semibold">Location:</span>
                    <p className="mt-1">{restaurant.Address}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center text-gray-700">
                  <div>
                    <span className="font-semibold">Rating:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(restaurant.Rating)}
                      <span className="ml-2">{restaurant.Rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Seating Info */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Seating Availability</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      8 Tables Available
                    </p>
                    <p>Total Capacity: 32 Seats</p>
                    <p>Indoor & Outdoor Seating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurant.Reviews?.map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{review.Reviewer}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(review.Rating)}
                      <span className="ml-1 text-sm text-gray-600">{review.Rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.Review}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          {!showConfirmation ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a time</option>
                    {mockTimeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <input
                    type="number"
                    name="people"
                    value={bookingData.people}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-[#1a73e8] text-white py-2 px-4 rounded-md hover:bg-[#1557b0] transition-colors"
              >
                Book Table
              </button>
            </form>
          ) : (
            /* Confirmation */
            <div className="bg-white rounded-lg shadow-md p-6 text-center mt-12">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <div className="space-y-2 text-gray-600">
                <p>Thank you for your reservation at {restaurant.Name}</p>
                <p>Date: {bookingData.date}</p>
                <p>Time: {bookingData.time}</p>
                <p>Number of People: {bookingData.people}</p>
                <p>A confirmation email has been sent to {bookingData.email}</p>
              </div>
              <button
                onClick={() => setShowConfirmation(false)}
                className="mt-6 bg-[#1a73e8] text-white py-2 px-4 rounded-md hover:bg-[#1557b0] transition-colors"
              >
                Make Another Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantPage;