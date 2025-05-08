import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const FooterPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the hash from the URL (e.g., #about, #privacy, etc.)
    const hash = location.hash;
    if (hash) {
      // Remove the # from the hash
      const element = document.getElementById(hash.slice(1));
      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/home"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-[#00172D] font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          Home
        </Link>
      </div>
      {/* Hero Section */}
      <div className="relative h-[300px] bg-[#00172D] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070"
            alt="Restaurant interior"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to ReserV8</h1>
          <p className="text-xl text-gray-300">Your Premier Restaurant Reservation Platform</p>
        </div>
      </div>
      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-b from-[#00172D] to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">About ReserV8</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Who We Are</h3>
              <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070"
                  alt="Fine dining"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-gray-600 leading-relaxed">
                  ReserV8 is your premier destination for hassle-free restaurant reservations. 
                  We connect diners with their favorite restaurants, making the booking process 
                  seamless and enjoyable.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070"
                  alt="Restaurant interior"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to enhance the dining experience by providing a reliable and 
                  user-friendly platform for restaurant reservations, benefiting both diners 
                  and restaurant owners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Blog</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070"
                alt="Food plating"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00172D]">Top Dining Trends of 2025</h3>
                <p className="text-gray-600 leading-relaxed">
                  The restaurant industry is witnessing exciting transformations in 2025. Plant-based cuisine has evolved beyond imitation to create entirely new culinary experiences. Smart dining, powered by AI, is personalizing menu recommendations and dietary tracking. Sustainable practices have become a cornerstone, with restaurants adopting zero-waste policies and local sourcing. Interactive dining experiences, combining virtual reality with gastronomy, are creating unforgettable moments for diners.
                </p>
              </div>
            </article>
            <article className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=2070"
                alt="Chef cooking"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00172D]">Behind the Scenes: A Chef's Life</h3>
                <p className="text-gray-600 leading-relaxed">
                  Step into the bustling world of professional kitchens, where passion meets precision. Our featured chefs start their days at dawn, selecting the freshest ingredients from local markets. The kitchen symphony begins with prep work, moves through the intensity of service hours, and ends with planning tomorrow's innovations. Learn about their dedication to perfection, creative process, and the challenges they overcome to deliver exceptional dining experiences.
                </p>
              </div>
            </article>
            <article className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2070"
                alt="Fine dining experience"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00172D]">The Art of Fine Dining</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fine dining is a carefully orchestrated experience that engages all senses. From the moment guests arrive, every detail matters - the ambient lighting, the carefully curated music, the elegant table settings. Expert sommeliers pair wines with each course, while skilled servers time their service to perfection. The presentation of each dish is a work of art, combining colors, textures, and flavors to create moments of culinary delight.
                </p>
              </div>
            </article>
            {/* Add more blog posts as needed */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">Email: support@reserv8.com</p>
                <p className="text-gray-600 leading-relaxed">Phone: +1 (555) 123-4567</p>
              </div>
            </div>
            <form className="space-y-4 bg-white rounded-lg shadow-lg p-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#00172D] focus:border-[#00172D]" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#00172D] focus:border-[#00172D]" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#00172D] focus:border-[#00172D]"></textarea>
              </div>
              <button type="submit" className="bg-[#00172D] text-white px-4 py-2 rounded-md hover:bg-[#002D5C]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h2>
          <div className="prose max-w-none bg-white rounded-lg shadow-lg p-8">
            <p>Last updated: May 8, 2025</p>
            <h3>Information We Collect</h3>
            <p>We collect information that you provide directly to us, including your name, email address, phone number, and dining preferences. We also collect information about your dining history, reservations, and interactions with our platform to enhance your experience.</p>
            <h3>How We Use Your Information</h3>
            <p>We use the information we collect to provide and improve our services, personalize your dining experiences, process your reservations, send you relevant notifications, and maintain the security of our platform. Your data helps us understand dining trends and improve our restaurant recommendations.</p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Security</h2>
          <div className="prose max-w-none bg-white rounded-lg shadow-lg p-8">
            <p>At ReserV8, we take the security of your data seriously. Our platform employs state-of-the-art encryption protocols and regular security audits to ensure your information remains protected. We maintain strict access controls and monitor our systems 24/7 for any potential security threats.</p>
            <h3>Data Protection</h3>
            <p>We implement industry-standard security measures to protect your information, including secure socket layer (SSL) technology, two-factor authentication, and regular backups. Our security team continuously updates our protocols to address emerging threats and maintain compliance with international data protection standards.</p>
          </div>
        </div>
      </section>

      {/* Terms Section */}
      <section id="terms" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Terms of Service</h2>
          <div className="prose max-w-none bg-white rounded-lg shadow-lg p-8">
            <p>Last updated: May 8, 2025</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using ReserV8, you agree to be bound by these Terms of Service and our Privacy Policy. These terms constitute a legally binding agreement between you and ReserV8 regarding your use of our platform and services. If you do not agree with any part of these terms, you may not use our services.</p>
            <h3>2. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and current information during registration and to update such information to keep it accurate and current.</p>
            <h3>3. Reservation Policies</h3>
            <p>Users must honor their reservations or cancel them at least 2 hours in advance. Repeated no-shows may result in account suspension. Restaurants reserve the right to hold tables for 15 minutes past the reservation time before releasing them.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FooterPage;
