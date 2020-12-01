import { useState, useEffect } from "react";
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import axios from "axios";

import Router, {useRouter} from "next/router";

export default function SignUpPage() {
    const router = useRouter()

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const onSignUpSubmit = (e) => {
      e.preventDefault();
      if (first_name && last_name && username && password) {
        // call api 
        axios.post(`http://localhost:5000/signup`, {first_name, last_name, username, password})
        .then (response => {
          setUsername(response.data.data.UserID)
          Router.push({
            pathname: `/${username}`
          })
        })
        .catch(error => {
          switch(error.response.status) {
            case 409:
              alert("Username already exists! Pick another one")
              return
            case 500:
              alert("Oops, something went wrong. Try again")
              return
          }
        })


      }
    };
  
    return (
      <div>
        <title> Sign Up </title>
        <h2 className="text-center"> Sign Up </h2>
  
        <form onSubmit={onSignUpSubmit}>
          <div className="form-group">
            <input
              value={first_name}
              type="first_name"
              className="form-control"
              id="first_name"
              aria-describedby="first_nameHelp"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              type="last_name"
              className="form-control"
              id="last_name"
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              className="form-control"
              id="username"
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
            />
          </div>
  
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  };
  