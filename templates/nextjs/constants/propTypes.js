import PropTypes from 'prop-types';

// User props
export const UserProps = PropTypes.shape({
  userId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  followingCount: PropTypes.number,
  followerCount: PropTypes.number,
});

export const UserListProps = PropTypes.arrayOf(UserProps);

// Tag props
export const TagProps = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
});

export const TagListProps = PropTypes.arrayOf(TagProps);

// Playlist entry props
export const PlaylistEntryProps = PropTypes.shape({
  entryId: PropTypes.string,
  entryURL: PropTypes.string,
  title: PropTypes.string,
  source: PropTypes.string,
  duration: PropTypes.string,
  position: PropTypes.number,
});

export const PlaylistEntriesProps = PropTypes.arrayOf(PlaylistEntryProps);

// Playlist props
export const PlaylistProps = PropTypes.shape({
  playlistId: PropTypes.string,
  userId: UserProps,
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  dateCreated: PropTypes.string,
  duration: PropTypes.string,
  playlistEntries: PlaylistEntriesProps,
  tagNames: PropTypes.arrayOf(PropTypes.string),
});
