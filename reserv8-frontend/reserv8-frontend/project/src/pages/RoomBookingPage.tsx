import React from 'react';
import { useParams } from 'react-router-dom';

function RoomBookingPage() {
  const { roomId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Room Booking</h1>
        <p className="text-gray-600">Coming Soon: Book {roomId}!</p>
      </div>
    </div>
  );
}

export default RoomBookingPage; 