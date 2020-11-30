import Head from 'next/head'
import React from 'react';
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import Hero from '../components/Hero';
import Container from '../components/Container';

export default function Home() {
  return (
    <div>
      <Hero
        headerText="Streaming music done right."
        subText="Start building your playlist today."
        heroImgSrc="/assets/cs411.png"
        heroImgAlt="musical talent"
      />
    </div>
  );
}
