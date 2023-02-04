import React from 'react';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../hoc/redux";
import {logout} from "../../store/reducers/UserActions";
import Button from "../ui/Button/Button";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/', {replace: true});
    }

    return (
        <div>
            <h1>Coming soon</h1>
            <Button text='Exit' onClick={handleLogout}/>
        </div>
    );
};

export default Profile;
