import Head from 'next/head'
import React from 'react';
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import NavigationBar from '../components/NavigationBar';
import Container from '../components/Container';
import SearchBar from '../components/SearchBar';
import SearchPage from '../components/SearchPage';


export default function Search({playlists}) {
  return (
    <div>
      <ThemeProvider>
      <CSSReset/>
      <NavigationBar />
      <SearchPage/>
      </ThemeProvider>
    </div>
  );
}