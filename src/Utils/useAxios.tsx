import { useUserContext } from '../Context/UserProvider'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { User } from './User'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useUserContext()
    const navigate = useNavigate() 
    const baseURL = 'http://localhost:8000'

    const AxiosInstance = axios.create({
            baseURL, 
            timeout: 5000,
            headers: {Authorization: `Bearer ${authTokens?.accessToken}`}
        })
    
AxiosInstance.interceptors.request.use(async(req:InternalAxiosRequestConfig)=> {

    
    const user:User = jwtDecode<User>(String(authTokens?.accessToken))
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if(!isExpired) return req

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
        setUser(null)
        setAuthTokens(null)
        alert("session expired") 
        navigate('/login')
    })

    
    return req
})



    return AxiosInstance;
}

export default useAxios