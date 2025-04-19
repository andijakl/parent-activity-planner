// Generate a random code for friend invitations
export function generateRandomCode(length = 6): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitting similar looking characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

// Format date to string (YYYY-MM-DD)
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format string date to display format (e.g., "Mon, Jan 1, 2023")
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Get current date as string (YYYY-MM-DD)
export function getCurrentDateString(): string {
  return formatDateToString(new Date());
}

// Check if a date is in the past
export function isDateInPast(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  return date < today;
}

// Group activities by date
export function groupActivitiesByDate(activities: any[]) {
  return activities.reduce((groups: Record<string, any[]>, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});
}