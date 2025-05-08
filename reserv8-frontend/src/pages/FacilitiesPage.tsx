import React from 'react';
import FacilityCard from '../components/FacilityCard';
import Header from '../components/Header';

interface Facility {
  id: string;
  name: string;
  category: string;
  image: string;
  slots: number;
}

// Facility data
const facilities: { courts: Facility[]; rooms: Facility[] } = {
  courts: [
    { id: 'bc1', name: 'Badminton Court', category: 'Courts', image: '/images/badminton.jpg', slots: 20 },
    { id: 'vc1', name: 'Volley Ball Court', category: 'Courts', image: '/images/volleyball.jpg', slots: 15 },
    { id: 'sn1', name: 'Snooker', category: 'Courts', image: '/images/snooker.jpg', slots: 10 },
    { id: 'tc1', name: 'Tennis Court', category: 'Courts', image: '/images/tennis.jpg', slots: 15 },
    { id: 'tbc1', name: 'Throw Ball Court', category: 'Courts', image: '/images/throwball.jpg', slots: 12 },
    { id: 'cn1', name: 'Cricket Nets', category: 'Courts', image: '/images/cricketnets.jpg', slots: 18 },
    { id: 'bbc1', name: 'Basketball Court', category: 'Courts', image: '/images/basketball.jpg', slots: 15 },
  ],
  rooms: [
    { id: 'lr1', name: 'Library Rooms', category: 'Rooms', image: '/images/library.jpg', slots: 25 },
    { id: 'au1', name: 'Auditorium', category: 'Rooms', image: '/images/auditorium.jpg', slots: 8 },
    { id: 'cr1', name: 'Conference Rooms', category: 'Rooms', image: '/images/classrooms.jpg', slots: 12 },
  ]
};

function FacilitiesPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header bgColor="bg-[#00172D]" />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 md:mb-0">MU Facilities</h1>
        </div>
        
        {/* Courts Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sports Courts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.courts.map((facility) => (
              <FacilityCard
                key={facility.id}
                {...facility}
                slots={facility.slots}
                status="available"
              />
            ))}
          </div>
        </section>

        {/* Rooms Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Study & Meeting Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.rooms.map((facility) => (
              <FacilityCard
                key={facility.id}
                {...facility}
                slots={facility.slots}
                status="available"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default FacilitiesPage;