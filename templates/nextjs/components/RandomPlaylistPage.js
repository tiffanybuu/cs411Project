import React, { useState, useEffect } from 'react';
import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
    Input,
    Divider,
    Select
  } from "@chakra-ui/core"
import axios from "axios";
import Router, { withRouter } from 'next/router';

class RandomPlaylistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [],
            seletedTag: '',
            title: '',
            description: '',
            userID: ''
        }
        this.onSubmitP = this.onSubmitP.bind(this)
        // this.changeDropdown = this.changeDropdown.bind(this)
    }

    componentDidMount() {
        // CHANGE WHEN WE HAVE ADDED USER 
        // get URL parameters 
        // let queryString = window.location.search; 
        // let urlParams = new URLSearchParams(queryString)
        // let userID = urlParams.get('userID')
        axios.get(`http://localhost:5000/all-tags`,)
        .then (ret => {
            // console.log('set: ', ret.data.data.Tags)
            this.setState({
                tags: ret.data.data.Tags,
                selectedTag: ret.data.data.Tags[0],
                title: '',
                description: ''
            })
        })
        .catch(error=> {
            return
        })

    }

    changeDropdown(tag) {
        if (tag) {
            this.setState({
                selectedTag: tag
            });
        }
        
    }

    handleTitleChange(event) {
        let val = event.target.value;
        this.setState({
            title: val
        })

    }


    handleDescriptionChange(event) {
        // console.log(event.target.value)
        let val = event.target.value;
        this.setState({
            description: val
        })
    }

    onSubmitP() {
        // call backend to generate random playlist 
        let title = this.state.title; 
        let description = this.state.description; 
        
        let sel = document.getElementById("select");
        let tag= sel.options[sel.selectedIndex].text

        // console.log(title, description, tag)
        if (title && description && tag) {
            axios.post(`http://localhost:5000/random-playlist/${tag}/tbuu2`,
                {title,
                description})
            .then (ret => {
                Router.push({
                    pathname: '/playlists',
                    query: {
                        playlistID: ret.data.data.PlaylistID,
                        userID: 'tbuu2'
                    }
                })
            })
            .catch(error => {
              switch(error.response.status) {
                case 409:
                  alert("You already have a playlist with this title, choose another name! Pick another one")
                  return
                case 500:
                  alert("Oops, something went wrong. Try again")
                  return
              }
            })
        }
    }
    render() {
        // console.log(this.state.seletedTag);
        let tags = this.state.tags; 
        console.log(tags)
        if (tags.length) {
            return (
                <div className = 'random-modal'>
                    <h1 className='random-modal-description'>Use our random generator
                        to create a playlist with songs based off popular playlists! 
                        Pick a genre tag, title, and description to get started!</h1>
                    <Divider className='random-generator'></Divider>
                    
                    <div className = 'random-playlist-wrapper'>
                    <Select id='select' isFullWidth='false' className='select' placeholder="Select Tag">
                        {
                            tags.map(tag =>
                                <option >{tag}</option>
                                )
                        }
                        </Select>
                        {/* <Menu className='tag-dropdown' preventOverflow='true'>
                            <MenuButton as={Button} className='tag-dropdown'>
                                {tags[0]}
                            </MenuButton>
                            <MenuList>
                                {
                                    tags.map(tag =>  
                                        // console.log('tag: ', tag),
                                        // <MenuItem onClick={() => this.changeDropdown(tag)}>
                                        //     {tag}
                                        // </MenuItem>
                                        <MenuItem>Help
                                        </MenuItem>
                                        )
                                    // for (var i = 0; i < tags.length; i++) {
                                    //     <MenuItem>Help </MenuItem>
                                    // }
                                }
                            </MenuList>
                        </Menu> */}
                       
                        <Input
                            className='title-input'
                            value={this.state.title}
                            onChange={(e) => this.handleTitleChange(e)}
                            placeholder="Enter Title Here"
                            size="sm"       
                        />
    
                        <Input
                            className='desc-input'
                            value={this.state.description}
                            onChange={(e) => this.handleDescriptionChange(e)}
                            placeholder="Enter Description Here"
                            size="sm"       
                        />
    
                        <Button
                            className='submit-button'
                            onClick={() => this.onSubmitP()}
                        >Submit
                        </Button>
                    </div>
                    
    
                </div>
                
            )
        } 
        else {
            return null; 
        }
        
    }
}

export default withRouter(RandomPlaylistPage)