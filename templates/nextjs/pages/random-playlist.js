import Head from 'next/head'
import React from 'react';
import RandomPlaylistPage from '../components/RandomPlaylistPage';


export default function RandomPlaylist() {
  return (
    <div>
      {/* <a>Page for random generated Playlist</a> */}
      <RandomPlaylistPage/>
    </div>
  );
}
