import React, { useEffect, useState } from 'react'
import useAxios from '../../Utils/useAxios';


const Dashboard:React.FC = () => {

    const api = useAxios();
    const [users, setUsers] = useState([])
    
    
   
  
    const getUsers = async () => {
      await api.get('/users')
        .then((res) => {
            console.log('Fetched data:', res.data);
            setUsers(res.data)
        })
        .catch((err)=> {
          alert("request failed!!")
        })
    }

    useEffect(()=> {
      console.log('Dashboard component mounted');
      getUsers()
    },[])
    
  return(
    <div>Dashboard</div>
  )
}

export default Dashboard