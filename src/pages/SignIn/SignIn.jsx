import React, {useState} from 'react'
import './SignIn.scss'
import Container from '../../component/Container/Container'
import Img from '../../asessts/notes-app.png'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setUsername } from '../../slice/UserSlice'
import toast from 'react-hot-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userAuth = useSelector((state) => state.user.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState()
  const [passwordError, setPasswordError] = useState()
  const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


  const signIn = async (e) => {
    try{
      e.preventDefault()
      if(!emailRegEx.test(email)){
        setEmailError("please enter a valid email")
        return
      }
      setEmailError()
      setPasswordError()
      
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userFunction/signIn`, {email, password})
      
      if(response.status == 200){
        // login successful
        const {name : username, token} = response.data
        localStorage.setItem('token', token)
        dispatch(setAuth(true))
        navigate(`/${username}`)
        toast.success('Login Successfull')
      } 
      else{
        //login not success
        console.log(response)
      }
    }
    catch(err){
      const {result} = err.response?.data
    
      if(!result){
        // email is not registered
        // incorrect password
        setPasswordError()
        setEmailError()
        toast.error('Invalid email or password')
      }
      else if (err.code === "ERR_NETWORK") {
        navigate('/signIn')
        toast.error("Server connection error")
      }
      else if(err.response?.data?.err){   
        toast.error(err.response?.data?.err?.message || "Internal Server Error")
      }
      console.log(err)
    }
  }

  return (
    <Container>
            <div className="signIn-Content">
                <img src={Img} alt="" className='signIn-Img' />
                
                <form action="" className='signIn-Form' onSubmit={(e) => signIn(e)}>
                    <div className='Title'>Sign In</div>
                      <div className="signIn-Form-Field">
                        <label htmlFor="email" name="email" id="email" className='signIn-Form-Label'>Email</label>
                        <input type="text" name="" id="" className='signIn-Form-Input' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <p className="error">{emailError}</p>
                    </div>
                    <div className="signIn-Form-Field">
                        <label htmlFor="password" name="password" id="password" className='signIn-Form-Label'>Password</label>
                        <input type="text" name="" id="" className='signIn-Form-Input' placeholder='Enter password'  value={password} onChange={(e) => setPassword(e.target.value)} />
                        <p className="error">{passwordError}</p>
                    </div>
                    <div className="Btn-div">
                        <button className="Btn">Submit</button>
                    </div>
                    <div className="redirectToSignUp">
                      <p>Don't have an account? <span className='redirect' onClick={() => navigate('/signUp')}> Sign Up </span></p>
                    </div>
                </form>
            </div>
        </Container>

  )
}

export default SignIn