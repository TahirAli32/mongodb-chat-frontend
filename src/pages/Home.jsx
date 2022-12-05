import { useContext, useEffect, useRef, useState } from 'react'
import '../styles/Home.scss'
import Conversation from '../components/Conversation'
import Message from '../components/Message'
import ChatHeader from '../components/ChatHeader.jsx'
import AuthContext from '../stores/authContext'
import { useNavigate } from 'react-router-dom'
import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'
import axios from 'axios'
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'
import { useMemo } from 'react'

const Messenger = () => {

    const navigate = useNavigate()

    const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

    const [socket, setSocket] = useState(null)
    
    const { currentUser } = useContext(AuthContext)
    const { dispatch, data } = useContext(MessagesContext)

    const userNameRef = useRef()

    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [searchedUsers, setSearchedUsers] = useState([])
    const [text, setText] = useState("")

    useMemo(()=>{
        if(currentUser){
            setSocket(io(BACKEND_HOST.replace('http://', 'ws://')))
            return
        }
    }, [BACKEND_HOST, currentUser])

    useEffect(() => {
        if(currentUser) return
        navigate('/login')
    }, [currentUser, navigate, BACKEND_HOST])

    useEffect(()=>{
        if(data.chatID){
            socket.emit('openChat', data.chatID)
            socket?.on("receiveMessage", (data) => setMessages(prev => [...prev, data]))
        }
    }, [data, socket])

    useEffect(()=>{
        const fetchConversation = async () => {
            const conversations = await axios.get(`${BACKEND_HOST}/api/conversation/${currentUser.id}`)
            try {
                setConversations(conversations.data.friends)
            } catch (error) {
                console.log(error)
            }
        }
        fetchConversation()
    }, [BACKEND_HOST, currentUser.id])

    useEffect(()=>{
        setMessages([])
        const fetchMessages = async () => {
            if(data.chatID){
                const messages = await axios.get(`${BACKEND_HOST}/api/chat/${data.chatID}`)
                try {
                    setMessages(messages.data[0]?.messages)
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
        let dbData = {
            chatID: data.chatID,
            senderID: currentUser.id,
            message: text
        }
        let socketData = {
            message: text,
            senderID: currentUser.id,
            sentAt: new Date().toISOString()
        }
        try {
            await axios.post(`${BACKEND_HOST}/api/chat`, dbData)
            socket.emit("sendMessage", { chatID: data.chatID, socketData })
            setMessages(prev => [...prev, socketData])
            setText("")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        if(!userNameRef.current.value.match(/([^\s])/)){
            return
        }
        let arr = []
        const searchResponse = await axios.get(`${BACKEND_HOST}/api/user?name=${userNameRef.current.value}`)
        for(const eachUser of searchResponse.data){
            if(eachUser.id !== currentUser.id){
                arr.push(eachUser)
            }
        }
        setSearchedUsers(arr)
    }
    
    const handleKeyPress = (event, nextFunction) => {
        if (event.keyCode === 13) {
          nextFunction()
        }
    }

    const handleSelect = async (userData) => {
        await axios.post(`${BACKEND_HOST}/api/conversation`, {currentUserID: currentUser.id, friendID: userData.id})
        dispatch({type: "CHANGE_USER", payload: userData})
        setSearchedUsers([])
        userNameRef.current.value = null
    }

    const handleLogout = () => {
        Cookies.remove('authToken')
        window.location = "/login"
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
                        {/* <input type="text" className='chatMenuInput' ref={userNameRef} onChange={() => handleSearch()} onKeyDown={e => handleKeyPress(e, handleSearch)} placeholder='Search Friend Name' /> */}
                        <input type="text" className='chatMenuInput' ref={userNameRef} onKeyDown={e => handleKeyPress(e, handleSearch)} placeholder='Search Friend Name' />
                        {searchedUsers?.map( user => (
                            <div key={user.id} className='searchUser' onClick={()=> handleSelect(user)}>
                                <img src={user.profileURL ? user.profileURL : pic} alt="img" className="searchUserImg" />
                                <span className='searchUserName'>{user.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className='chatMenuMiddle'>
                        {conversations?.map( c => (
                            <Conversation key={c} conversation={c} />
                        ))}
                    </div>
                    <div className="chatMenuBottom">
                        <div className="logoutBtn" onClick={() => handleLogout()}>Logout</div>
                    </div>
                </div>
            </div>
            <div className="chatBox">
                {data.user.id &&
                    <div className="chatBoxWrapper">
                        <ChatHeader />
                        <div className="chatBoxTop">
                            {messages?.map( (m,i) => (
                                <Message 
                                    key={i}
                                    sentAt={m.sentAt}
                                    message={m.message}
                                    own={m.senderID === currentUser.id ? true : false} 
                                />
                            ) )}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea placeholder="Write Message" value={text} onKeyDown={e => handleKeyPress(e, handleSend)} onChange={ e => setText(e.target.value)} className='chatMessageInput'/>
                            <button className='chatSubmitButton' onClick={ ()=> handleSend()}>Send</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Messenger