import '../styles/ChatHeader.scss'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useContext } from 'react'
import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'

const ChatHeader = () => {

  const { data, dispatch } = useContext(MessagesContext)

  // console.log(data)

  return (
    <div className='header'>
        <div className="chatUser">
            <img src={data.user.profileURL ? data.user.profileURL : pic} alt="img" className="userImg" />
            <span>{data.user.name}</span>
        </div>
        <div className="settingIcon" onClick={()=>dispatch({type: "NULL"})}><AiOutlineCloseCircle /></div>
    </div>
  )
}

export default ChatHeader