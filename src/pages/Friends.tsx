import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserFriends, getInvitationByCode, acceptInvitation } from '../services/userService';
import { User } from '../types';
import FriendInviteForm from '../components/FriendInviteForm';

export default function Friends() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);
  
  // Load friends
  useEffect(() => {
    async function loadFriends() {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getUserFriends(currentUser.id);
        setFriends(data);
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFriends();
  }, [currentUser]);
  
  // Handle invitation success
  const handleInviteSuccess = (code: string) => {
    setInviteCode(code);
    setShowInviteForm(false);
  };
  
  // Generate invitation link
  const inviteLink = inviteCode 
    ? `${window.location.origin}/signup?code=${inviteCode}`
    : '';
  
  // Handle join with code
  const handleJoinWithCode = async () => {
    if (!currentUser || !codeInput) return;
    
    try {
      setError('');
      await acceptInvitation(codeInput, currentUser.id);
      
      // Reload friends
      const data = await getUserFriends(currentUser.id);
      setFriends(data);
      
      // Clear code input
      setCodeInput('');
    } catch (error) {
      console.error('Error joining with code:', error);
      setError('Invalid or expired invitation code');
    }
  };
  
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert('Invitation link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link:', err));
  };
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Friends</h2>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Invite Friend
          </button>
        </div>
        
        {inviteCode && (
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-t border-b border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Invitation created!</h3>
            <p className="text-sm text-blue-700 mb-2">
              Share this link with your friend to connect:
            </p>
            <div className="flex">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-grow px-3 py-2 border rounded-l-md text-sm"
              />
              <button
                onClick={copyInviteLink}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Or share this code: <span className="font-bold">{inviteCode}</span>
            </p>
          </div>
        )}
        
        {showInviteForm ? (
          <div className="px-4 py-5 sm:px-6">
            <FriendInviteForm onSuccess={handleInviteSuccess} />
          </div>
        ) : (
          <>
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Have a code?</h3>
              <div className="flex">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter invitation code"
                  className="flex-grow px-3 py-2 border rounded-l-md text-sm"
                />
                <button
                  onClick={handleJoinWithCode}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm"
                >
                  Join
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Friends</h3>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">You don't have any friends yet.</p>
                  <p className="text-gray-500 mt-2">
                    Invite parents to connect and share activities!
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {friends.map(friend => (
                    <li key={friend.id} className="py-4 flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {friend.childNickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {friend.childNickname}'s Parent
                        </p>
                        <p className="text-sm text-gray-500">
                          {friend.email}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}