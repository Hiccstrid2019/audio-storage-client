import {Link, useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../hoc/redux";
import {login} from "../../../store/reducers/UserActions";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import classes from './Login.module.css';
import {useInput} from "../../../hoc/useInput";

const Login = () => {

    const dispatch = useAppDispatch();
    const {loginError} = useAppSelector(state => state.userReducer);
    const location = useLocation();
    const navigate = useNavigate();
    const email = useInput('', {checkEmail: true, checkEmpty: true, fieldName: 'email'});
    const password = useInput('', {checkEmpty: true, minLength: 8, fieldName: 'password'});

    const fromPage = location.state?.from?.pathname || '/';

    const handleForm = () => {
        if (email.isValid() && password.isValid()) {
            dispatch(login({email: email.value, password: password.value, callback: () => navigate(fromPage)}));
        } else {
            email.displayErrors();
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
            <Input text='Password'
                   value={password.value}
                   onChange={password.onChange}
                   onBlur={password.onBlur}
                   isDirty={password.isDirty}
                   errors={password.valid} type='password'/>
            <div className={classes.error}>{loginError}</div>
            <Button text='Log In' onClick={handleForm} className={classes.loginBtn}/>
            <div className={classes.info}>
                Don't have an account yet? <Link className={classes.link} to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default Login;
