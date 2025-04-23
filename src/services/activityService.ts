import { Activity } from '../types';
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments, 
  COLLECTIONS 
} from './firestoreService';
import { getUserFriends } from './userService';
import { where, orderBy } from './firebase';

// Create a new activity
export async function createActivity(activity: Omit<Activity, 'id' | 'participants' | 'interestedUsers'>): Promise<Activity> {
  const newActivity: Activity = {
    ...activity,
    id: `${Date.now()}-${activity.createdBy}`,
    participants: [activity.createdBy], // Creator is automatically a participant
    interestedUsers: []
  };
  
  return await createDocument(COLLECTIONS.ACTIVITIES, newActivity);
}

// Get activity by ID
export async function getActivityById(id: string): Promise<Activity> {
  const result = await getDocument<Activity>(COLLECTIONS.ACTIVITIES, id);
  // If some properties are missing, add default values
  // This fixes typescript errors when properties might be missing
  const activity: Activity = {
    id: result.id,
    createdBy: result.createdBy || '',
    name: result.name || '',
    date: result.date || '',
    time: result.time || '',
    location: result.location || '',
    participants: Array.isArray(result.participants) ? result.participants : [],
    interestedUsers: Array.isArray(result.interestedUsers) ? result.interestedUsers : []
  };
  return activity;
}

// Update activity
export async function updateActivity(activity: Activity): Promise<Activity> {
  const result = await updateDocument<Activity>(COLLECTIONS.ACTIVITIES, activity.id, activity);
  return result;
}

// Delete activity
export async function deleteActivity(id: string): Promise<void> {
  await deleteDocument(COLLECTIONS.ACTIVITIES, id);
}

// Get activities created by user
export async function getUserActivities(userId: string): Promise<Activity[]> {
  return await queryDocuments<Activity>(
    COLLECTIONS.ACTIVITIES,
    [where('createdBy', '==', userId)],
    [orderBy('date', 'desc')]
  );
}

// Get activities for user and friends
export async function getUserAndFriendsActivities(userId: string): Promise<Activity[]> {
  try {
    // Get user's friends
    const friends = await getUserFriends(userId);
    const friendIds = friends.map(friend => friend.id);
    
    // Include user's own ID
    const allIds = [userId, ...friendIds].filter(Boolean); // Filter out any null/undefined IDs
    
    if (allIds.length === 0) {
      console.warn("No valid user IDs for activity query");
      return [];
    }
    
    // For a single user, query directly
    if (allIds.length === 1) {
      return await queryDocuments<Activity>(
        COLLECTIONS.ACTIVITIES,
        [where('createdBy', '==', allIds[0])],
        [orderBy('date', 'desc')]
      );
    }
    
    // For multiple users, we need to perform separate queries and combine results
    // Firestore doesn't support OR conditions like Cosmos DB
    const activities: Activity[] = [];
    
    // Query activities for each user ID
    for (const id of allIds) {
      const userActivities = await queryDocuments<Activity>(
        COLLECTIONS.ACTIVITIES,
        [where('createdBy', '==', id)],
        [orderBy('date', 'desc')]
      );
      activities.push(...userActivities);
    }
    
    // Sort combined results by date
    return activities.sort((a, b) => {
      // Sort by date in descending order
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error in getUserAndFriendsActivities:", error);
    return [];
  }
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