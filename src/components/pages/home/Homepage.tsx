import React from 'react';
import classes from './Homepage.module.css'
import Button from "../../ui/Button/Button";
import {Link} from "react-router-dom";
import Wave from './wave.svg';

const Homepage = () => {
    return (
        <div className={classes.container}>
            <img src={Wave} className={classes.wave}/>
            <div className={classes.main}>
                Welcome to the
                <div className={classes.title}>«Audio Storage»</div> - your personal, private audio storage
                <p className={classes.p}>Record your thoughts, songs and get access from any device</p>
                <Link to={'/project'}>
                    <Button className={classes.go} text={'Try It'}/>
                </Link>
            </div>
            <img src={Wave} className={classes.wave} style={{transform: "scale(-1,1)"}}/>
        </div>
    );
};

export default Homepage;
