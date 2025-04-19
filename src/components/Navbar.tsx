import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg 
                className="h-8 w-8 mr-2 text-blue-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 3v1m0 16v1m-9-9h1M21 12h1m-4.8-4.8L18 8m0 0l-1.8-1.8M6 16l-1.8 1.8M18 16l1.8 1.8M6 8L4.2 6.2" 
                />
              </svg>
              <span className="text-xl font-bold">ParentPlanner</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium bg-blue-500 px-3 py-1 rounded-full">
                  {currentUser.childNickname}'s Parent
                </span>
                <div className="flex space-x-2">
                  <Link 
                    to="/calendar" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                  >
                    Calendar
                  </Link>
                  <Link 
                    to="/friends" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                  >
                    Friends
                  </Link>
                  <button
                    onClick={signOut}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/signin" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100 transition duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg 
                className={`h-6 w-6 ${mobileMenuOpen ? 'hidden' : 'block'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`h-6 w-6 ${mobileMenuOpen ? 'block' : 'hidden'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-blue-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {currentUser ? (
            <>
              <div className="text-sm font-medium text-center py-2 px-3 bg-blue-800 rounded-md mb-2">
                {currentUser.childNickname}'s Parent
              </div>
              <Link 
                to="/calendar" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link 
                to="/friends" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Friends
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/signin" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}