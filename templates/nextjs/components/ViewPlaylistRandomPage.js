import React, { useState, useEffect } from 'react';
import axios from "axios";
import Router, { withRouter } from 'next/router';

// CSS in /will be in RandomPlaylistPage.css

class ViewPlaylistRandomPage extends React.Component {
    constructor(props) {
        super(props)
        let routerProps = this.props.router.query
        this.state = {
            title: routerProps.Title,
            userID: routerProps.UserID,
            tag: routerProps.Tag,
            playlistID: routerProps.PlaylistID,
            dateCreated: '',
            description: '',
            playlistLength: 0,
            songs: []
        }

        this.songProcessing = this.songProcessing.bind(this);
    }

    componentDidMount() {
        // get playlist details
        try {
            let res = axios.get(`http://localhost:5000/get-specific-playlist/${this.state.playlistID}`);
            res.then(ret => 
                this.setState({
                    description: ret.data.data.PlaylistDetails[0].Description,
                    dateCreated: (ret.data.data.PlaylistDetails[0].DateCreated).split('-').join(' ')
                }),
            )

        } catch (error) {
            console.log(error);
            throw error;
        }

        // get songs 
        try {
            let res = axios.get(`http://localhost:5000/get-songs/${this.state.playlistID}`);
            res.then(ret => 
                this.setState({
                    songs: ret.data.data.Songs,
                    playlistLength: (ret.data.data.Songs).length
                })
            )

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    songProcessing(song) {


        if(song.Source == 'spotify') {
            // get url 
            let url = song.SongURL.split(':')[2]
            let finalURL = 'https://open.spotify.com/embed/track/' + url; 
            return (

                <div className = 'playlist-individual-song'>
                    <iframe src={finalURL} width="250" height="330" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
                
            )
        }
            // else if (songs[i].Source == 'soundcloud') {

            // }
        
    }

    render() {

        console.log(this.state)
        return(
            
            <div className='view-playlist'>
                <h1 className='playlist-title'>{this.state.title}</h1>
                <h2 className='playlist-description'>{this.state.description}</h2>
                <h2 className='playlist-date-created'>Date Created: {this.state.dateCreated}</h2>
                <h2 className='playlist-length'>Playlist Length: {this.state.playlistLength} songs</h2>
                <div className='song-wrapper'> 
                    {this.state.songs.map(song => 
                    this.songProcessing(song)
                    )
                    }
                </div>
                

            </div>
        )
        
    }
}


export default withRouter(ViewPlaylistRandomPage)