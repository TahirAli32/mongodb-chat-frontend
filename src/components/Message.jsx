import '../styles/Message.scss'
import { format } from 'timeago.js'
import { useEffect, useRef } from 'react'

const Message = ({own}) => {

  const ref = useRef()

  return (
    <div ref={ref} className={own ? 'message own' : 'message'}>
      <div className={own ? "messageTop reverse" :"messageTop"}>
          <p className='messageText'>'message'</p>
      </div>
      <div className="messageBottom">
          {format(5484758)}
      </div>
    </div>
  )
}

export default Message