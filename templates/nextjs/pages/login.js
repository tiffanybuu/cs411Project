import { useState, useEffect } from "react";
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';
import axios from "axios";

import Router, {useRouter} from "next/router";

export default function LoginPage() {
    const router = useRouter()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const onLoginSubmit = (e) => {
      e.preventDefault();
      if (username && password) {

        axios.post(`http://localhost:5000/login`, {username, password})
        .then (response => {
          setUsername(response.data.data.username)
          Router.push({
            pathname: `/user/${username}`
          })
          //Router.push('/user/[user]', `/user/${username}`)
          // Router.push({
          //   pathname: `/${username}`
          // })
        })
        .catch(error => {
          switch(error.response.status) {
            case 400:
              alert("Username not found")
              return
            case 401:
              alert("Password incorrect. Try again")
              return
          }
        })
      }
    };

    return (
      <div>
        <title> Login</title>
        <h2 className="text-center"> Login </h2>

        <form onSubmit={onLoginSubmit}>
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
