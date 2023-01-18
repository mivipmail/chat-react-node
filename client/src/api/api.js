import axios from "axios";

const instance = axios.create({
    //withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Access-Control-Allow-Credentials': true,
    }
})

export const API = {
    auth(access_token) {
        console.log('auth')
        return instance.get(`/auth`, {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                return res.data
            })
    },

    login({login, password}) {
        return instance.post(`/login`, {login, password})
            .then((res) => {
                console.log(res.data)
                return res.data
            })
    },

    register({name, login, password}) {
        return instance.post(`/register`, {name, login, password})
            .then((res) => {
                console.log(res.data)
                return res.data
            })
    },

}