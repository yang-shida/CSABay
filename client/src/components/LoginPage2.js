import React, {useEffect} from 'react'
import { Redirect } from 'react-router-dom'
import auth from '../auth/auth'

const LoginPage = ({routerProps, setUserInfo}) => {
    
    const fetchUser = async(userID) =>{
        const res = await fetch(`http://localhost:8080/users/${userID}`)
        const data = await res.json()
        return data
    }

    return (
        <div>
            <button 
                onClick = {
                    async () => {
                        const userFromServer = await fetchUser(1)
                        auth.login(
                            () => {
                                setUserInfo(userFromServer)
                                routerProps.history.push("/")
                            }
                        )
                    }
                }
            >
                LOGIN
            </button>
        </div>
    )

}

export default LoginPage