import React from 'react';
import classes from "./Button.module.css";
interface ButtonProps {
    text: string;
    type?: string;
    className?: string;
    [props: string]: any
}

const Button = ({text, className, type = 'outline', ...rest} : ButtonProps) => {
    return (
        <button className={`${classes.btn} ${type === 'primary' ? classes.btnPrimary : classes.btnOutline} ${className !== undefined ? className : ''}`} {...rest}>{text}</button>
    );
};

export default Button;
