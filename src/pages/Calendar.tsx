import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../context/AuthContext';
import { getUserAndFriendsActivities } from '../services/activityService';
import { Activity } from '../types';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';
import { formatDateToString } from '../utils/helpers';

export default function CalendarPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [date, setDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);
  
  // Load activities
  useEffect(() => {
    async function loadActivities() {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getUserAndFriendsActivities(currentUser.id);
        setActivities(data);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadActivities();
  }, [currentUser]);
  
  // Filter activities by selected date
  useEffect(() => {
    if (!date || !activities.length) {
      setFilteredActivities([]);
      return;
    }
    
    const dateStr = formatDateToString(date);
    const filtered = activities.filter(activity => activity.date === dateStr);
    setFilteredActivities(filtered);
  }, [date, activities]);
  
  // Function to determine if a date has activities
  const hasActivities = (date: Date) => {
    const dateStr = formatDateToString(date);
    return activities.some(activity => activity.date === dateStr);
  };
  
  // Handle activity creation success
  const handleActivityCreated = () => {
    setShowActivityForm(false);
    // Reload activities
    if (currentUser) {
      getUserAndFriendsActivities(currentUser.id)
        .then(data => setActivities(data))
        .catch(error => console.error('Error reloading activities:', error));
    }
  };
  
  // Function to refresh activities
  const refreshActivities = () => {
    if (currentUser) {
      getUserAndFriendsActivities(currentUser.id)
        .then(data => setActivities(data))
        .catch(error => console.error('Error refreshing activities:', error));
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-10">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Activity Calendar</h1>
          <button
            onClick={() => setShowActivityForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 text-sm font-medium shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Activity
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Calendar</h2>
              </div>
              
              <div className="calendar-container p-4">
                <Calendar
                  onChange={(value) => setDate(value as Date)}
                  value={date}
                  tileClassName={({ date }) => hasActivities(date) ? 'has-activities' : ''}
                />
              </div>
              
              <style>{`
                .has-activities {
                  background-color: rgba(59, 130, 246, 0.1);
                  color: #1e40af;
                  font-weight: bold;
                  position: relative;
                }
                
                .has-activities::after {
                  content: '';
                  position: absolute;
                  bottom: 4px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 6px;
                  background-color: #3b82f6;
                  border-radius: 50%;
                }
                
                .calendar-container {
                  width: 100%;
                  max-width: 100%;
                  overflow-x: auto;
                }
                
                /* Override react-calendar styles */
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                
                .react-calendar__tile--active {
                  background-color: #3b82f6 !important;
                  color: white !important;
                }
                
                .react-calendar__tile--active.has-activities::after {
                  background-color: white;
                }
                
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: rgba(59, 130, 246, 0.1);
                }
                
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: rgba(59, 130, 246, 0.1);
                }
                
                .react-calendar__month-view__days__day--weekend {
                  color: #ef4444;
                }
              `}</style>
            </div>
            
            {/* Selected date summary */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-sm text-gray-600">
                {filteredActivities.length === 0 
                  ? 'No activities scheduled for this date.' 
                  : `${filteredActivities.length} ${filteredActivities.length === 1 ? 'activity' : 'activities'} scheduled.`}
              </p>
            </div>
          </div>
          
          {/* Activities section */}
          <div className="lg:col-span-2">
            {showActivityForm ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">Create New Activity</h2>
                  <button 
                    onClick={() => setShowActivityForm(false)}
                    className="text-white hover:text-blue-100 transition duration-150"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <ActivityForm 
                    onSuccess={handleActivityCreated} 
                    onCancel={() => setShowActivityForm(false)} 
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                  <h2 className="text-lg font-semibold text-white">
                    Activities for {date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </h2>
                </div>
                
                <div className="p-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 h-40 rounded-lg"></div>
                      ))}
                    </div>
                  ) : filteredActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <svg 
                        className="h-16 w-16 text-gray-300 mx-auto mb-4"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="1" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      <p className="text-gray-500 mb-4">No activities scheduled for this date.</p>
                      <button
                        onClick={() => setShowActivityForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
                      >
                        Create Activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredActivities.map(activity => (
                        <ActivityCard 
                          key={activity.id} 
                          activity={activity} 
                          refreshActivities={refreshActivities}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}