// import { useContext, useEffect, useState } from 'react'
import '../styles/Home.scss'
import Conversation from '../components/Conversation'
import Message from '../components/Message'
import ChatHeader from '../components/ChatHeader.jsx'
// import AuthContext from '../stores/authContext'
// import MessagesContext from '../stores/messagesContext'
// import { useNavigate } from 'react-router-dom'

const Messenger = () => {

    // const navigate = useNavigate()

    // const { currentUser } = useContext(AuthContext)
    // const { data } = useContext(MessagesContext)
    // console.log(currentUser)

    // const [username, setUsername] = useState("")
    // const [user, setUser] = useState("")
    // const [messages, setMessages] = useState([])
    // const [text, setText] = useState("")


    return (
        <div className='messenger'>
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <div className="chatMenuTop">
                        <div className='header'>
                            <div className="currentUser">
                                <img src={undefined} alt="img" className="currentUserImg" />
                                <span>Current User</span>
                            </div>
                        </div>
                        <input type="text" className='chatMenuInput' value={username} onKeyDown={e => e.code === "Enter" && alert()} onChange={e => setUsername(e.target.value)} placeholder='Search Friends Name' />
                        <div className='searchUser'>
                            <img src={undefined} alt="img" className="searchUserImg" />
                            <span className='searchUserName'>Searched User Full</span>
                        </div>
                        <Conversation />
                    </div>
                    <div className="chatMenuBottom">
                        <div className="logoutBtn">Logout</div>
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
                        <textarea placeholder="Write Message" value={text} onKeyDown={e => e.code === "Enter" && alert()} onChange={ e => setText(e.target.value)} className='chatMessageInput'/>
                        <button className='chatSubmitButton'>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger