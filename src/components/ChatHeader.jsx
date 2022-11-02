import '../styles/ChatHeader.scss'
// import pic from '../assets/pic.png'
import { AiOutlineCloseCircle } from 'react-icons/ai'
// import { useContext } from 'react'
// import MessagesContext from '../stores/messagesContext'
import pic from '../assets/pic.jpg'

const ChatHeader = () => {

  // const { data, dispatch } = useContext(MessagesContext)

  return (
    <div className='header'>
        <div className="chatUser">
            <img src={pic} alt="img" className="userImg" />
            <span>display Name</span>
        </div>
        <div className="settingIcon"><AiOutlineCloseCircle /></div>
    </div>
  )
}

export default ChatHeader