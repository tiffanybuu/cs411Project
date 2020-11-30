import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Image, Badge, Text, Heading, Flex, Icon, Stack } from '@chakra-ui/core';
import PropTypes from 'prop-types';

function Entry({songId, songURL}) {
  return (
  <Box
      textAlign={['center', 'center', 'center', 'center']}
      maxW="640px"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      alignSelf="center"
  >
    <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
      While We're Young
    </Text>
    <iframe src={songURL} width="640" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"/>
  </Box>
  );
}


Entry.propTypes = {
  songId: PropTypes.string.isRequired,
  songURL: PropTypes.string.isRequired,
};


export default Entry;
