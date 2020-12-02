import Head from 'next/head'
import React from 'react';
import Hero from '../components/Hero';
import Container from '../components/Container';

export default function About() {
  return (
    <div>
      <Hero
        headerText="We made this."
        subText="We love CS 411."
        heroImgSrc="/assets/cs411.png"
        heroImgAlt="musical talent"
      />
    </div>
  );
}
