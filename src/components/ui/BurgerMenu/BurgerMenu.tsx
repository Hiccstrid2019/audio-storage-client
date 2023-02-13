import React, {useState} from 'react';
import classes from './BurgerMenu.module.css';
import BurgerIcon from './burger.svg'

interface BurgerMenuProps {
    children: React.ReactNode;
}

const BurgerMenu = ({children}: BurgerMenuProps) => {
    const [menuActive, setMenuActive] = useState(false);
    return (
        <div className={menuActive ? `${classes.container} ${classes.containerActive}` : classes.container}>
            <img src={BurgerIcon} onClick={() => setMenuActive(!menuActive)} className={classes.icon}/>
            <div className={menuActive ? `${classes.menu} ${classes.active}` : classes.menu} onClick={() => setMenuActive(false)}>
                {
                    children
                }
            </div>
        </div>
    );
};

export default BurgerMenu;
