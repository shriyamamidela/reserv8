import React from 'react';
import { Link } from 'react-router-dom';

interface FacilityCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  slots?: number;
  availability?: string;
  status?: 'available' | 'occupied';
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  id,
  name,
  category,
  image,
  slots,
  availability,
  status
}) => {
  return (
    <Link to={`/facilities/${id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || '/images/default-facility.jpg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {status && (
            <div className={`absolute top-4 left-4 px-2 py-1 rounded text-sm font-medium ${
              status === 'available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>{category}</span>
            {slots && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {slots} slots available
              </span>
            )}
          </div>

          {availability && (
            <div className="mt-2 text-sm text-gray-500">
              {availability}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FacilityCard;
