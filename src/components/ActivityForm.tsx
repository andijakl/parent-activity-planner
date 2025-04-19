import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createActivity } from '../services/activityService';
import { getCurrentDateString } from '../utils/helpers';

interface ActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ActivityForm({ onSuccess, onCancel }: ActivityFormProps) {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [date, setDate] = useState(getCurrentDateString());
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create an activity');
      return;
    }
    
    if (!name || !date || !time || !location) {
      setError('All fields are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createActivity({
        createdBy: currentUser.id,
        name,
        date,
        time,
        location
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating activity:', error);
      setError('Failed to create activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Activity</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Activity Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Playground Meetup"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getCurrentDateString()}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Central Park Playground"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Activity'}
          </button>
        </div>
      </form>
    </div>
  );
}