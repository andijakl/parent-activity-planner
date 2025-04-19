import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            ParentPlanner
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Plan activities with other parents and make your children's play dates easier.
          </p>
          
          {!currentUser ? (
            <div className="mt-10 flex justify-center space-x-6">
              <Link 
                to="/signin" 
                className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <Link 
                to="/calendar" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Calendar
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Plan Activities</h2>
            <p className="text-gray-600">
              Easily plan playdates, trips, and other activities for your children.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Connect with Parents</h2>
            <p className="text-gray-600">
              Find and connect with other parents to coordinate activities together.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Join Activities</h2>
            <p className="text-gray-600">
              Discover activities planned by your friends and join them with a single click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}