import { useState, useEffect, useContext } from 'react'
import '../styles/Conversation.scss'
import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'
import axios from 'axios'

const Conversation = ({conversation}) => {

  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

  const { dispatch } = useContext(MessagesContext)

  const [user, setUser] = useState([])

  useEffect(()=>{
    const fetchConversation = async () => {
      const res = await axios.get(`${BACKEND_HOST}/api/user/${conversation}`)
      try {
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversation()
  }, [BACKEND_HOST, conversation])

  const handleSelect = (userData) => {
    dispatch({type: "CHANGE_USER", payload: userData})
  }

  return (
    <div className='conversation'>
      <div onClick={() => handleSelect(user)}>
        <img src={user.profileURL ? user.profileURL : pic} alt="img" className="conversationImg" />
        <span className='conversationName'>{user.name}</span>
      </div>
    </div>
  )
}

export default Conversation