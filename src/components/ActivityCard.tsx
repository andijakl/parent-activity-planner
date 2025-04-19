import { useState, useEffect } from 'react';
import { Activity, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { joinActivity, expressInterest, leaveActivity } from '../services/activityService';
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
  const [interestedUsers, setInterestedUsers] = useState<User[]>([]);
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
        
        // Get interested users
        const interestedPromises = activity.interestedUsers.map(userId => getUserById(userId));
        const interestedData = await Promise.all(interestedPromises);
        setInterestedUsers(interestedData);
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
  
  const handleLeave = async () => {
    if (!currentUser || isCreator) return;
    
    try {
      await leaveActivity(activity.id, currentUser.id);
      refreshActivities();
    } catch (error) {
      console.error('Error leaving activity:', error);
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
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex space-x-2 mb-3">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="flex flex-wrap gap-1 mt-1">
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      {/* Activity Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-100">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-blue-800">{activity.name}</h3>
          {isCreator && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              Organizer
            </span>
          )}
        </div>
      </div>
      
      {/* Activity Details */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="space-y-2">
            <p className="flex items-center text-gray-700">
              <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDateForDisplay(activity.date)}</span>
            </p>
            
            <p className="flex items-center text-gray-700">
              <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{activity.time}</span>
            </p>
            
            <p className="flex items-center text-gray-700">
              <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{activity.location}</span>
            </p>
            
            <p className="flex items-center text-gray-600 text-sm">
              <svg className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Organized by: <span className="font-medium">{creator?.childNickname}'s parent</span>
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 sm:mt-0 flex sm:flex-col gap-2">
            {!isCreator && !isParticipant && (
              <button
                onClick={handleJoin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                          transition duration-150 text-sm font-medium flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Join
              </button>
            )}
            
            {isParticipant && !isCreator && (
              <button
                onClick={handleLeave}
                className="flex-1 px-4 py-2 bg-red-100 text-red-600 border border-red-200 
                          rounded-md hover:bg-red-200 transition duration-150 text-sm font-medium 
                          flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Leave
              </button>
            )}
            
            {!isCreator && !isParticipant && !isInterested && (
              <button
                onClick={handleInterest}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 
                          rounded-md hover:bg-gray-200 transition duration-150 text-sm font-medium 
                          flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Interested
              </button>
            )}
          </div>
        </div>
        
        {/* Participants section */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Participants ({participants.length}):
          </h4>
          <div className="flex flex-wrap gap-1">
            {participants.map(participant => (
              <span
                key={participant.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full"
              >
                <span className="h-2 w-2 mr-1 bg-blue-500 rounded-full"></span>
                {participant.childNickname}'s parent
              </span>
            ))}
            {participants.length === 0 && (
              <span className="text-sm text-gray-500 italic">No participants yet</span>
            )}
          </div>
        </div>
        
        {/* Interested users section */}
        {interestedUsers.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Interested ({interestedUsers.length}):
            </h4>
            <div className="flex flex-wrap gap-1">
              {interestedUsers.map(user => (
                <span
                  key={user.id}
                  className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full"
                >
                  <span className="h-2 w-2 mr-1 bg-gray-400 rounded-full"></span>
                  {user.childNickname}'s parent
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}