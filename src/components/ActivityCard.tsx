import { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Heading, 
  HStack, 
  VStack, 
  Badge, 
  Divider, 
  Icon, 
  Tag, 
  TagLabel, 
  TagLeftIcon, 
  Skeleton, 
  SkeletonText, 
  useColorModeValue
} from '@chakra-ui/react';
import { Activity, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { joinActivity, expressInterest, leaveActivity } from '../services/activityService';
import { getUserById } from '../services/userService';
import { formatDateForDisplay } from '../utils/helpers';

// Custom icons
type IconProps = Record<string, unknown>;

function CalendarIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </Icon>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </Icon>
  );
}

function LocationIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
      />
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
      />
    </Icon>
  );
}

function PersonIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
      />
    </Icon>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
      />
    </Icon>
  );
}

function CloseIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M6 18L18 6M6 6l12 12" 
      />
    </Icon>
  );
}

function BookmarkIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
      />
    </Icon>
  );
}

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
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('brand.50', 'brand.900');
  const headerColor = useColorModeValue('brand.700', 'white');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
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
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        boxShadow="sm" 
        bg={cardBg}
        mb={4}
      >
        <Box p={4}>
          <SkeletonText mt="2" noOfLines={1} spacing="4" skeletonHeight="6" width="70%" />
          <HStack spacing={4} mt={4}>
            <SkeletonText mt="2" noOfLines={3} spacing="4" skeletonHeight="3" width="60%" />
            <Flex justifyContent="flex-end" flex={1}>
              <Skeleton height="36px" width="90px" />
            </Flex>
          </HStack>
          <Divider my={4} />
          <SkeletonText mt="2" noOfLines={1} spacing="4" skeletonHeight="3" width="30%" />
          <Flex mt={2} flexWrap="wrap" gap={2}>
            <Skeleton height="22px" width="100px" borderRadius="full" />
            <Skeleton height="22px" width="100px" borderRadius="full" />
          </Flex>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      boxShadow="sm" 
      bg={cardBg}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
      mb={4}
    >
      {/* Activity Header */}
      <Box bg={headerBg} px={4} py={3} borderBottomWidth="1px" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color={headerColor}>{activity.name}</Heading>
          {isCreator && (
            <Badge colorScheme="brand" variant="subtle" fontSize="xs" px={2} py={1} borderRadius="full">
              Organizer
            </Badge>
          )}
        </Flex>
      </Box>
      
      {/* Activity Details */}
      <Box p={4}>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
        >
          <VStack align="stretch" spacing={2} maxW={{ base: "100%", md: "70%" }}>
            <HStack>
              <Icon as={CalendarIcon} color="brand.500" boxSize={4} />
              <Text fontWeight="medium">{formatDateForDisplay(activity.date)}</Text>
            </HStack>
            
            <HStack>
              <Icon as={ClockIcon} color="brand.500" boxSize={4} />
              <Text>{activity.time}</Text>
            </HStack>
            
            <HStack>
              <Icon as={LocationIcon} color="brand.500" boxSize={4} />
              <Text>{activity.location}</Text>
            </HStack>
            
            <HStack>
              <Icon as={PersonIcon} color="brand.500" boxSize={4} />
              <Text fontSize="sm">Organized by: <Text as="span" fontWeight="medium">{creator?.childNickname}'s parent</Text></Text>
            </HStack>
          </VStack>
          
          {/* Action Buttons */}
          <VStack spacing={2} mt={{ base: 4, md: 0 }}>
            {!isCreator && !isParticipant && (
              <Button
                onClick={handleJoin}
                leftIcon={<PlusIcon />}
                colorScheme="brand"
                size="sm"
                width="full"
              >
                Join
              </Button>
            )}
            
            {isParticipant && !isCreator && (
              <Button
                onClick={handleLeave}
                leftIcon={<CloseIcon />}
                colorScheme="red"
                variant="outline"
                size="sm"
                width="full"
              >
                Leave
              </Button>
            )}
            
            {!isCreator && !isParticipant && !isInterested && (
              <Button
                onClick={handleInterest}
                leftIcon={<BookmarkIcon />}
                colorScheme="gray"
                variant="outline"
                size="sm"
                width="full"
              >
                Interested
              </Button>
            )}
          </VStack>
        </Flex>
        
        {/* Participants section */}
        <Divider my={4} />
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Participants ({participants.length}):
          </Text>
          <Flex flexWrap="wrap" gap={2}>
            {participants.map(participant => (
              <Tag
                key={participant.id}
                size="sm"
                borderRadius="full"
                variant="subtle"
                colorScheme="brand"
              >
                <TagLeftIcon boxSize="2" as={() => <Box boxSize="2" borderRadius="full" bg="brand.500" />} />
                <TagLabel>{participant.childNickname}'s parent</TagLabel>
              </Tag>
            ))}
            {participants.length === 0 && (
              <Text fontSize="sm" fontStyle="italic" color="gray.500">No participants yet</Text>
            )}
          </Flex>
        </Box>
        
        {/* Interested users section */}
        {interestedUsers.length > 0 && (
          <Box mt={3}>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Interested ({interestedUsers.length}):
            </Text>
            <Flex flexWrap="wrap" gap={2}>
              {interestedUsers.map(user => (
                <Tag
                  key={user.id}
                  size="sm"
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="gray"
                >
                  <TagLeftIcon boxSize="2" as={() => <Box boxSize="2" borderRadius="full" bg="gray.400" />} />
                  <TagLabel>{user.childNickname}'s parent</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}