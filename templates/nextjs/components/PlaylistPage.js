import React, { useState, useEffect } from 'react';
import axios from "axios";
import Router, { withRouter } from 'next/router';
import {
    Divider,
    Tag,
    Button,
    TagCloseButton,
    Input,
    Menu,
    MenuButton, 
    MenuList,
    MenuItem,
  } from "@chakra-ui/core"
  import Link from 'next/link';

// CSS in /will be in RandomPlaylistPage.css
const songSources = ['spotify', 'soundcloud'];

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            userID: '',
            tags: [],
            playlistID: '',
            dateCreated: '',
            description: '',
            playlistLength: 0,
            songs: [],
            addTag: '',
            editDescription: '',
            addSongTitle: '',
            addSongLink: '',
            selectedSource: '',
        }

        this.songProcessing = this.songProcessing.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
    }

    componentDidMount() {

        // get URL parameters 
        let queryString = window.location.search; 
        let urlParams = new URLSearchParams(queryString)
        let playlistID = urlParams.get('playlistID')
        let userID = urlParams.get('userID')


        this.setState({
            playlistID: playlistID,
            userID: userID,
            selectedSource: 'Source'
        })

        if (playlistID) {
                // get playlist details
            try {
                let res = axios.get(`http://localhost:5000/get-specific-playlist/${playlistID}`);
                res.then(ret => {
                    this.setState({
                        title: ret.data.data.PlaylistDetails[0].Title,
                        description: ret.data.data.PlaylistDetails[0].Description,
                        dateCreated: (ret.data.data.PlaylistDetails[0].DateCreated).split('-').join(' ')
                    })
                }
                )

            } catch (error) {
                console.log(error);
                throw error;
            }

            // get songs 
            try {
                let res = axios.get(`http://localhost:5000/get-songs/${playlistID}`);
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

            // get tags 
            try {
                let res = axios.get(`http://localhost:5000/get-tags/${playlistID}`);
                res.then(ret => {

                    this.setState({
                        tags: ret.data.data.TagList,
                    })
                })
            } catch (error) {
                console.log(error);
                throw error;
            }

        }
    }


    // update 
    componentDidUpdate(prevProps, prevState) {

        if (prevState.description !== this.state.description) {
            try {
                let res = axios.get(`http://localhost:5000/get-specific-playlist/${this.state.playlistID}`);
                res.then(ret => {
                    this.setState({
                        // tags: ret.data.data.TagList,
                        // addTag: ''
                        description: ret.data.data.PlaylistDetails[0].Description,
                        editDescription: ''
                    })
                    
                })
            } catch (error) {
                console.log(error);
                throw error;
            }

            return
        }
        if (!(JSON.stringify(prevState.songs) === JSON.stringify(this.state.songs))) {
            axios.get(`http://localhost:5000/get-songs/${this.state.playlistID}`)
            .then (ret => {
                let newSongs = ret.data.data.Songs; 
                this.setState({
                    songs: newSongs,
                    addSongLink: '',
                    addSongTitle: '',
                    selectedSource: 'Source'
                })
            })
            .catch(error=> {
                alert(error)
                return
            })
        }
        if (!(JSON.stringify(prevState.tags) === JSON.stringify(this.state.tags))) {
            try {
                let res = axios.get(`http://localhost:5000/get-tags/${this.state.playlistID}`);
                res.then(ret => {
                    this.setState({
                        tags: ret.data.data.TagList,
                        // addTag: ''
                    })
                    
                })
            } catch (error) {
                console.log(error);
                throw error;
            }

            return
        } 
        return;
      }

    onDeleteTag(tag) {
        // console.log('want to delete: ', tag)
        if (tag) {
            try {
                let res = axios.delete(`http://localhost:5000/delete-tag/${this.state.playlistID}/${tag}`);
                res.then(ret => {
                    for (var i = 0; i < this.state.tags.length; i++) {
                        if (this.state.tags[i].TagName == tag) {
                            this.state.tags.splice(i, 1)
                        }
                    }
                    this.setState({ tags: this.state.tags });
                })
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
    onSubmitAddTag() {
        let addTagName = this.state.addTag; 
        if (addTagName) {
            axios.post(`http://localhost:5000/add-tag/${this.state.playlistID}/${addTagName}`,)
            .then (ret => {
                let newTag = {"TagName": addTagName}
                // const newTagList = Object.assign(this.state.tags, {newTag})
                // console.log(newTagList)
                axios.get(`http://localhost:5000/get-tags/${this.state.playlistID}`,)
                .then (ret => {
                    this.setState({
                        tags: ret.data.data.TagList,
                        addTag: ''
                    })
                })
                .catch(error=> {
                    return
                })
               
            })
            .catch(error => {
              switch(error.response.status) {
                case 409:
                  alert("You already added this tag to this playlist!")
                  return
                case 500:
                  alert("Oops, something went wrong. Try again")
                  return
              }
            })
        }
    }
    handleAddTagChange(e) {
        let val = e.target.value 
        this.setState({
            addTag: val
        })
    }
    songProcessing(song) {
        if(song.Source == 'spotify') {
            // get url 
            let url = song.SongURL.split(':')[2]
            let finalURL = 'https://open.spotify.com/embed/track/' + url; 
            return (

                <div className = 'playlist-individual-song'>
                    <iframe src={finalURL} width="250" height="330" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    <Button className='delete-song-button' size='sm'
                            onClick={() => this.onDeleteSong(song.SongID)}
                        >Delete Song
                    </Button>
                </div>
                
                
            )
        }
        else if (song.Source == 'soundcloud') {
            let songUrl = song.SongURL;
            let url = 'https://w.soundcloud.com/player/?url=' + songUrl; 
            return (
                <div className='playlist-individual-song'>
                    <iframe width="250" height="330" scrolling="no" frameBorder="no" src={url}></iframe>
                    <Button className='delete-song-button' size='sm'
                            onClick={() => this.onDeleteSong(song.SongID)}
                        >Delete Song
                    </Button>
                </div>
            )
        }
        
    }

    onDeleteSong(songID) {
        let playlistID = this.state.playlistID; 
        axios.delete(`http://localhost:5000/delete-song/${playlistID}/${songID}`, )
        .then (ret => {
            // get song
            axios.get(`http://localhost:5000/get-songs/${playlistID}`)
            .then (ret => {
                let newSongs = ret.data.data.Songs; 
                this.setState({
                    songs: newSongs,
                })
            })
            .catch(error=> {
                alert(error)
                return
            })
        })
        .catch(error=> {
            alert
            return
        })

    }
    handleEditDescriptionChange(e) {
        let desc = e.target.value;
        this.setState({
            editDescription: desc 
        })
    }
    onEditDescription() {
        let description = this.state.editDescription; 

        axios.put(`http://localhost:5000/update-playlist/${this.state.playlistID}`, {description})
        .then (ret => {
            this.setState({
                description: description,
                editDescription: ''
            })
        })
        .catch(error=> {
            return
        })
        
    }

    handleAddSongTitle(e) {
        let newSongTitle = e.target.value; 
        this.setState({
            addSongTitle: newSongTitle
        })
    }

    handleAddSongLink(e) {
        let newSongLink = e.target.value; 
        this.setState({
            addSongLink: newSongLink
        })
    }
    changeSourceDropdown(source) {
        this.setState({
            selectedSource: source
        })
    }
    onAddSong() {
        let source = this.state.selectedSource;
        let songURL = this.state.addSongLink;
        let songTitle = this.state.addSongTitle; 

        if (songURL && songTitle && source) {
            axios.post(`http://localhost:5000/add-song/${this.state.playlistID}`, {source, songURL, songTitle})
            .then (ret => {
                // get song
                axios.get(`http://localhost:5000/get-songs/${this.state.playlistID}`)
                .then (ret => {
                    let newSongs = ret.data.data.Songs; 
                    this.setState({
                        songs: newSongs,
                        addSongLink: '',
                        addSongTitle: '',
                        selectedSource: 'Source'
                    })
                })
                .catch(error=> {
                    alert(error)
                    return
                })
            })
            .catch(error=> {
                switch(error.response.status) {
                    case 409:
                        alert('Song already added!')
                        return
                    case 500:
                        alert('Oops, something went wrong!')
                        return
                }
            })
    
        } else {
            alert('Please fill in all of the criteria!')
        }
    }
    render() {

        // console.log(this.state)
        let userLink = "/"+this.state.userID;
        return(
            
            <div className='view-playlist'>
                <h1 className='playlist-title'>{this.state.title}</h1>
                <h2 className='playlist-description'>{this.state.description}</h2>
                <h2 className='playlist-user'>Created By: <Link 
                        className='user-link-profile'
                        href={{pathname: userLink}}
                    >
                        {this.state.userID}
                    </Link>
                </h2>
                <h2 className='playlist-date-created'>Date Created: {this.state.dateCreated}</h2>
                <h2 className='playlist-length'>Playlist Length: {this.state.playlistLength} songs</h2>
                <Divider className = 'tag-divider'/>
                
                <div className='tag-wrapper'>
                    {this.state.tags.map(tag =>
                        <Tag className='ind-tag'>
                            {tag.TagName}
                            <TagCloseButton onClick={() => this.onDeleteTag(tag.TagName)}/>
                        </Tag>
                        
                    )}
                    <Input className='add-tag-input' placeholder="" size="sm"
                        value={this.state.addTag} onChange={(e) => this.handleAddTagChange(e)}
                    />
                    <Button className='add-tag-button' size='sm'
                        onClick={() => this.onSubmitAddTag()}
                    >Add Tag</Button>


                </div>
                <div className='edit-description-wrapper'>
                    <Input className='edit-description-input' placeholder="" size="sm"
                        value={this.state.editDescription} onChange={(e) => this.handleEditDescriptionChange(e)}
                    />
                    <Button className='edit-description' size='sm'
                        onClick={() => this.onEditDescription()}
                    >Edit Description</Button>
                </div>

                <Divider className='add-song-divider'/>

                <div className='add-song-wrapper' >
                <Menu className='song-source-dropdown'>
                        
                        <MenuButton as={Button} className='song-source-dropdown'>
                            {this.state.selectedSource}
                        </MenuButton>
                        <MenuList>
                            {songSources.map(source => 
                                <MenuItem onClick={() => this.changeSourceDropdown(source)}>
                                    {source}
                                </MenuItem>)
                            }
                        </MenuList>
                    </Menu>
                    <Input className='add-song-title' placeholder="Song Title" size="sm"
                        value={this.state.addSongTitle} onChange={(e) => this.handleAddSongTitle(e)}
                    />
                    <Input className='add-song-link' placeholder="Spotify URI or Soundcloud URL" size="sm"
                        value={this.state.addSongLink} onChange={(e) => this.handleAddSongLink(e)}
                    />

                   
                    <Button className='add-song-button' size='sm'
                            onClick={() => this.onAddSong()}
                        >Add Song
                    </Button>

                </div>
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
export default withRouter(PlaylistPage)