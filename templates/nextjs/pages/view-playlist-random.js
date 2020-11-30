import Head from 'next/head'
import React from 'react';
import ViewPlaylistRandomPage from '../components/ViewPlaylistRandomPage';


export default function ViewPlaylist() {
  return (
    <div>
      {/* <a>Page for viewing a single playlist</a> */}
      <ViewPlaylistRandomPage/>
    </div>
  );
}
