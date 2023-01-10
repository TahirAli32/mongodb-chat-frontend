import { useContext } from "react"
import '../styles/Loader.scss'
import AuthContext from '../stores/authContext'

const Loader = () => {

    const { pageLoading } = useContext(AuthContext)
    
    if (!pageLoading) return null

    else return (
        <div className='loadingContainer'>
            <div className="lds-dual-ring"></div>
            <div className="loadingText">
                <p>Loading</p>
                <div className="dots">
                    <span className='dot1 dot'></span>
                    <span className='dot2 dot'></span>
                    <span className='dot3 dot'></span>
                </div>
            </div>
        </div>
    )
}

export default Loader