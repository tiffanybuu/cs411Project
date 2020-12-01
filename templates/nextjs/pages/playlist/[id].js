/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Heading, Text, Image, Stack, Flex, useToast } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import HeaderGrid from '../../components/HeaderGrid';
import Container from '../../components/Container';
import TagBadges from '../../components/TagBadges';
import LinkWrapper from '../../components/LinkWrapper';
import ResponsiveHeading from '../../components/ResponsiveHeading';
import TogglableButton from '../../components/TogglableButton';
import ResourceCard from '../../components/ResourceCard';
import { fetchUsers, fetchTags, fetchPlaylists, fetchEntries } from '../../clients/index';
import { ResourceListProps, UserProps } from '../../constants/propTypes';
import Router, { withRouter } from 'next/router';


function Playlist({ playlistId, userId, title, description, imageUrl, dateCreated, duration, playlistEntries, tagEntries }) {
  console.log('made to playlist page')
  const toast = useToast();

  const desktopWidth = 90;

  const emptyText = 'No songs for this playlist.';

  const playlistPageHref = '/[user]';
  const playlistPageAs = `/${user.userId}`;

  return (
    <div>
      <HeaderGrid>
        {/* Image */}
        <Box mx="auto" p={1}>
          <Image
            {/*src={imageUrl}*/}
            src="/assets/peachy.png"
            mx="auto"
          />
        </Box>

        {/* Title, description, tags */}
        <Box textAlign={['center', 'center', 'center', 'left']}>
          <Heading as="h1" size="2xl">{name}</Heading>
          <LinkWrapper href={playlistPageHref} as={playlistPageAs}>
            <Text>{playlist.title}</Text>
          </LinkWrapper>
          <Text fontSize={18} my={2} mb={3}>{description}</Text>
          <TagBadges tagNames={tagNames} fontSize={16} flexDir={['column', 'column', 'column', 'row']} />
        </Box>

      </HeaderGrid>
      <Container desktopWidth={desktopWidth} leftColumn={70} rightColumn={30}>
        {/* Sidebar */}
        <Box>
          <ResponsiveHeading showDivider>Notes</ResponsiveHeading>
          <Text fontStyle="light" textAlign={RESPONSIVE_TEXT_ALIGN} mb={10}>
            {notes || (emptyText)}
          </Text>
        </Box>
      </Container>
    </div>
  );
}

Playlist.propTypes = {
  playlistId: PropTypes.string.isRequired,
  userId: UserProps.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: ResourceListProps.isRequired,
  dateCreated: PropTypes.string,
  duration: PropTypes.string.isRequired,
  playlistEntries: PlaylistEntriesProps.isRequired,
  tagNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Playlist.defaultProps = {
  imageUrl: '/assets/peachy.png',
  description: '',
};

export async function getStaticPaths() {
  const playlists = await fetchPlaylists();
  const paths = playlists.map((playlist) => `/playlist/${playlist.playlistId}`);
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const playlistName = context.params.title;
  const playlists = await fetchPlaylists();
  const { playlistId, userId, title, description, imageUrl, dateCreated, duration, playlistEntries, tagEntries } = playlists.find(
    (playlist) => playlist.title === playlistName,
  );

  const allEntries = await fetchEntries();
  const entries = allEntries.filter((entry) => entryIds.includes(resource.id));

  const allTags = await fetchTags();
  const tags = allTags.filter((tag) => tagIds.includes(tag.id));
  const tagNames = tags.map((tag) => tag.name);

  const allUsers = await fetchUsers();
  const builder = allUsers.find((user) => user.id === userId);

  return {
    props: {
      playlist,
      user,
      description,
      entries,
      tagNames,
    },
  };
}

export default withRouter(Playlist);
