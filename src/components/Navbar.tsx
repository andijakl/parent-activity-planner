import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Collapsible,
  Icon,
  Link,
  Popover,
  Menu,
  Avatar,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import {
  RxHamburgerMenu as HamburgerIcon,
  RxCross1 as CloseIcon,
  RxChevronDown as ChevronDownIcon,
  RxChevronRight as ChevronRightIcon,
} from 'react-icons/rx';

// Define a type for icon props
type IconProps = Record<string, unknown>;

// Custom Sun Icon
function CustomSunIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 3v1m0 16v1m-9-9h1M21 12h1m-4.8-4.8L18 8m0 0l-1.8-1.8M6 16l-1.8 1.8M18 16l1.8 1.8M6 8L4.2 6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Icon>
  );
}

// Custom People Icon
function CustomPeopleIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Icon>
  );
}

// Custom Calendar Icon
function CustomCalendarIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Icon>
  );
}

export default function Navbar() {
  const { open, onToggle } = useDisclosure();
  const { currentUser, signOut } = useAuth();
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Flex
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'gray.600' : 'white'}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
        align={'center'}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <Button
            onClick={onToggle}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          >
            {open ? <CloseIcon size={12} /> : <HamburgerIcon size={20} />}
          </Button>
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link
            asChild
            textAlign={colorMode === 'light' ? 'left' : 'center'}
            fontFamily={'heading'}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <RouterLink to="/">
              <HStack>
                <CustomSunIcon w={6} h={6} color="brand.500" />
                <Text
                  fontWeight={700}
                  fontSize="lg"
                  bgGradient="linear(to-r, brand.500, brand.700)"
                  bgClip="text"
                >
                  ParentPlanner
                </Text>
              </HStack>
            </RouterLink>
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          gap={6}
        >
          {currentUser ? (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button rounded={'full'} variant={'ghost'} cursor={'pointer'} minW={0}>
                  <HStack>
                    <Avatar.Root size={'sm'}>
                      <Avatar.Fallback name={`${currentUser.childNickname}'s Parent`} bg="brand.500" />
                    </Avatar.Root>
                    <Text display={{ base: 'none', md: 'flex' }}>
                      {currentUser.childNickname}'s Parent
                    </Text>
                  </HStack>
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content zIndex={2}>
                  <Menu.Item asChild value="calendar">
                    <RouterLink to="/calendar">
                      <HStack>
                        <CustomCalendarIcon fontSize="1.2em" />
                        <span>Calendar</span>
                      </HStack>
                    </RouterLink>
                  </Menu.Item>
                  <Menu.Item asChild value="friends">
                    <RouterLink to="/friends">
                      <HStack>
                        <CustomPeopleIcon fontSize="1.2em" />
                        <span>Friends</span>
                      </HStack>
                    </RouterLink>
                  </Menu.Item>
                  <Menu.Item onClick={signOut} value="signout">Sign Out</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          ) : (
            <>
              <Link asChild>
                <RouterLink to={'/signin'}>
                  <Button
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'ghost'}
                  >
                    Sign In
                  </Button>
                </RouterLink>
              </Link>

              <Link asChild display={{ base: 'none', md: 'inline-flex' }}>
                <RouterLink to={'/signup'}>
                  <Button
                    fontSize={'sm'}
                    fontWeight={600}
                    colorPalette="brand"
                    variant="solid"
                  >
                    Sign Up
                  </Button>
                </RouterLink>
              </Link>
            </>
          )}
        </Stack>
      </Flex>

      <Collapsible.Root open={open}>
        <Collapsible.Content>
          <MobileNav />
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}

const DesktopNav = () => {
  const { currentUser } = useAuth();
  const { colorMode } = useColorMode();
  const linkColor = colorMode === 'light' ? 'gray.600' : 'gray.200';
  const linkHoverColor = colorMode === 'light' ? 'brand.500' : 'white';
  const popoverContentBgColor = colorMode === 'light' ? 'white' : 'gray.800';

  if (!currentUser) return null;

  return (
    <Stack direction={'row'} gap={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Link asChild>
                <RouterLink to={navItem.href ?? '#'}>
                  <Box
                    p={2}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                  >
                    <HStack gap={1}>
                      {navItem.icon}
                      <Text>{navItem.label}</Text>
                    </HStack>
                  </Box>
                </RouterLink>
              </Link>
            </Popover.Trigger>

            {navItem.children && (
              <Popover.Content
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </Popover.Content>
            )}
          </Popover.Root>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link asChild>
      <RouterLink to={href ?? '#'}>
        <Box
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: 'brand.50' }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                transition={'all .3s ease'}
                _groupHover={{ color: 'brand.500' }}
                fontWeight={500}
              >
                {label}
              </Text>
              <Text fontSize={'sm'}>{subLabel}</Text>
            </Box>
            <Flex
              transition={'all .3s ease'}
              transform={'translateX(-10px)'}
              opacity={0}
              _groupHover={{ opacity: 1, transform: 'translateX(0)' }}
              justify={'flex-end'}
              align={'center'}
              flex={1}
            >
              <Icon color={'brand.500'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
          </Stack>
        </Box>
      </RouterLink>
    </Link>
  );
};

const MobileNav = () => {
  const { currentUser, signOut } = useAuth();
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';

  if (!currentUser) {
    return (
      <Stack
        bg={bgColor}
        p={4}
        display={{ md: 'none' }}
      >
        <MobileNavItem label="Sign In" href="/signin" />
        <MobileNavItem label="Sign Up" href="/signup" />
      </Stack>
    );
  }

  return (
    <Stack
      bg={bgColor}
      p={4}
      display={{ md: 'none' }}
    >
      <Box py={2} px={3} rounded="md" bg="brand.50" mb={2}>
        <Text fontWeight={600} color="brand.700">
          {currentUser.childNickname}'s Parent
        </Text>
      </Box>

      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}

      <Box pt={2}>
        <Button
          width="full"
          onClick={signOut}
          variant="outline"
          colorPalette="brand"
        >
          Sign Out
        </Button>
      </Box>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, icon }: NavItem) => {
  const { open, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <Stack gap={4} onClick={children && onToggle}>
      <Flex py={2}>
        <Link asChild width="full">
          <RouterLink to={href ?? '#'}>
            <Flex
              justify={'space-between'}
              align={'center'}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <HStack gap={2}>
                {icon}
                <Text
                  fontWeight={600}
                  color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                >
                  {label}
                </Text>
              </HStack>
              {children && (
                <Icon
                  as={ChevronDownIcon}
                  transition={'all .25s ease-in-out'}
                  transform={open ? 'rotate(180deg)' : ''}
                  w={6}
                  h={6}
                />
              )}
            </Flex>
          </RouterLink>
        </Link>
      </Flex>

      <Collapsible.Root open={open}>
        <Collapsible.Content>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            align={'start'}
          >
            {children &&
              children.map((child) => (
                <Link key={child.label} asChild>
                  <RouterLink to={child.href ?? '#'}>
                    <Box py={2}>
                      {child.label}
                    </Box>
                  </RouterLink>
                </Link>
              ))}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  icon?: React.ReactNode;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Calendar',
    href: '/calendar',
    icon: <CustomCalendarIcon fontSize="1.2em" color="brand.500" />,
  },
  {
    label: 'Friends',
    href: '/friends',
    icon: <CustomPeopleIcon fontSize="1.2em" color="brand.500" />,
  },
];