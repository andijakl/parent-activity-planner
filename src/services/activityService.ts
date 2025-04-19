import { Activity } from '../types';
import { createItem, getItem, updateItem, deleteItem, queryItems } from './cosmosService';
import { getUserFriends } from './userService';

// Create a new activity
export async function createActivity(activity: Omit<Activity, 'id' | 'participants' | 'interestedUsers'>): Promise<Activity> {
  const newActivity: Activity = {
    ...activity,
    id: `${Date.now()}-${activity.createdBy}`,
    participants: [activity.createdBy], // Creator is automatically a participant
    interestedUsers: []
  };
  
  return await createItem('activities', newActivity);
}

// Get activity by ID
export async function getActivityById(id: string): Promise<Activity> {
  return await getItem('activities', id);
}

// Update activity
export async function updateActivity(activity: Activity): Promise<Activity> {
  return await updateItem('activities', activity.id, activity);
}

// Delete activity
export async function deleteActivity(id: string): Promise<void> {
  await deleteItem('activities', id);
}

// Get activities created by user
export async function getUserActivities(userId: string): Promise<Activity[]> {
  return await queryItems(
    'activities',
    'SELECT * FROM activities a WHERE a.createdBy = @userId ORDER BY a.date DESC',
    [{ name: '@userId', value: userId }]
  );
}

// Get activities for user and friends
export async function getUserAndFriendsActivities(userId: string): Promise<Activity[]> {
  // Get user's friends
  const friends = await getUserFriends(userId);
  const friendIds = friends.map(friend => friend.id);
  
  // Include user's own ID
  const allIds = [userId, ...friendIds];
  
  // Cosmos DB doesn't directly support IN queries, so we need to use OR conditions
  const queryText = 'SELECT * FROM activities a WHERE ' + 
    allIds.map((_, index) => `a.createdBy = @userId${index}`).join(' OR ') +
    ' ORDER BY a.date DESC';
  
  const parameters = allIds.map((id, index) => ({
    name: `@userId${index}`,
    value: id
  }));
  
  return await queryItems('activities', queryText, parameters);
}

// Express interest in an activity
export async function expressInterest(activityId: string, userId: string): Promise<Activity> {
  const activity = await getActivityById(activityId);
  
  if (!activity.interestedUsers.includes(userId)) {
    activity.interestedUsers.push(userId);
    return await updateActivity(activity);
  }
  
  return activity;
}

// Join an activity
export async function joinActivity(activityId: string, userId: string): Promise<Activity> {
  const activity = await getActivityById(activityId);
  
  if (!activity.participants.includes(userId)) {
    activity.participants.push(userId);
    
    // Remove from interested if present
    const interestedIndex = activity.interestedUsers.indexOf(userId);
    if (interestedIndex !== -1) {
      activity.interestedUsers.splice(interestedIndex, 1);
    }
    
    return await updateActivity(activity);
  }
  
  return activity;
}

// Leave an activity
export async function leaveActivity(activityId: string, userId: string): Promise<Activity> {
  const activity = await getActivityById(activityId);
  
  // Cannot leave if you're the creator
  if (activity.createdBy === userId) {
    throw new Error("The creator cannot leave the activity");
  }
  
  const participantIndex = activity.participants.indexOf(userId);
  if (participantIndex !== -1) {
    activity.participants.splice(participantIndex, 1);
    return await updateActivity(activity);
  }
  
  return activity;
}