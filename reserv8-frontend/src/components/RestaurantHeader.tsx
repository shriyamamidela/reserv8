import { Link } from 'react-router-dom';

export default function RestaurantHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Reserv8"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-[#1a73e8]">ReserV8</span>
            </div>
          </Link>

          {/* Right side items */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-[#5f6368] hover:text-[#202124] font-medium text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                to="/dining"
                className="text-[#5f6368] hover:text-[#202124] font-medium text-sm transition-colors"
              >
                Dining
              </Link>
              <Link
                to="/contact"
                className="text-[#5f6368] hover:text-[#202124] font-medium text-sm transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-[#5f6368] hover:text-[#202124] font-medium text-sm">
                Log in
              </button>
              <button className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#1557b0] transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
