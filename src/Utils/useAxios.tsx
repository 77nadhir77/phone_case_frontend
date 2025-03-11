import { useUserContext } from '../Context/UserProvider'
import axios, { InternalAxiosRequestConfig } from 'axios'
import { User } from './User'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useUserContext()
    const navigate = useNavigate() 
    const baseURL = process.env.REACT_APP_BACKEND_URL

    const AxiosInstance = axios.create({
            baseURL, 
            timeout: 5000,
            headers: {Authorization: `Bearer ${authTokens?.accessToken}`}
        })

        
    
AxiosInstance.interceptors.request.use(async(req:InternalAxiosRequestConfig)=> {
    // object to store ongoing requests cancel tokens
    const pendingRequests = new Map();



    // generate an identifier for each request
    const requestIdentifier = `${req.url}_${req.method}`; 

    // check if there is already a pending request with the same identifier
    if (pendingRequests.has(requestIdentifier)) {
        const cancelTokenSource = pendingRequests.get(requestIdentifier);
        // cancel the previous request
        cancelTokenSource.cancel('Cancelled due to new request');
    }

    // create a new CancelToken
    const newCancelTokenSource = axios.CancelToken.source();
    req.cancelToken = newCancelTokenSource.token;

    // store the new cancel token source in the map
    pendingRequests.set(requestIdentifier, newCancelTokenSource);
    
    
    const user:User = jwtDecode<User>(String(authTokens?.accessToken))
    const isExpired = dayjs.unix(user.exp as number).isBefore(dayjs());

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
        console.log(err)
        localStorage.removeItem('authTokens')
        setUser(null)
        setAuthTokens(null)
        alert("session expired please login again") 
        navigate('/')
    })

    
    return req
})

    return AxiosInstance;
}

export default useAxios