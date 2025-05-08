import React, { useState } from 'react';

interface Review {
  Reviewer: string;
  Review: string;
  Rating: number;
}

interface ReviewsSectionProps {
  initialReviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ initialReviews }) => {
  const [reviews] = useState<Review[]>(initialReviews);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-100 p-4 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>;
  }

  if (error) {
    return null; // Hide the reviews section if there's an error
  }

  if (reviews.length === 0) {
    return null; // Hide the section if there are no reviews
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{review.Reviewer}</span>
              <div className="flex items-center">
                <span className="text-yellow-500">
                  {Array.from({ length: review.Rating }, (_, i) => (
                    <span key={i}>★</span>
                  ))}
                </span>
                <span className="text-gray-400 ml-1">/5</span>
              </div>
            </div>
            <p className="text-gray-600">{review.Review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
