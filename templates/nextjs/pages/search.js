import Head from 'next/head'
import React from 'react';
import Container from '../components/Container';
import SearchBar from '../components/SearchBar';
import SearchPage from '../components/SearchPage';


export default function Search({playlists}) {
  return (
    <div>
      <SearchPage/>
    </div>
  );
}
