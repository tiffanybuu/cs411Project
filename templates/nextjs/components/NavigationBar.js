import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Heading, Flex, Icon, Stack } from '@chakra-ui/core';
import NavigationButton from './NavigationButton';
import NavigationItem from './NavigationItem';

// Taken and modified from here:
// https://chakra-ui.com/recipes#responsive-header-with-chakra-ui
function NavigationBar() {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const display = show ? 'block' : 'none';

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      py="0.8rem"
      px={{ base: '0.9rem', sm: '4rem' }}
      bg="pink.700"
      color="white"
    >
      <Flex align="center" mr={5}>
      <Stack isInline>

        <Heading as="h1" size="md" alignSelf="center">
          <Link href="/">
            <a href="/">streaming baby</a>
          </Link>
        </Heading>
      </Stack>
      </Flex>
      <Box display={['block', 'block', 'block', 'none']} onClick={handleToggle}>
        <svg
          fill="white"
          width="20px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>
      <Box
        display={[display, display, display, 'flex']}
        width={{ sm: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        <NavigationItem href="/about">About</NavigationItem>
        <NavigationItem href="/search">Search</NavigationItem>
        <NavigationItem href="/playlists">Playlists</NavigationItem>
      </Box>

      <Stack display={['none', 'none', 'none', 'flex']} isInline>
        <NavigationButton show={show}>
          <a href="/login">Log in</a>
        </NavigationButton>
        <NavigationButton show={show}>Sign up</NavigationButton>
      </Stack>
    </Flex>
  );
}

// <NavigationButton show={show}>
//   <a href="/api/logout">Log out</a>
// </NavigationButton>

export default NavigationBar;
