import React from 'react';
import {NavLink} from "react-router-dom";
import classes from './Header.module.css';
import AccountIcon from './account.svg'
import {useAppSelector} from "../../hoc/redux";
import {useMatchMedia} from "../../hoc/useMatchMedia";
import BurgerMenu from "./BurgerMenu/BurgerMenu";

const setActive = ({isActive}: {isActive: boolean}) => isActive ? classes.link + ' ' + classes.active : classes.link;

function Header() {
    const {isAuth, username} = useAppSelector(state => state.userReducer);

    const {isMobile} = useMatchMedia();

    return (
        <header className={classes.header}>
            {!isMobile ?
                <>
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
                </>
                :
                <BurgerMenu>
                    <div className={classes.profileLink}>
                        <img src={AccountIcon} className={classes.icon}/>
                        {!isAuth ? (
                            <NavLink className={setActive} to='/login'>Login</NavLink>
                        ) : (
                            <NavLink className={setActive} to='/profile'>{username}</NavLink>
                        )}
                    </div>
                    <NavLink className={setActive} to='/'>Home</NavLink>
                    <NavLink className={setActive} to='/project'>Project</NavLink>
                </BurgerMenu>
            }
        </header>
    );
}

export default Header;
