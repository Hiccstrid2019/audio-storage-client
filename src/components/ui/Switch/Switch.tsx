import React from 'react';
import classes from './Switch.module.css'

interface SwitchProps {
    isToggled: boolean;
    onToggle: React.ChangeEventHandler<HTMLInputElement>;
}

const Switch = ({isToggled, onToggle}: SwitchProps) => {
    return (
        <label className={classes.switch}>
            <input type='checkbox' checked={isToggled} onChange={onToggle}/>
            <span className={classes.slider}/>
        </label>
    );
};

export default Switch;
