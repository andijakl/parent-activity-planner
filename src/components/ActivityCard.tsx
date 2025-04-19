import { useState, useEffect } from 'react';
import { Activity, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { joinActivity, expressInterest } from '../services/activityService';
import { getUserById } from '../services/userService';
import { formatDateForDisplay } from '../utils/helpers';

interface ActivityCardProps {
  activity: Activity;
  refreshActivities: () => void;
}

export default function ActivityCard({ activity, refreshActivities }: ActivityCardProps) {
  const { currentUser } = useAuth();
  const [creator, setCreator] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isCreator = currentUser?.id === activity.createdBy;
  const isParticipant = activity.participants.includes(currentUser?.id || '');
  const isInterested = activity.interestedUsers.includes(currentUser?.id || '');
  
  useEffect(() => {
    async function loadUsers() {
      try {
        // Get activity creator
        const creatorData = await getUserById(activity.createdBy);
        setCreator(creatorData);
        
        // Get participants
        const participantPromises = activity.participants.map(userId => getUserById(userId));
        const participantData = await Promise.all(participantPromises);
        setParticipants(participantData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, [activity]);

  const handleJoin = async () => {
    if (!currentUser) return;
    
    try {
      await joinActivity(activity.id, currentUser.id);
      refreshActivities();
    } catch (error) {
      console.error('Error joining activity:', error);
    }
  };

  const handleInterest = async () => {
    if (!currentUser) return;
    
    try {
      await expressInterest(activity.id, currentUser.id);
      refreshActivities();
    } catch (error) {
      console.error('Error expressing interest:', error);
    }
  };
  
  if (loading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-40"></div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{activity.name}</h3>
          <p className="text-gray-600">
            {formatDateForDisplay(activity.date)} at {activity.time}
          </p>
          <p className="text-gray-600">{activity.location}</p>
          <p className="text-sm text-gray-500 mt-1">
            Created by: {creator?.childNickname}'s parent
          </p>
        </div>
        
        {!isCreator && !isParticipant && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleJoin}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Join
            </button>
            
            {!isInterested && (
              <button
                onClick={handleInterest}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              >
                Interested
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Participants section */}
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700">Participants:</h4>
        <div className="flex flex-wrap mt-1">
          {participants.map(participant => (
            <span
              key={participant.id}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
            >
              {participant.childNickname}'s parent
            </span>
          ))}
        </div>
      </div>
      
      {/* Interested users section */}
      {activity.interestedUsers.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700">Interested:</h4>
          <div className="flex flex-wrap mt-1">
            {activity.interestedUsers.map(async (userId) => {
              try {
                const user = await getUserById(userId);
                return (
                  <span
                    key={userId}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                  >
                    {user.childNickname}'s parent
                  </span>
                );
              } catch (error) {
                return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}