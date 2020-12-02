/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Text, Button, Divider } from '@chakra-ui/core';
// import { Button, ButtonGroup } from "@chakra-ui/react";
import NavigationButton from '../../components/NavigationButton';
import HeaderGrid from '../../components/HeaderGrid';
import ResponsiveHeading from '../../components/ResponsiveHeading';
import Container from '../../components/Container';
import { RESPONSIVE_TEXT_ALIGN } from '../../styles/responsiveStyles';
import { fetchUsers, fetchPlaylists, fetchEntries } from '../../clients';
import Router, { withRouter, useRouter } from 'next/router';
import fetch from 'node-fetch';
import axios from "axios";

const User = ({ user, playlistsj }) => {
  var userId, firstName, lastName, followingCount, followerCount, playlists;
  userId = user.data.UserInfo.UserID;
  firstName = user.data.UserInfo.FirstName;
  lastName = user.data.UserInfo.LastName;
  followingCount = user.data.UserInfo.FollowingCount;
  followerCount = user.data.UserInfo.FollowerCount;
  playlists = playlistsj.data.Playlists;

  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const display = show ? 'block' : 'none';

  return (
    <div>
      <HeaderGrid>
        <Avatar size="xl" name={firstName} m="auto" />
        <Box>
          <ResponsiveHeading showDivider>{firstName}</ResponsiveHeading>
          <Text textAlign={RESPONSIVE_TEXT_ALIGN} mb={5}>
            {firstName} {lastName}
          </Text>
        </Box>
        <Box>
          <Text textAlign={RESPONSIVE_TEXT_ALIGN}>{`ID: ${userId}`}</Text>
          <NavigationButton show={show}>
            <a href="/login">Follow</a>
          </NavigationButton>
        </Box>
      </HeaderGrid>

      <Container>
        {/* User's playlists */}
        <Box>
          <table className="search-result-table">
            <tbody>
              <tr className='search-result-header'>
                <td className='header-td'>Title</td>
                <td className='header-td'>Description</td>
                <td className='header-td'>Username</td>
                <td className='header-td'>Date Created</td>
              </tr>

              {playlists.map((playlist) => {
                return (
                  <tr className='search-result-entry'>
                    <td className='result-td'>
                    <Link className='link-search' href={{pathname: '/playlists/', query: {userID: playlist.UserID, playlistID: playlist.PlaylistID}}}
                    style = {{textDecorationLine: "none"}}
                    >
                      {playlist.Title}
                      </Link>
                    </td>
                    <td className='result-td'>{playlist.Description}</td>
                    <td className='result-td'>{playlist.UserID}</td>
                    <td className='result-td'>{playlist.DateCreated.split('-').join(' ')}</td>
                  </tr>
                )
            })}
            </tbody>
          </table>
          {!playlists && (
            <Text textAlign={RESPONSIVE_TEXT_ALIGN}>
              {`${firstName} hasn't made any playlists yet.`}
            </Text>
          )}
        </Box>
      </Container>

      <Divider />

      {/* User's following */}
      <Container>

      </Container>
    </div>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const MYURL = "http://127.0.0.1:5000";
  const request = await fetch(`${MYURL}/get-all-users`)
  console.log(request);


  var paths = [];
  for (var i = 0; i < request.length; i++) {
    paths.push({params: { user: `$(request.usernames)` }})
  }
  console.log(paths);

  paths = [
   {
     params: {
       user: 'babygirl'
     }
   },
   {
     params: {
       user: 'cookiedog'
     }
   },
   {
     params: {
       user: 'tiffbuu'
     }
   },
   {
     params: {
       user: 'ckuch'
     }
   }
  ];

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const MYURL = "http://127.0.0.1:5000";
  const username = params.user;

  const request = await fetch(`${MYURL}/get-user-info/${username}`);
  const user = await request.json();

  const request2 = await fetch(`${MYURL}/get-playlists/${username}`);
  const playlistsj = await request2.json();

  return {
    props: { user, playlistsj }
  };
}

export default User;
