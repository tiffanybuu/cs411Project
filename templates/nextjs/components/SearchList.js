import React from 'react';
import Link from 'next/link';
import { Text } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const SearchList = ({playlists=[]}) => {
  return (
    <>
    { playlists.map((playlist) => {
      if (playlist) {
        console.log(playlist)
        let l = "/playlist/" + encodeURI(playlist.PlaylistID);
        return (
          <div key={playlist.Title}>
              <Link href={l}>
                <h1 style={{textDecorationLine: "underline", fontWeight: "bold"}}>{playlist.Title}</h1>
              </Link>
              <h2>{playlist.Description}</h2>
          </div>
        )
      }
      return null
    })}
    </>
  );
}

export default SearchList;
