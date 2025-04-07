import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Handle countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Check email verification status whenever currentUser changes
  useEffect(() => {
    const checkVerification = async () => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          setShowResendButton(true);
          await sendEmailVerification(currentUser);
          setError('Please verify your email first. A verification email has been sent.');
        } else {
          // Email is verified, navigate to home
          navigate('/');
        }
      }
    };

    checkVerification();
  }, [currentUser, navigate]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    try {
      setIsLoading(true);
      if (currentUser) {
        await sendEmailVerification(currentUser);
        setError('A new verification email has been sent. Please check your inbox.');
        setResendCooldown(60); // Set 60 seconds cooldown
      }
    } catch (err) {
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      
      // Authenticate with Firebase
      const userCredential = await login(email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        setIsLoading(false);
        return;
      }
  
      // Get Firebase ID token
      const idToken = await user.getIdToken();
  
      // Send token to backend for verification
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        navigate('/'); // Redirect to home page
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            {showResendButton && (
              <div className="mt-2">
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading || resendCooldown > 0}
                  className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend email in ${resendCooldown}s`
                    : 'Resend verification email'}
                </button>
              </div>
            )}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
