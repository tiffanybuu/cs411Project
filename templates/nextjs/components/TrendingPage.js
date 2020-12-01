import React, { useState, useEffect } from 'react';
import axios from "axios";
import Router, { withRouter } from 'next/router';


class TrendingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topSongs: [],
            topTags: []
        }
        this.songProcessing = this.songProcessing.bind(this);

    }

    componentDidMount() {
        // get songs 
        try {
            let res = axios.get(`http://localhost:5000/top-songs-tag`);
            res.then(ret => 
                this.setState({
                    topSongs: ret.data.data.TopSongs,
                })
                // console.log(ret.data.data.TopSongs)
            )

        } catch (error) {
            console.log(error);
            throw error;
        }

        try {
            let res = axios.get(`http://localhost:5000/top-tags`);
            res.then(ret => 
                this.setState({
                    topTags: ret.data.data.tags,
                })
                // console.log(ret.data.data.TopSongs)
            )

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    songProcessing(song) {
        console.log(song)

        if(song["Source"] == 'spotify') {
            // get url 
            let url = song["SongURL"].split(':')[2]
            let finalURL = 'https://open.spotify.com/embed/track/' + url; 
            return (

                <div className = 'top-trending-songs'>
                    <iframe src={finalURL} width="250" height="330" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
                
            )
        }
        else if (song.Source == 'soundcloud') {
            let songUrl = song.SongURL;
            let url = 'https://w.soundcloud.com/player/?url=' + songUrl; 
            return (
                <div className='top-trending-songs'>
                    <iframe width="250" height="330" scrolling="no" frameborder="no" src={url}></iframe>
                </div>
            )
        }
        
    }

    render() {
        // console.log(this.state.topSongs)
        return(
            
            <div className='view-trending'>
                <h2 className='trending-songs-header'>Trending Songs</h2>
                <div className='song-wrapper'> 
                    {this.state.topSongs.map(song => 
                    this.songProcessing(song)
                    )
                    }
                </div>
                
                <h2 className='trending-tags-header'>Trending Tags</h2>
                <ol className='trending-tags-wrapper'>
                    {this.state.topTags.map(tag => 
                        <li>{tag["TagName"]}: {tag["Count"]} Playlists</li>
                    )}
                </ol>

            </div>


        )
    }
}

export default withRouter(TrendingPage)