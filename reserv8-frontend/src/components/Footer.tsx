
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#00172D] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Logo */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="ReserV8 Logo"
                className="h-12 w-auto brightness-0 invert"
              />
              <span className="text-2xl font-bold text-white">ReserV8</span>
            </Link>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xl">About ReserV8</h4>
            <ul className="space-y-3">
              <li><Link to="/footer#about" className="text-gray-300 hover:text-white hover:underline text-base">Who We Are</Link></li>
              <li><Link to="/footer#blog" className="text-gray-300 hover:text-white hover:underline text-base">Blog</Link></li>
              <li><Link to="/footer#contact" className="text-gray-300 hover:text-white hover:underline text-base">Contact Us</Link></li>
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xl">Learn More</h4>
            <ul className="space-y-3">
              <li><Link to="/footer#privacy" className="text-gray-300 hover:text-white hover:underline text-base">Privacy</Link></li>
              <li><Link to="/footer#security" className="text-gray-300 hover:text-white hover:underline text-base">Security</Link></li>
              <li><Link to="/footer#terms" className="text-gray-300 hover:text-white hover:underline text-base">Terms</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xl">Follow Us</h4>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-white hover:underline">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 0H1.77C.8 0 0 .8 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46c.98 0 1.77-.8 1.77-1.77V1.77C24 .8 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.7c-1.15 0-2.08-.95-2.08-2.1 0-1.15.93-2.1 2.08-2.1 1.15 0 2.08.95 2.08 2.1 0 1.15-.93 2.1-2.08 2.1zm14.63 12.4h-3.62v-5.67c0-1.35-.02-3.1-1.88-3.1-1.88 0-2.17 1.47-2.17 3v5.77h-3.62V9.24h3.48v1.6h.05c.48-.92 1.65-1.88 3.4-1.88 3.65 0 4.32 2.4 4.32 5.53v5.61z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white hover:underline">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white hover:underline">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2c-.2-.7-.7-1.2-1.4-1.4C20.3 4.3 12 4.3 12 4.3s-8.3 0-10.1.5c-.7.2-1.2.7-1.4 1.4C0 8 0 12 0 12s0 4 .5 5.8c.2.7.7 1.2 1.4 1.4 1.8.5 10.1.5 10.1.5s8.3 0 10.1-.5c.7-.2 1.2-.7 1.4-1.4.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.6V8.4l6.7 3.6-6.7 3.6z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white hover:underline">
                <span>India</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button className="text-gray-300 hover:text-white hover:underline">English</button>
            </div>
            <p className="text-gray-300">&copy; {new Date().getFullYear()} ReserV8. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 