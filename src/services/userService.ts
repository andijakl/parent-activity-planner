import { User, FriendInvitation } from '../types';
import { createItem, getItem, updateItem, queryItems } from './cosmosService';
import { generateRandomCode } from '../utils/helpers';

// Create a new user
export async function createUser(user: User): Promise<User> {
  return await createItem('users', user);
}

// Get user by ID
export async function getUserById(id: string): Promise<User> {
  try {
    return await getItem('users', id);
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
  const users = await queryItems(
    'users',
    'SELECT * FROM users u WHERE u.email = @email',
    [{ name: '@email', value: email }]
  );
  
  if (users.length === 0) {
    throw new Error(`User with email ${email} not found`);
  }
  
  return users[0];
}

// Update user
export async function updateUser(user: User): Promise<User> {
  return await updateItem('users', user.id, user);
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
  
  return await createItem('invitations', invitation);
}

// Get invitation by code
export async function getInvitationByCode(code: string): Promise<FriendInvitation> {
  const invitations = await queryItems(
    'invitations',
    'SELECT * FROM invitations i WHERE i.code = @code',
    [{ name: '@code', value: code }]
  );
  
  if (invitations.length === 0) {
    throw new Error(`Invitation with code ${code} not found`);
  }
  
  return invitations[0];
}

// Accept friend invitation
export async function acceptInvitation(code: string, acceptingUserId: string): Promise<void> {
  // Get the invitation
  const invitation = await getInvitationByCode(code);
  
  if (invitation.status !== 'pending') {
    throw new Error('This invitation has already been processed');
  }
  
  // Update invitation status
  invitation.status = 'accepted';
  await updateItem('invitations', invitation.id, invitation);
  
  // Get both users
  const invitingUser = await getUserById(invitation.fromUserId);
  const acceptingUser = await getUserById(acceptingUserId);
  
  // Add each user to the other's friends list if not already there
  if (!invitingUser.friends.includes(acceptingUserId)) {
    invitingUser.friends.push(acceptingUserId);
    await updateUser(invitingUser);
  }
  
  if (!acceptingUser.friends.includes(invitation.fromUserId)) {
    acceptingUser.friends.push(invitation.fromUserId);
    await updateUser(acceptingUser);
  }
}

// Get user's friends
export async function getUserFriends(userId: string): Promise<User[]> {
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
}