import { User, FriendInvitation } from '../types';
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  queryDocuments, 
  COLLECTIONS 
} from './firestoreService';
import { generateRandomCode } from '../utils/helpers';
import { where } from './firebase';

// Create a new user
export async function createUser(user: User): Promise<User> {
  return await createDocument(COLLECTIONS.USERS, user);
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  try {
    const result = await getDocument<User>(COLLECTIONS.USERS, id);
    // Ensure we have a valid User object
    return {
      id,
      email: result.email || '',
      childNickname: result.childNickname || '',
      friends: Array.isArray(result.friends) ? result.friends : []
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    // Return a default user with empty friends array if not found
    return {
      id,
      email: '',
      childNickname: '',
      friends: []
    };
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User> {
  try {
    const users = await queryDocuments<User>(
      COLLECTIONS.USERS,
      [where('email', '==', email)]
    );
    
    if (users.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }
    
    return users[0];
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
}

// Update user
export async function updateUser(user: User): Promise<User> {
  const result = await updateDocument<User>(COLLECTIONS.USERS, user.id, user);
  return result;
}

// Create friend invitation
export async function createInvitation(fromUserId: string, email: string): Promise<FriendInvitation> {
  const invitation: FriendInvitation = {
    id: `${Date.now()}-${fromUserId}`,
    fromUserId,
    code: generateRandomCode(),
    email,
    status: 'pending'
  };
  
  return await createDocument(COLLECTIONS.INVITATIONS, invitation);
}

// Get invitation by code
export async function getInvitationByCode(code: string): Promise<FriendInvitation> {
  try {
    const invitations = await queryDocuments<FriendInvitation>(
      COLLECTIONS.INVITATIONS,
      [where('code', '==', code)]
    );
    
    if (invitations.length === 0) {
      throw new Error(`Invitation with code ${code} not found`);
    }
    
    return invitations[0] as FriendInvitation;
  } catch (error) {
    console.error(`Error fetching invitation with code ${code}:`, error);
    throw error;
  }
}

// Accept friend invitation
export async function acceptInvitation(code: string, acceptingUserId: string): Promise<void> {
  try {
    // Get the invitation
    const invitation = await getInvitationByCode(code);
    
    if (invitation.status !== 'pending') {
      throw new Error('This invitation has already been processed');
    }
    
    // Update invitation status
    invitation.status = 'accepted';
    await updateDocument(COLLECTIONS.INVITATIONS, invitation.id, invitation);
    
    // Get both users
    const invitingUser = await getUserById(invitation.fromUserId);
    const acceptingUser = await getUserById(acceptingUserId);
    
    // Initialize friends arrays if they don't exist
    if (!invitingUser.friends) invitingUser.friends = [];
    if (!acceptingUser.friends) acceptingUser.friends = [];
    
    // Add each user to the other's friends list if not already there
    if (!invitingUser.friends.includes(acceptingUserId)) {
      invitingUser.friends.push(acceptingUserId);
      await updateUser(invitingUser);
    }
    
    if (!acceptingUser.friends.includes(invitation.fromUserId)) {
      acceptingUser.friends.push(invitation.fromUserId);
      await updateUser(acceptingUser);
    }
  } catch (error) {
    console.error(`Error accepting invitation:`, error);
    throw error;
  }
}

// Get user's friends
export async function getUserFriends(userId: string): Promise<User[]> {
  try {
    const user = await getUserById(userId);
    const friends: User[] = [];
    
    // Handle case where user might not have friends property or it's not an array
    if (!user.friends || !Array.isArray(user.friends)) {
      return friends;
    }
    
    // Fetch each friend's details
    for (const friendId of user.friends) {
      try {
        const friend = await getUserById(friendId);
        friends.push(friend);
      } catch (error) {
        console.error(`Error fetching friend with ID ${friendId}:`, error);
      }
    }
    
    return friends;
  } catch (error) {
    console.error(`Error getting user friends:`, error);
    return [];
  }
}