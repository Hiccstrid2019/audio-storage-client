import React from 'react';
import classes from './Error.module.css';

interface ErrorProps {
    error: string;
}

const Error = ({error}: ErrorProps) => {
    return (
        <div className={classes.container}>
            <div className={classes.title}>404 Not Found</div>
            <div className={classes.main}>It seems there is no such page, check the URL</div>
        </div>
    );
};

export default Error;
