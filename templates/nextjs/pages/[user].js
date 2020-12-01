/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Text, Divider } from '@chakra-ui/core';
import NavigationBar from '../components/NavigationBar';
import HeaderGrid from '../components/HeaderGrid';
import ResponsiveHeading from '../components/ResponsiveHeading';
import Container from '../components/Container';
import { RESPONSIVE_TEXT_ALIGN } from '../styles/responsiveStyles';
import { fetchUsers, fetchPlaylists, fetchEntries } from '../clients';

export default function User({
  userId,
  firstName,
  lastName,
  followingCount,
  followerCount,
  playlistId,
}) {
  return (
    <div>
      <NavigationBar />
      <HeaderGrid>
        <Avatar size="xl" name={firstName} m="auto" />
        <Box>
          <ResponsiveHeading showDivider>{firstName}</ResponsiveHeading>
          <Text textAlign={RESPONSIVE_TEXT_ALIGN} mb={5}>
            {firstName} {lastName}
          </Text>
        </Box>
        <Box>
          <Text textAlign={RESPONSIVE_TEXT_ALIGN}>{`ID: ${userId}`}</Text>
        </Box>
      </HeaderGrid>

      <Container>
        {/* User's playlists */}
        <Box>
          <Playlists playlists={playlists} tags={tags} users={users} />
          {!playlists && (
            <Text textAlign={RESPONSIVE_TEXT_ALIGN}>
              {`${firstName} hasn't made any playlists yet.`}
            </Text>
          )}
        </Box>
      </Container>

      <Divider />

      {/* User's following */}
      <Container>

      </Container>
    </div>
  );
}

export async function getStaticPaths() {
  const users = await fetchUsers();
  const paths = users.map((user) => `/${user.userId}`);
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const userId = context.params.userId;
  const users = await fetchUsers();
  const {
    id,
    firstName,
    lastName,
    email,
    followingCount,
    followerCount,
    playlistId,
  } = users.find((t) => t.id === userId);

  // Get playlists if available
  const playlists = await fetchPlaylists();
  let userPlaylists = null;

  if (playlistId) {
    userPlaylists = playlists.filter((playlist) => buildsCreated.includes(playlist.userId),
    );
  }

  return {
    props: {
      t,
      userPlaylists,
    },
  };
}

User.propTypes = {
  userId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string,
};

User.defaultProps = {
  email: null,
  followingCount: 0,
  followerCount: 0,
  playlistId: null,
};
