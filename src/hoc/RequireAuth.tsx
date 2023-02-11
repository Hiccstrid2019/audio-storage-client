import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {useAppSelector} from "./redux";

interface RequireAuthProps {
    children: React.ReactNode
}

const RequireAuth = ({children}: RequireAuthProps) => {
    const location = useLocation();
    const {isAuth,  isLoading} = useAppSelector(state => state.userReducer);

    if (isLoading) {
        return <div>Loading....</div>
    }

    return (
        <>
            {!isAuth ? <><Navigate to='/login' state={{from: location}} replace/></>: children}
        </>
    )
}

export default RequireAuth;
