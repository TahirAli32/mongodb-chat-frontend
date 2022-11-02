import { createContext, useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from 'axios'

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {

    const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST

    const [currentUser, setCurrentUser] = useState("")

    const authToken = Cookies.get('authToken')
    // const valdiateToken = Cookies.get('done')

    useEffect(() => {
    //   if(!valdiateToken){
        const tokenValidation = async () => {
            // console.log('token validation run')
            const res = await axios.post(`${BACKEND_HOST}/api/auth/validatetoken`, {authToken}, { withCredentials: true })
            if(res.data.error){
                Cookies.remove('authToken')
                setCurrentUser("")
                console.log('auth removed')
                return
            }
            else{
                // console.log(res.data.success.id)
                setCurrentUser(res.data.success)
                return
            }
        }
        tokenValidation()
    //   }
    }, [BACKEND_HOST, authToken])
    


    return(
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext