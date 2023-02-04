import React from 'react';
import {NavLink} from "react-router-dom";
import classes from './Header.module.css';
import AccountIcon from './account.svg'
import {useAppSelector} from "../../hoc/redux";

const setActive = ({isActive}: {isActive: boolean}) => isActive ? classes.link + ' ' + classes.active : classes.link;

function Header() {
    const {isAuth, username} = useAppSelector(state => state.userReducer);

    return (
        <header className={classes.header}>
            <NavLink className={setActive} to='/'>Home</NavLink>
            <NavLink className={setActive} to='/project'>My records</NavLink>


            <div className={classes.profileLink}>
                <img src={AccountIcon}/>
                {!isAuth ? (
                    <NavLink className={setActive} to='/login'>Login</NavLink>
                ) : (
                    <NavLink className={setActive} to='/profile'>{username}</NavLink>
                )}
            </div>
        </header>
    );
}

export default Header;
