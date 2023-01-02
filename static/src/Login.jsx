import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiShow } from "react-icons/bi";

const Login = (props) => {
  const email = useRef();
  const password = useRef();
  const form = useRef();
  const login = useRef();

  const navigate = useNavigate();

  const showPassword = () => {
    if (password.current.type === "password") {
      password.current.type = "text";
    } else {
      password.current.type = "password";
    }
  };

  const loginUser = (e) => {
    e.preventDefault();
    props.getUser(email.current.value, password.current.value);
    navigate("/");
  };


  console.log('login props', props)

  return (
    <div id="login-wrapper" ref={login}>
      <h2>Please Log in</h2>
      <h4>
        Don't have account?
        <Link to="/auth/signup" >Sign Up</Link>
      </h4>
      <form action="#" ref={form} onSubmit={loginUser}>
        <label htmlFor="login-email">
          <span className="login-label">Email: </span>
          <input type="text" name="login-email" required ref={email} />
        </label>
        <br />
        <br />
        <label htmlFor="login-password">
          <span className="login-label">Password: </span>
          <input
            type="password"
            name="login-password"
            required
            ref={password}
          />
          <span className="eye" onClick={showPassword}>
            <BiShow />
          </span>
        </label>
        <br />
        <br />
        <button type="button" onClick={props.cancelForm}>
          Cancel
        </button>
        <input type="submit" value="Log in" />
      </form>
    </div>
  );
};

export default Login;
