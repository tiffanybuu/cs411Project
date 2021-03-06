import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchList from './SearchList';
import Router, { withRouter } from 'next/router';

const SearchPage = (props) => {
  const [input, setInput] = useState('');
  const [searchListDefault, setSearchListDefault] = useState();
  const [searchList, setSearchList] = useState();

  const fetchData = async (query) => {
    console.log("Fetching")
    if (query) {
    // console.log(query)
    const res = await fetch('http://localhost:5000/search-playlists/' + query, {method: "GET"})
    const d = await res.json()
    let results = JSON.parse(JSON.stringify(d.data)).SearchResults
    console.log(results)
    // await fetch('http://localhost:5000/search-playlists/' + query, {method: "GET"})
    //   .then(response => response.json())
    //   .then(data => {
    setSearchList(results) 
    setSearchListDefault(results)
    //    });}}
    }}

  const updateInput = async (input) => {
    //  const filtered = searchListDefault.filter(country => {
    //   return country.name.toLowerCase().includes(input.toLowerCase())
    //  })
    console.log("Updating input to " + input)
     setInput(input);
     if (input !== '') {
      console.log('not empty')
      fetchData(input);
     } else {
       setSearchList([])
     }
    //  setSearchList(filtered);
  }

  useEffect( () => {updateInput()},[]);
	
  return (
    <div className = 'search-wrapper'>
      <h1 className='search-header'>Search For Playlists!</h1>
      <SearchBar 
       input={input} 
       onChange={updateInput}
      />
      <SearchList playlists={searchList}/>
    </div>
   );
}

export default withRouter(SearchPage)