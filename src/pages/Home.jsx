import { useContext, useEffect, useState } from 'react'
import '../styles/Home.scss'
import Conversation from '../components/Conversation'
import Message from '../components/Message'
import { Link } from "react-router-dom"
import ChatHeader from '../components/ChatHeader.jsx'
import AuthContext from '../stores/authContext'
import { useNavigate } from 'react-router-dom'
// import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'

const Messenger = () => {

    const navigate = useNavigate()

    const { currentUser } = useContext(AuthContext)
    // const { data } = useContext(MessagesContext)

    useEffect(() => {
        if(currentUser) return
        navigate('/login')
    }, [currentUser, navigate])


    const [username, setUsername] = useState("")
    // const [user, setUser] = useState("")
    // const [messages, setMessages] = useState([])
    const [text, setText] = useState("")

    return (
        <div className='messenger'>
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <div className="chatMenuTop">
                        <div className='header'>
                            <div className="currentUser">
                                <img src={pic} alt="img" className="currentUserImg" />
                                <span>{currentUser.name}</span>
                            </div>
                        </div>
                        <input type="text" className='chatMenuInput' value={username} onKeyDown={e => e.code === "Enter" && alert()} onChange={e => setUsername(e.target.value)} placeholder='Search Friends Name' />
                        <div className='searchUser'>
                            <img src={pic} alt="img" className="searchUserImg" />
                            <span className='searchUserName'>Searched User Full</span>
                        </div>
                        <Conversation />
                    </div>
                    <div className="chatMenuBottom">
                        <div className="logoutBtn"><Link to={'/signup'}>Logout</Link></div>
                    </div>
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    <ChatHeader />
                    <div className="chatBoxTop">
                        <Message own />
                    </div>
                    <div className="chatBoxBottom">
                        <textarea placeholder="Write Message" value={text} onKeyDown={e => e.code === "Enter" && alert(text)} onChange={ e => setText(e.target.value)} className='chatMessageInput'/>
                        <button className='chatSubmitButton' ><Link to={'/login'}>Send</Link></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger