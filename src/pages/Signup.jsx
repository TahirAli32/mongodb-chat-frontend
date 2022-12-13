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

  const [state, dispatch] = useReducer(requestReducer, INITIAL_STATE)

  useEffect(() => {
    if(currentUser){
      navigate('/')
    }
    return
  }, [currentUser, navigate])

  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

  const [viewPassword, setViewPassword] = useState(false)
  const [uploadPercent, setUploadPercent] = useState("")
  const [profile, setProfile] = useState("")

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSignUp = async () => {
    if(!nameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/) || profile === "" ){
    // if(!nameRef.current.value.match(/([^\s])/) || !emailRef.current.value.match(/([^\s])/) || !passwordRef.current.value.match(/([^\s])/)){
      dispatch({type: "FETCH_ERROR", payload: "All fields are required"})
      return
    }

    try{
      dispatch({type: "FETCH_START"})
      const credentials = {name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value, profileURL: profile}
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

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    let allowedTypes = ['jpeg', 'jpeg', 'png']
    let size = file.size/(1024**2)
    let type = file.type.split("/")

    if(!allowedTypes.includes(type[1]))
      return dispatch({type: "FETCH_ERROR", payload: 'Allowed File Types: PNG, JPEG, JPG'})

    if(size > 3)
      return dispatch({type: "FETCH_ERROR", payload: 'File Size cannot be larger than 3 MB'})

    dispatch({type: "FETCH_SUCCESS", payload: ''})

    let form = new FormData()
    let IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY

    form.append('image', file)
    let xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", ProgressHandler, false)
    xhr.addEventListener("load", SuccessHandler, false)
    xhr.open("POST", `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`)
    xhr.send(form)

    event.target.value = null
  }

  const ProgressHandler = (e) => {
    let percent = (e.loaded / e.total) * 100
    percent = Math.round(percent)
    setUploadPercent(percent)
    // console.log(`Loaded: ${(e.loaded / 1024 ** 2).toFixed(2)} MBs  Total: ${(e.total / 1024 ** 2).toFixed(2)} MBs  Percentage ${percent}%`)
  }

  const SuccessHandler = (e) => {
    const res = JSON.parse(e.target.response)
    setProfile(res.data.url)
    console.log(res.data.url)
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
          <input ref={emailRef} id='email' placeholder=" " className='inputBox' type="text" />
          <label htmlFor="email" className='inputLabel'>Email Address</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} style={{padding: '0 0 0 1rem'}} id='password' placeholder=" " className='inputBox' type={!viewPassword ? 'password' : 'text'} />
          <label htmlFor="password" className='inputLabel'>Password</label>
          <span className='viewPw' onClick={()=>setViewPassword(!viewPassword)}>{!viewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}</span>
        </div>
        <div className='uploadFile'>
          <input type="file" id="profilePic" onChange={(e) => handleUpload(e)} />
          {!uploadPercent && 
            <label htmlFor="profilePic">
              <div className='btn'><span><FiUpload /></span>Upload Profile Photo</div>
            </label>
          }
          {uploadPercent && !profile && 
            <div className='uploadingFile'>
              <div className="uploadingBtn" style={{width: `${uploadPercent}%`}}>{uploadPercent}%</div>
            </div>
          }
          {profile && <div className="uploadedFile">
            <div className="pic"><div style={{backgroundImage: `url('${profile}')`}}></div></div>
            <div className="options" onClick={()=> {setUploadPercent(""); setProfile("")}}>Remove or Change Profile Picture</div>
          </div>}
        </div>
        <div className='disclaimer'>
          <span>I agree to the Terms of Use and Privacy Policy</span>
        </div>
        <button className='btn' disabled={!state.loading  ? false : true} onClick={()=>handleSignUp()} style={!state.loading ? {marginTop: '1.5rem'} : {marginTop: '1.5rem', padding: '6.5px 0', cursor: 'no-drop'}}>{!state.loading ? 'Sign Up' : <span className='loadingIcon'><RiLoader3Fill /></span>}</button>
        <p className="logIn">Already have an account? <Link to={'/login'}>Log In</Link></p>
      </div>
    </main>
  )
}

export default Signup