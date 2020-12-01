import React from 'react';
import Link from 'next/link';
import { Text, Button } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';

const linkPlaylist = (playlistID) => {
  Router.push({
    pathname: '/playlists/',
    query: {playlistID: playlistID}
  })
}
{/* <Button onClick={() => linkPlaylist(playlist.PlaylistID)}
> */}
  {/* {playlist.Title}</Button> */}
{/* <h2>{playlist.Title}</h2> */}
{/* <h1 style={{textDecorationLine: "underline", fontWeight: "bold"}}> */}
const SearchList = ({playlists=[]}) => {
  if (playlists.length !== 0) {
    return (

      <table className="search-result-table">
        <tbody>
          <tr className='search-result-header'>
            <td className='header-td'>Title</td>
            <td className='header-td'>Description</td>
            <td className='header-td'>Username</td>
            <td className='header-td'>Date Created</td>
          </tr>
  
          {playlists.map((playlist) => {
            // let l = "/playlist/" + encodeURI(playlist.PlaylistID);
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
              // <div key={playlist.Title}>
                  
  
              //     <h2>{playlist.Description}</h2>
              // </div>
            )
        })}
        </tbody>
      </table>
      
      // <div className= 'search-list'>
      
      );
  } else {
    return null; 
  }
  
}

export default withRouter(SearchList);
{/* {playlists.map((playlist) => {
      if (playlist) {
        let l = "/playlist/" + encodeURI(playlist.PlaylistID);
        return (
          <div key={playlist.Title}>
              <Link href={{pathname: '/playlists/', query: {playlistID: playlist.PlaylistID}}}>
              {playlist.Title}
              </Link>

              <h2>{playlist.Description}</h2>
          </div>
        )
      }
      return null
    })} */}
    {/* </div> */}