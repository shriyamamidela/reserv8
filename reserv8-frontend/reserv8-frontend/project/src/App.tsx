import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DiningPage from './pages/DiningPage';
import FacilitiesPage from './pages/FacilitiesPage';
import CourtBookingPage from './pages/CourtBookingPage';
import RoomBookingPage from './pages/RoomBookingPage';
import RestaurantPage from './pages/RestaurantPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';

function AppContent() {
  const location = useLocation();
  const isDiningPage = location.pathname === '/dining';

  return (
    <div className="min-h-screen bg-[#e3e1d9]">
      <Header bgColor={isDiningPage ? 'bg-gray-900' : 'bg-transparent'} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/facilities/courts/:courtId" element={<CourtBookingPage />} />
        <Route path="/facilities/rooms/:roomId" element={<RoomBookingPage />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
