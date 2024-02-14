import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Login.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from '../../Utils/ApiRoutes'
import axios from 'axios'
import { RotatingLines } from 'react-loader-spinner'
import Logo from "../../Assect/logo.png"

export const Login = () => {
  const [loader, setLoader] = useState(false);
  const navigateTo = useNavigate();
  const notify = (message) => toast(message);
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  // User login before
  // useEffect(() => {
  //   if (localStorage.getItem('userData')) {
  //     navigateTo('/home');
  //   }
  // }, []);


  // input handler
  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  // Validate form
  const formValidate = () => {
    if (!data.email || !data.password) {
      notify("Empty Field")
      return false;
    }
    else if (data.password.length < 1) {
      notify("Password length must be greater then 4");
      return false;
    }
    else if (data.email.length < 5) {
      notify("Invalid Email");
      return false;
    }
    else {
      return true;
    }

  }

  // Login
  const login = async (event) => {

    event.preventDefault();
    if (formValidate()) {
      try {
        setLoader(true);
        const config = {
          headers: { "Content-type": "application/json" }
        };
        const response = await axios.post(loginRoute, data, config);
        localStorage.setItem("userData", JSON.stringify(response));
        navigateTo("/home");
        setLoader(false);
      } catch (error) {
        setLoader(false);
        notify("error");
        console.log(error);
      }
    }

  }

  return (
    <div className='login-container' >
      {/* React Toster */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Logo */}
      <div className='logo-container mb-5'>
        <img
          src={Logo}
          alt='logo'
          width={200}
          className='logo-img'
        />
      </div>
      

      {/* Input field */}
      <form onSubmit={(e) => login(e)} className='input-container'>

        <TextField
          className='text-white'
          id="outlined-basic"
          label="Email"
          variant="filled"
          color="success"
          name="email"
          onChange={inputHandler}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="filled"
          color="success"
          type='password'
          name="password"
          onChange={inputHandler}
        />
        <Button onClick={(e) => login(e)} type='submit' variant="contained" style={{backgroundColor : "#6559A2"}}>
          {/* setloader on api call */}
          {
            loader ? <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
              : "Login"
          }



        </Button>
      </form>

      <p>Don't have an account ? <NavLink className="text-pink-600" to='/register'>Create One.</NavLink></p>
    </div>
  )
}
