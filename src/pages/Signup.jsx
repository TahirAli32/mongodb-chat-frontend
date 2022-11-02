import React, { useContext, useEffect, useRef, useState } from 'react'
import '../styles/Signup.scss'
import { Link, useNavigate } from "react-router-dom"
import { MdError } from 'react-icons/md'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FiUpload } from 'react-icons/fi'
import { RiLoader3Fill } from 'react-icons/ri'
import axios from 'axios'
import { useReducer } from 'react'
import { INITIAL_STATE, requestReducer } from '../stores/requestReducer'
import AuthContext from '../stores/authContext'

const Signup = () => {

  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if(currentUser){
      navigate('/')
    }
    return
  }, [currentUser, navigate])

  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

  const [viewPassword, setViewPassword] = useState(false)
  // const [profile, setProfile] = useState("")

  const nameRef = useRef()
  const emailRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()

  const [state, dispatch] = useReducer(requestReducer, INITIAL_STATE)

  const handleSignUp = async () => {
    // document.title = 'CHCHCHC'
    // if(!nameRef.current.value.match(/([^\s])/) || !usernameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/) || profile === "" ){
    if(!nameRef.current.value.match(/([^\s])/) || !usernameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/)){
      dispatch({type: "FETCH_ERROR", payload: "All fields are required"})
      return
    }

    try{
      dispatch({type: "FETCH_START"})
      const credentials = {name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value}
      const user = await axios.post(`${BACKEND_HOST}/api/auth/signup`, credentials)
      await user.data.success ? handleSuccess(user.data) : dispatch({type: "FETCH_ERROR", payload: user.data.error})
    }
    catch(error){
      dispatch({type: "FETCH_ERROR", payload: error.message})
    }
  }

  const handleSuccess = (data) => {
    dispatch({type: "FETCH_SUCCESS", payload: data})
    navigate('/login')
  }

  const handleUpload = (event) => {
    // setProfile(event.target.files[0])
  }

  return (
    <main>
      <div className="signup" onKeyDown={e => e.code === "Enter" && handleSignUp()}>
        <h6>Create a Free Account</h6>
        {state.error && <div className='error'><span><MdError /></span>{state.errorMessage}</div>}
        <div className="inputField">
          <input autoFocus ref={nameRef} id='name' placeholder=" " className='inputBox' type="text" />
          <label htmlFor="name" className='inputLabel'>Full Name</label>
        </div>
        <div className="inputField">
          <input ref={usernameRef} id='username' placeholder=" " className='inputBox'  type="text" />
          <label htmlFor="username" className='inputLabel'>Username</label>
        </div>
        <div className="inputField">
          <input ref={emailRef} id='email' placeholder=" " className='inputBox' type="text" />
          <label htmlFor="email" className='inputLabel'>Email Address</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} style={{padding: '0 0 0 1rem'}} id='password' placeholder=" " className='inputBox' type={!viewPassword ? 'password' : 'text'} />
          <label htmlFor="password" className='inputLabel'>Password</label>
          <span className='viewPw' onClick={()=>setViewPassword(!viewPassword)}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
        </div>
        <div className='uploadFile'>
          <input type="file" id="assignmentFile" onChange={(e) => handleUpload(e)} />
          <label htmlFor="assignmentFile">
            <div className='btn'><span><FiUpload /></span>Upload Profile Photo</div>
          </label>
        </div>
        <div className='disclaimer'>
          <span>I agree to the Terms of Use and Privacy Policy</span>
        </div>
        <button className='btn' onClick={()=>handleSignUp()} style={!state.loading ? {marginTop: '1.5rem'} : {marginTop: '1.5rem', padding: '6.5px 0'}}>{!state.loading ? 'Sign Up' : <span className='loadingIcon'><RiLoader3Fill /></span>}</button>
        <p className="logIn">Already have an account? <Link to={'/login'}>Log In</Link></p>
      </div>
    </main>
  )
}

export default Signup