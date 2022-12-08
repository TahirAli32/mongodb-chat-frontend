import { createContext, useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from 'axios'

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {

    const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

    const [currentUser, setCurrentUser] = useState("")

    const authToken = Cookies.get('authToken')

    useEffect(() => {
        const tokenValidation = async () => {
            const res = await axios.post(`${BACKEND_HOST}/api/auth/validatetoken`, { authToken }, { withCredentials: true })
            if (res.data.error) {
                Cookies.remove('authToken')
                setCurrentUser("")
                return
            }
            else {
                setCurrentUser(res.data.success)
                return
            }
        }
        if(authToken){
            tokenValidation()
        }else{
            setCurrentUser("")
        }
    }, [BACKEND_HOST, authToken])

    return(
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext