import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode"
import {API} from "../api/api";

export const withToken = (Component) => {
    function TokenComponent(props) {
        const navigate = useNavigate()
        const [user, setUser] = useState(null)

        useEffect(() => {
            let access_token = localStorage.getItem('access_token')
            if(!access_token) {
                navigate('/login')
            }
            else {
                API.auth(access_token)
                    .then(data => {
                        if(data.jwt) {
                            access_token = data.jwt
                            localStorage.setItem('access_token', data.jwt)
                            setUser(jwt_decode(access_token))
                        }
                        else {
                            localStorage.removeItem('access_token')
                            navigate('/login')
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data.message)
                        localStorage.removeItem('access_token')
                        navigate('/login')
                    })
            }
        }, [])

        if(user)
            return <Component {...props} me={user} />
        else
            return <></>
    }

    return TokenComponent
}
