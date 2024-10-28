import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '../Context/UserProvider';


interface ProtectedRoutesProps {
    allowedRoles?: String[]
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({allowedRoles}) => {
    const {user} = useUserContext()

    if(!user){
        return <Navigate to="/login" />
    }
    if(allowedRoles && !allowedRoles.includes(user.role as string)){
        return <Navigate to="/non-allowed-access" />
    }

    return <Outlet />
};

export default ProtectedRoutes;
