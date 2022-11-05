import { useContext, useEffect, useState } from 'react'
import '../styles/Home.scss'
import Conversation from '../components/Conversation'
import Message from '../components/Message'
import { Link } from "react-router-dom"
import ChatHeader from '../components/ChatHeader.jsx'
import AuthContext from '../stores/authContext'
import { useNavigate } from 'react-router-dom'
import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'
import axios from 'axios'

const Messenger = () => {

    const navigate = useNavigate()

    const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(MessagesContext)
    // console.log(currentUser)

    const [username, setUsername] = useState("")
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")

    useEffect(() => {
        if(currentUser) return
        navigate('/login')
    }, [currentUser, navigate])

    useEffect(()=>{
        const fetchConversation = async () => {
            const conversations = await axios.get(`${BACKEND_HOST}/api/conversation/${currentUser.id}`)
            try {
                setConversations(conversations.data.friends)
                // console.log(conversations.data.friends)
            } catch (error) {
                console.log(error)
            }
        }
        fetchConversation()
    }, [BACKEND_HOST, currentUser.id])

    useEffect(()=>{
        const fetchMessages = async () => {
            if(data.chatID){
                const messages = await axios.get(`${BACKEND_HOST}/api/chat/${data.chatID}`)
                try {
                    setMessages(messages.data[0].messages)
                    // console.log(messages.data[0].messages)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchMessages()
    }, [BACKEND_HOST, data])

    const handleSend = async () => {
        if(!text.match(/([^\s])/)){
            return
        }
        let msgData = {
            chatID: data.chatID,
            senderID: currentUser.id,
            message: text
        }
        const newMessage = await axios.post(`${BACKEND_HOST}/api/chat`, msgData)
        try {
            console.log(newMessage.data)
            setText("")
        } catch (error) {
            console.log(error)
        }
    }

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
                    </div>
                    <div className='chatMenuMiddle'>
                        {conversations.map( c => (
                            <Conversation key={c} conversation={c} />
                        ))}
                    </div>
                    <div className="chatMenuBottom">
                        <div className="logoutBtn"><Link to={'/signup'}>Logout</Link></div>
                    </div>
                </div>
            </div>
            <div className="chatBox">
                {data.user.id &&
                    <div className="chatBoxWrapper">
                        <ChatHeader />
                        <div className="chatBoxTop">
                            {messages?.map( m => (
                                <Message 
                                    key={m._id}
                                    sentAt={m.sentAt}
                                    message={m.message}
                                    own={m.senderID === currentUser.id ? true : false} 
                                />
                            ) )}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea placeholder="Write Message" value={text} onKeyDown={e => e.code === "Enter" && alert(text)} onChange={ e => setText(e.target.value)} className='chatMessageInput'/>
                            <button className='chatSubmitButton' onClick={ ()=> handleSend()}>Send</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Messenger