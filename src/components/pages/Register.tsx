import React from 'react';
import {registration} from "../../store/reducers/UserActions";
import classes from "./Register.module.css";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import {useAppDispatch} from "../../hoc/redux";
import {Link, useNavigate} from "react-router-dom";
import {useInput} from "../../hoc/useInput";

const Register = () => {
    const email = useInput('', {checkEmail: true, checkEmpty: true, fieldName: 'email'});
    const username = useInput('', {checkEmpty: true, minLength: 5, fieldName: 'username'});
    const password = useInput('', {checkEmpty: true, minLength: 8, fieldName: 'password'});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleForm = () => {
        if (email.isValid() && username.isValid() && password.isValid()) {
            dispatch(registration({email: email.value, password: password.value, username: username.value}));
            navigate('/');
        } else {
            email.displayErrors();
            username.displayErrors();
            password.displayErrors();
        }
    };

    return (
        <div className={classes.container}>
            <Input autoFocus
                   text='Email'
                   value={email.value}
                   onChange={email.onChange}
                   onBlur={email.onBlur}
                   isDirty={email.isDirty}
                   errors={email.valid}/>
            <Input text='Username'
                   value={username.value}
                   onChange={username.onChange}
                   onBlur={username.onBlur}
                   isDirty={username.isDirty}
                   errors={username.valid}/>
            <Input text='Password'
                   value={password.value}
                   onChange={password.onChange}
                   onBlur={password.onBlur} isDirty={password.isDirty}
                   errors={password.valid}
                   type='password'/>
            <Button text='Register' onClick={() => handleForm()} className={classes.registerBtn}/>
            <div className={classes.info}>
                Already have an account? <Link className={classes.link} to='/login'>Log in</Link>
            </div>
        </div>
    );
}

export default Register;
