import React, { useState } from "react";
import "./SignUp.scss";
import Container from "../../component/Container/Container";
import Img from "../../asessts/notes-app.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateFun = () => {
    let validation = true;

    if (!isNaN(name)) {
      setNameError("name must contain alphabets only");
      validation = false;
    } else if (name.length > 15) {
      setNameError("name must contain 15 aplhabets only");
      validation = false;
    } else {
      setNameError();
    }

    if (!emailRegEx.test(email)) {
      setEmailError("please enter a valid email");
      validation = false;
    } else {
      setEmailError();
    }

    if (password.length < 4) {
      setPasswordError("password must have alteast 4 characters");
      validation = false;
    } else {
      setPasswordError();
    }
    return validation;
  };

  const signUp = async (e) => {
    try {
      e.preventDefault();
      if (!validateFun()) return; // if fields are not validated then return
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/userFunction/signUp`,
        { name, email, password }
      );
      if (response.status == 201) {
        setEmail("");
        setName("");
        setPassword("");
        toast.success("User registered successfully!");
        navigate("/signIn");
      } else {
        console.log(response);
      }
    } catch (error) {
      if (error.response?.data?.err == "Already registered email") {
        toast.error("This email is already registered");
      } else if (err.code === "ERR_NETWORK") {
        navigate("/signIn");
        toast.error("Server connection error");
      } else if (err.response?.data?.err) {
        toast.error(
          err.response?.data?.err?.message || "Internal Server Error"
        );
      }
    }
  };

  return (
    <Container>
      <div className="signUp-Content">
        <img src={Img} alt="" className="signUp-Img" />

        <form action="" className="signUp-Form" onSubmit={signUp}>
          <div className="Title">Sign Up</div>
          <div className="signUp-Form-Field">
            <label
              htmlFor="name"
              name="name"
              id="name"
              className="signUp-Form-Label"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="signUp-Form-Input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <p className="error">{nameError}</p>
          </div>
          <div className="signUp-Form-Field">
            <label
              htmlFor="email"
              name="email"
              id="email"
              className="signUp-Form-Label"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="name"
              className="signUp-Form-Input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <p className="error">{emailError}</p>
          </div>
          <div className="signUp-Form-Field">
            <label
              htmlFor="password"
              name="password"
              id="password"
              className="signUp-Form-Label"
            >
              Password
            </label>
            <input
              type="text"
              name="password"
              id="password"
              className="signUp-Form-Input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <p className="error">{passwordError}</p>
          </div>
          <div className="Btn-div">
            <button className="Btn">Submit</button>
          </div>
          <div className="redirectToSignIn">
            <p>
              Already have an account?{" "}
              <span className="redirect" onClick={() => navigate("/signIn")}>
                {" "}
                Sign In{" "}
              </span>
            </p>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
