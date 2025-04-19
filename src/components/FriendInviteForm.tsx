import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createInvitation } from '../services/userService';

interface FriendInviteFormProps {
  onSuccess: (code: string) => void;
}

export default function FriendInviteForm({ onSuccess }: FriendInviteFormProps) {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to invite friends');
      return;
    }
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const invitation = await createInvitation(currentUser.id, email);
      onSuccess(invitation.code);
    } catch (error) {
      console.error('Error creating invitation:', error);
      setError('Failed to create invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Invite Friend</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Friend's Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="friend@example.com"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </form>
    </div>
  );
}