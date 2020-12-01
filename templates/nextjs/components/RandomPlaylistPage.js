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
    Input
  } from "@chakra-ui/core"
import axios from "axios";
import Router, { withRouter } from 'next/router';

export async function getStaticProps(context) {
    return {
      // Unlike `getInitialProps` the props are returned under a props key
      // The reasoning behind this is that there's potentially more options
      // that will be introduced in the future.
      // For example to allow you to further control behavior per-page.
      props: {}
    }
  }
class RandomPlaylistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [],
            seletedTag: '',
            title: '',
            description: ''
        }
        this.onSubmitP = this.onSubmitP.bind(this)
        // this.changeDropdown = this.changeDropdown.bind(this)
    }

    componentDidMount() {
        try {
            let res = axios.get(`http://localhost:5000/all-tags`);
            res.then(ret => 
                this.setState({
                    tags: ret.data.data.Tags,
                    selectedTag: 'Pick a Tag',
                    title: '',
                    description: ''
                })
            )

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    changeDropdown(tag) {
        this.setState({
            selectedTag: tag
        });
        // console.log('here: ', tag, this.state.seletedTag)
    }

    handleTitleChange(event) {
        // console.log(event.target.value)
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

    onSubmitP(tag) {
        // call backend to generate random playlist 
        let title = this.state.title; 
        let description = this.state.description; 
        // console.log(title, description, tag)
        if (title && description && tag) {
            axios.post(`http://localhost:5000/random-playlist/${tag}/tbuu2`,
                {title,
                description})
            .then (ret => {
            //   Router.push({
            //     pathname: '/view-playlist-random',
            //         query: {
            //             PlaylistID: ret.data.data.PlaylistID,
            //             UserID: 'tbuu2',
            //             Title: title,
            //             Tag: tag
            //         }
            //     })
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

            // try { 
            //     let res = 
            //     // CHANGE USERNAME TO this.props.UserID 
            //         axios.post(`http://localhost:5000/random-playlist/${tag}/tbuu2`,
            //             {title,
            //             description});
            //     res.then(ret => 
            //         Router.push({
            //             pathname: '/view-playlist-random',
            //             query: {
            //                 PlaylistID: ret.data.data.PlaylistID,
            //                 UserID: 'tbuu2',
            //                 Title: title,
            //                 Tag: tag
            //             }
            //         })
            //     )
            // } catch (error) {
            //     console.log(error);
            //     throw error;
            // }
        }
        
        
        // Router.push({
        //     pathname: '/view-playlist-random',
        //     query: {
        //         UserID: 'tbuu2',
        //         Title: this.state.title,
        //     }
            
                

            
        // });
    }

    render() {
        // console.log(this.state.seletedTag);

        return (
            <div className = 'random-modal'>
                <h1 className='random-modal-description'>Use our random generator
                    to create a playlist with songs based off popular playlists! 
                    Pick a genre tag, title, and description to get started!</h1>
                <Menu className='tag-dropdown'>
                    {/* add rightIcon */}
                    <MenuButton as={Button} className='tag-dropdown'>
                        {this.state.selectedTag}
                    </MenuButton>
                    <MenuList>
                        {this.state.tags.map(tag => 
                            <MenuItem onClick={() => this.changeDropdown(tag)}>
                                {tag}
                            </MenuItem>)
                        }
                    </MenuList>
                </Menu>

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
                    onClick={() => this.onSubmitP(this.state.selectedTag)}
                >Submit
                </Button>

            </div>
            
        )
    }
}

export default withRouter(RandomPlaylistPage)