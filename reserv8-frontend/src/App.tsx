import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import DiningPage from './pages/DiningPage';
import FacilitiesPage from './pages/FacilitiesPage';
import FacilityBookingPage from './pages/FacilityBookingPage';
import RestaurantPage from './pages/RestaurantPage';
import LandingPage from './pages/LandingPage';
import FooterPage from './pages/FooterPage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user is not verified, sign them out and redirect to auth
  if (!currentUser.emailVerified) {
    logout(); // Sign out unverified users
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children};</>;
}

function AppContent() {
  const location = useLocation();
  const isDiningPage = location.pathname === '/dining';
  const { currentUser } = useAuth();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen bg-[#e3e1d9]">
      {!isAuthPage && <Header bgColor={isDiningPage ? 'bg-gray-900' : 'bg-transparent'} />}
      <Routes>
        <Route path="/auth" element={!currentUser ? <Signup /> : <Navigate to="/home" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to={currentUser ? '/home' : '/auth'} replace />} />
        <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        <Route path="/dining" element={<ProtectedRoute><DiningPage /></ProtectedRoute>} />
        <Route path="/facilities" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/facilities/:facilityId" element={<ProtectedRoute><FacilityBookingPage /></ProtectedRoute>} />
        <Route path="/restaurant/:restaurantId" element={<ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
        <Route path="/footer" element={<ProtectedRoute><FooterPage /></ProtectedRoute>} />
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
