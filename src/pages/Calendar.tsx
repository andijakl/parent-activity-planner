import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../context/AuthContext';
import { getUserAndFriendsActivities } from '../services/activityService';
import { Activity } from '../types';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';
import { formatDateToString, groupActivitiesByDate } from '../utils/helpers';

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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Calendar</h2>
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Create Activity
              </button>
            </div>
            
            <div className="calendar-container">
              <Calendar
                onChange={setDate}
                value={date}
                tileClassName={({ date }) => hasActivities(date) ? 'has-activities' : ''}
              />
            </div>
            
            <style jsx>{`
              .has-activities {
                background-color: #dbeafe;
                color: #1e40af;
                font-weight: bold;
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
                background-color: #3b82f6;
                color: white;
              }
              
              .react-calendar__tile--active.has-activities {
                background-color: #2563eb;
                color: white;
              }
            `}</style>
          </div>
        </div>
        
        {/* Activities section */}
        <div className="lg:col-span-2">
          {showActivityForm ? (
            <ActivityForm 
              onSuccess={handleActivityCreated} 
              onCancel={() => setShowActivityForm(false)} 
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Activities for {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-40 rounded-lg"></div>
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No activities scheduled for this date.</p>
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          )}
        </div>
      </div>
    </div>
  );
}