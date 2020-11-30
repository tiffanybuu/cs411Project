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
  } from "@chakra-ui/core"
import axios from "axios";

class RandomPlaylistPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [],
            seletedTag: 'Pick a Tag'
        }
    }

    componentDidMount() {
        try {
            let res = axios.get(`http://localhost:5000/all-tags`);
            res.then(ret => 
                this.setState({
                    tags: ret.data.data.Tags,
                    selectedTag: 'Pick a Tag'
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
        })
    }

    render() {
        return (
            
            <Menu>
                {/* add rightIcon */}
                <MenuButton as={Button} >
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
        )
    }
}
// const RandomPlaylistPage = (props) => {

//     // Get all tags from backend 
 
//     // const res = await fetch('http://localhost:5000/all-tags/', {method: "GET"})
//     // const d = await res.json()
//     try {
//         let res = axios.get(`http://localhost:5000/all-tags`);
//         // let tags = res.data.Tags;
//         console.log(res)
//         // let tags = res.data.data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }

//     // axios.get('http://localhost:5000/all-tags')
//     //   .then((response) => {
//     //     // let tags = response.data.Tags;
//     //     // console.log(tags)
//     //     console.log(response.data.Tags)
//     //   }, (error) => {
//     //     console.log(error);
//     //   });

//     // console.log(tags)
//     return (
//         <Menu>
//             {/* add rightIcon */}
//             <MenuButton as={Button} >
//                 Pick a Tag
//             </MenuButton>
//             <MenuList>
//                 <MenuItem>Download</MenuItem>
//                 <MenuItem>Create a Copy</MenuItem>
//                 <MenuItem>Mark as Draft</MenuItem>
//                 <MenuItem>Delete</MenuItem>
//                 <MenuItem>Attend a Workshop</MenuItem>
//             </MenuList>
//         </Menu>
//     );
// }


export default RandomPlaylistPage