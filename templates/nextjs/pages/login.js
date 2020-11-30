import { useState, useEffect } from "react";
import { Box, ThemeProvider, CSSReset } from '@chakra-ui/core';

import Router from "next/router";

import { login } from "../requests/userApi";
import useUser from "../data/useUser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, loggedIn } = useUser();

  useEffect(() => {
    if (loggedIn) Router.replace("/");
  }, [loggedIn]);

  if (loggedIn) return <> Redirecting.... </>;

  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
      mutate();
    }
  };

  return (
    <div>
      <title> Login </title>
      <h2 className="text-center"> Login </h2>

      <form onSubmit={onLoginSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            value={email}
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
