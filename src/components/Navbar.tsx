import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">ParentPlanner</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {currentUser.childNickname}'s Parent
                </span>
                <div className="flex space-x-2">
                  <Link 
                    to="/calendar" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Calendar
                  </Link>
                  <Link 
                    to="/friends" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Friends
                  </Link>
                  <button
                    onClick={signOut}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/signin" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}