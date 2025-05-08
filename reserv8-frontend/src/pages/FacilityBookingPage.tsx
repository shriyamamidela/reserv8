import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { facilities } from '../data/facilities';
import Header from '../components/Header';

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

function FacilityBookingPage() {
  const { facilityId } = useParams();
  const facility = facilities.find(f => f.id === facilityId);

  const [form, setForm] = useState({ date: '', time: '', name: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(facility?.slots || 0);

  if (!facility) {
    return <div>Facility not found.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableSlots > 0) {
      setAvailableSlots(prev => prev - 1);
      setConfirmed(true);
    } else {
      alert('No slots available for this facility.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header bgColor="bg-gray-900" />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Facility Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Book {facility.name}</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Image */}
            <div className="md:w-1/2">
              <img
                src={facility.image_url}
                alt={facility.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-facility.jpg';
                }}
              />
            </div>

            {/* Right Column - Booking Form or Confirmation */}
            <div className="md:w-1/2 flex flex-col justify-center">
              {!confirmed ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Reserve this Facility</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Available Slots: {availableSlots}</p>
                  <button
                    type="submit"
                    className="mt-6 w-full bg-[#1a73e8] text-white py-2 px-4 rounded-md hover:bg-[#1557b0] transition-colors"
                    disabled={availableSlots === 0}
                  >
                    {availableSlots === 0 ? 'No Slots Available' : 'Reserve'}
                  </button>
                </form>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Thank you for reserving <b>{facility.name}</b></p>
                    <p>Date: {form.date}</p>
                    <p>Time: {form.time}</p>
                    <p>Name: {form.name}</p>
                    <p>Remaining Slots: {availableSlots}</p>
                  </div>
                  <button
                    onClick={() => setConfirmed(false)}
                    className="mt-6 bg-[#1a73e8] text-white py-2 px-4 rounded-md hover:bg-[#1557b0] transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilityBookingPage;
