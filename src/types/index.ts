export interface User {
  id: string;
  email: string;
  childNickname: string;
  friends: string[]; // Array of user IDs
}

export interface Activity {
  id: string;
  createdBy: string; // User ID of creator
  name: string;
  date: string;
  time: string;
  location: string;
  participants: string[]; // Array of user IDs who joined
  interestedUsers: string[]; // Array of user IDs who expressed interest
}

export interface FriendInvitation {
  id: string;
  fromUserId: string;
  code: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
}