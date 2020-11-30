import USERS from '../fixtures/entries';
import TAGS from '../fixtures/playlists';
import BUILDS from '../fixtures/tags';
import RESOURCES from '../fixtures/users';

// TODO: Implement proper data fetching once backend is setup

export function fetchUsers() {
  return new Promise((resolve) => {
    resolve(USERS);
  });
}

export function fetchTags() {
  return new Promise((resolve) => {
    resolve(TAGS);
  });
}

export function fetchPlaylists() {
  return new Promise((resolve) => {
    resolve(PLAYLISTS);
  });
}

export function fetchEntries() {
  return new Promise((resolve) => {
    resolve(ENTRIES);
  });
}
