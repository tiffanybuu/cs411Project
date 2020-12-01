import Head from 'next/head'
import React from 'react';
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import Hero from '../components/Hero';
import Container from '../components/Container';
import PlaylistPage from '../components/PlaylistPage';

export default function PlaylistList() {
  return (
    <div>
      <PlaylistPage/>
    </div>
  );
}
