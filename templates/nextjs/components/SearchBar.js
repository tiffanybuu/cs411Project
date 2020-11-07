import React from 'react';

// tutorial by Praditya Adhitama

const SearchBar = ({input:keyword,onChange:setKeyword}) => {
    const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
    return (
      <input 
       style={BarStyling}
       key="key"
       value={keyword}
       placeholder={"search title/description"}
       onChange={(e) => setKeyword(e.target.value)}
      />
    );
  }
  
  export default SearchBar