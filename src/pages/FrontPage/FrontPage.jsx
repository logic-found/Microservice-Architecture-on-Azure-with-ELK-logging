import React, { useEffect } from "react";
import "./FrontPage.scss";
import { useNavigate } from "react-router-dom";
import Img from '../../asessts/notes-app.png'
import Container from "../../component/Container/Container";
import axios from 'axios'

const FrontPage = () => {
  const navigate = useNavigate();

  const autoRedirectToDashboard = async () => {
    try{
      const token = localStorage.getItem('token')
      if(!token) navigate('/signIn')
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/autoRedirectToDashboard`, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if(response.status === 200){
        const username = response.data.username
        navigate(`/${username}`)
      }

    }
    catch(err){
      if (err.code === "ERR_NETWORK") {
        navigate('/signIn')
        toast.error("Server connection error")
      }
      else if(err.response?.status === 401){   // if json error than navigate to login page
        navigate('/signIn')
      }
      console.log(err)
    }
  }

  useEffect(() => {
    //autoRedirectToDashboard()
  },[])
  return (
    <Container>
      <div className="frontPage-Content">
        <img src={Img} alt="" className="frontPage-Img" />
        <div className="Title frontPage-Title">Welcome to SimpleNote!</div>
        <div className="frontPage-BtnDiv">
          <button
            className="Btn signUp"
            onClick={() => navigate("/signUp")}
          >
            Sign Up
          </button>
          <button
            className="Btn signIn"
            onClick={() => navigate("/signIn")}
          >
            Sign In
          </button>
        </div>
      </div>
    </Container>
  );
};

export default FrontPage;
