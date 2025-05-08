import React from 'react';
import { Link } from 'react-router-dom';
import ReviewsSection from './ReviewsSection';

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisines: string;
  rating: number;
  priceForTwo: string;
  location: string;
  image: string;
  discount?: string;
  closingTime?: string;
  distance?: string;
  Reviews?: string; // Reviews from database
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  cuisines,
  rating,
  priceForTwo,
  location,
  image,
  discount,
  closingTime,
  distance,
  Reviews
}) => {
  return (
    <Link to={`/restaurant/${id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || '/images/default-restaurant.jpg'}
            alt={name}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== '/images/default-restaurant.jpg') {
                img.src = '/images/default-restaurant.jpg';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
              {discount}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center px-2 py-1 rounded bg-green-100">
              <span className="text-green-700 font-medium">{rating}</span>
              <span className="text-yellow-500 ml-1">★</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>{cuisines}</span>
            <span>{priceForTwo}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{location}</span>
            {distance && <span className="text-gray-500">{distance}</span>}
          </div>

          {closingTime && (
            <div className="mt-2 text-sm text-red-500">
              Closes in {closingTime}
            </div>
          )}
          
          {/* Reviews Section */}
          {Reviews && <ReviewsSection initialReviews={JSON.parse(Reviews)} />}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard; 