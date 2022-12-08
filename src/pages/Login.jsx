import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import '../styles/Login.scss'
import { Link, useNavigate } from "react-router-dom"
import { MdError } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaLock } from 'react-icons/fa'
import AuthContext from '../stores/authContext'
import { RiLoader3Fill } from 'react-icons/ri'
import { INITIAL_STATE, requestReducer } from '../stores/requestReducer'
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate()

  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if(currentUser){
      navigate('/')
    }
    return
  }, [currentUser, navigate])

  const [emailInput, setEmail] = useState(false)
  const [passwordInput, setPassword] = useState(true)
  const [remember, setRemember] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()

  const [state, dispatch] = useReducer(requestReducer, INITIAL_STATE)

  const handleEmail = () => {
    if(!emailRef.current.value.match(/([^\s])/)){
      dispatch({type: "FETCH_ERROR", payload: "Email is Required"})
      return
    }
    setEmail(emailRef.current.value)
    setPassword(false)
    dispatch({type: "FETCH_SUCCESS", payload: {}})
  }

  const handleLogin = async () => {
    if(!passwordRef.current.value.match(/([^\s])/)){
      dispatch({type: "FETCH_ERROR", payload: "Password is Required"})
      return
    }
    try {
      dispatch({type: "FETCH_START"})
      const credentials = {email: emailInput, password: passwordRef.current.value, rememberMeToken: remember}
      const user = await axios.post(`${BACKEND_HOST}/api/auth/login`, credentials, { withCredentials: true })
      await user.data.success ? handleSuccess(user.data) : handleError(user.data)
    } catch (error) {
      dispatch({type: "FETCH_ERROR", payload: error.message})
    }
  }

  const handleSuccess = (data) => {
    dispatch({type: "FETCH_SUCCESS", payload: data})
    window.location = "/"
  }

  const handleError = (data) => {
    if(data.errorType === 'email'){
      setEmail(false)
      setPassword(true)
      dispatch({type: "FETCH_ERROR", payload: data.error})
    }
    else{
      dispatch({type: "FETCH_ERROR", payload: data.error})
    }
  }

  const handleKeyPress = (event, nextFunction) => {
    if (event.keyCode === 13) {
      nextFunction()
    }
  }

  return (
    <main>
      <div className="login">
        {!emailInput &&
          <div className='email-login'>
            <h6>Log in your Account</h6>
            <div className="input-field" onKeyDown={e => handleKeyPress(e, handleEmail)}>
              <span className='icon'><BsFillPersonFill /></span>
              <input autoFocus ref={emailRef} id='username' className='input-box' placeholder='Enter Your Email' type="text" />
            </div>
            {state.error && <div className='error'><span><MdError /></span>{state.errorMessage}</div>}
            <button className='btn' onClick={()=>handleEmail()}>Continue with Email</button>
            <div className='sign-up'>
              <p>Don't have an Account ?</p>
              <Link to={'/signup'}><button className='btn btn-signUp'>Sign Up</button></Link>
            </div>
          </div>
        }
        {!passwordInput &&
          <div className='password-login' onKeyDown={e => handleKeyPress(e, handleLogin)}>
            <h6>Welcome</h6>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '0.3rem', alignItems: 'center', justifyContent: 'center'}}>
              <p>{emailInput}</p>
              <span onClick={()=> {setEmail(false); setPassword(true)}} style={{color: 'green', cursor: 'pointer', textDecoration: 'underline', fontSize: '80%'}}>Change Email</span>
            </div>
            <div className="input-field" style={{ marginTop: '1rem' }}>
              <span className='icon'><FaLock /></span>
              <input autoFocus ref={passwordRef} id='password' className='input-box' placeholder='Enter your Password' type={!viewPassword ? 'password' : 'text'} />
              <span className='icon view-pw' onClick={()=>setViewPassword(!viewPassword)}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
            </div>
            <div className='otherChecks' style={{ marginTop: '5px' }}>
              <div>
                <input onClick={()=>{setRemember(!remember)}} style={{ cursor: 'pointer' }} type='checkbox' id='rememberMe' />
                <label htmlFor='rememberMe' style={{ marginLeft: '5px', cursor: 'pointer' }}>Keep me logged in</label>
              </div>
              <p className='forgotPw'>Forgot Password?</p>
            </div>
            {state.error && <div className='error' style={{ marginTop: '.5rem'}}><span><MdError /></span>{state.errorMessage}</div>}
            <button className='btn' style={!state.loading ? {marginTop: '1.5rem'} : {marginTop: '1.5rem', padding: '6.5px 0'}} onClick={()=>handleLogin()}>{!state.loading ? 'Login' : <span className='loadingIcon'><RiLoader3Fill /></span> }</button>
          </div>
        }
      </div>
    </main>
  )
}

export default Login