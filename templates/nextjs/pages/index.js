import Head from 'next/head'
import React from 'react';
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import NavigationBar from '../components/NavigationBar';
import Hero from '../components/Hero';
import Container from '../components/Container';

export default function Home() {
  return (
    <div>
      <ThemeProvider>
      <CSSReset/>
      <NavigationBar />
      <Hero
        headerText="Streaming music done right."
        subText="Start building your playlist today."
        heroImgSrc="/assets/cs411.png"
        heroImgAlt="musical talent"
      />

      </ThemeProvider>
    </div>
  );
}
