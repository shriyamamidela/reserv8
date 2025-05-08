import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import axios from 'axios';

export default function Signup() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        try {
          console.log('Starting signup process...');
          setError('');
          setIsLoading(true);
          
          // First create Firebase user and send verification email
          console.log('Creating Firebase user...');
          const userCredential = await signup(email, password);
          console.log('Firebase user created successfully');
          
          // Show verification message immediately and stop loading
          setError('');
          setMessage('Verification link has been sent to your email! Please check your inbox.');
          setIsLoading(false);
          
          try {
            // Try backend registration separately
            console.log('Getting ID token...');
            const idToken = await userCredential.user.getIdToken();
            console.log('Got ID token');

            console.log('Registering user in backend...');
            const response = await axios.post('http://localhost:5001/register', {
              idToken,
              email,
              name: email.split('@')[0] // Using email username as name
            });
            console.log('Backend registration response:', response.data);
          } catch (backendError) {
            // If backend registration fails, we still keep the success message
            // since the user was created and verification email was sent
            console.error('Backend registration failed:', backendError);
          }
        } catch (error) {
          if (error instanceof FirebaseError) {
            setError(error.message);
          } else {
            setError('Failed to create account');
          }
          setIsLoading(false);
        }
        // Message already set after email verification
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code) {
        console.error('Firebase error code:', err.code);
      }
      setError(err.message || (isSignUp ? 'Failed to create an account' : 'Failed to sign in'));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side with logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 items-center justify-center p-12">
        <div className="text-center">
          <img
            src="/images/logo2.png"
            alt="Reserv8 Logo"
            className="mx-auto w-48 h-48 object-contain mb-8"
          />
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome to Reserv8</h1>
          <p className="text-gray-600 text-lg">Your one-stop solution for restaurant reservations</p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Logo for mobile view */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src="/images/logo2.png"
              alt="Reserv8 Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isSignUp ? (
                <span>Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</button></span>
              ) : (
                <span>Need an account? <button type="button" onClick={() => setIsSignUp(true)} className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</button></span>
              )}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              {isSignUp && (
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}