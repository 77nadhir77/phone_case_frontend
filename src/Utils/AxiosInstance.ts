import axios, { InternalAxiosRequestConfig } from 'axios'
import { User } from './User'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import authTokenType from './AuthTokenType'
import { useUserContext } from '../Context/UserProvider'


const baseURL = 'http://localhost:8000'

const AxiosInstance = axios.create({
        baseURL, 
        timeout: 1000,
    })

console.log("axios instance created!")


AxiosInstance.interceptors.request.use(async(req:InternalAxiosRequestConfig)=> {

    console.log("axios interceptor triggered!")
    
    const token: string | null = localStorage.getItem("authTokens")
    const authTokens: authTokenType | null = token ? JSON.parse(token) : null
    console.log(authTokens?.accessToken)
    console.log(typeof authTokens?.accessToken)
    req.headers.Authorization = `Bearer ${authTokens?.accessToken}`
    
    
    console.log("authTokens initiliazed")
    
    const user:User = jwtDecode<User>(String(authTokens?.accessToken))
    console.log("User decoded!")
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if(!isExpired) return req

    console.log("access token expired!")
    await axios.post(`${baseURL}/token`, 
        {
            refreshToken: authTokens?.refreshToken
        }
    ).then(response => {
        localStorage.setItem('authTokens', JSON.stringify(response.data))
        req.headers.Authorization = `Bearer ${response.data.accessToken}`
        return req
    }).catch(err => { 
        localStorage.removeItem('authTokens')
        console.log(err.toJSON())   
    })

    return req

})

export default AxiosInstance