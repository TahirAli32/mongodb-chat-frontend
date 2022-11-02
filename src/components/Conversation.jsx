// import { useState, useEffect, useContext } from 'react'
import '../styles/Conversation.scss'
// import AuthContext from '../stores/authContext'
// import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'

const Conversation = () => {

  // const { currentUser } = useContext(AuthContext)
  // const { dispatch } = useContext(MessagesContext)

  // const [chats, setChats] = useState([])

  return (
    <div className='conversation'>
      <div>
        <img src={pic} alt="img" className="conversationImg" />
        <span className='conversationName'>Converstion Name</span>
      </div>
    </div>
  )
}

export default Conversation