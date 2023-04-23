import classes from "./Input.module.css"
import React from "react";
import {Errors, MessageErrors} from "../../../hoc/useInput";

interface InputProps {
    text?: string,
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    errors?: Errors
    isDirty?: boolean;
    errorsTop?: number;
    errorsWidth?: number;
    [props: string]: any;
}


const Input = ({text, value, onChange, onBlur, errors, isDirty, errorsTop, errorsWidth, ...rest}: InputProps) => {
    return (
        <div className={classes.container}>
            <input className={classes.input} placeholder={text} onChange={onChange} onBlur={onBlur} value={value} {...rest}/>
            {
                isDirty &&
                <div className={classes.errors} style={(errorsTop && errorsWidth) ? {top: `${errorsTop}px`, width: `${errorsWidth}px`} : {}}>
                    {
                        Object.keys(errors as Object).map((key, index) => {
                            if (!(errors) || errors[key as keyof Errors] === true) {
                                if (key == 'isMinLengthError') {
                                    return <p key={index} className={classes.error}>{MessageErrors.minLengthError(errors?.fieldName!, errors?.minLength!)}</p>;
                                } else if (key == 'isMaxLengthError') {
                                    return <p key={index} className={classes.error}>{MessageErrors.maxLengthError(errors?.fieldName!, errors?.maxLength!)}</p>;
                                } else if (key == 'isEmpty') {
                                    return <p key={index} className={classes.error}>{MessageErrors.isEmpty(errors?.fieldName!)}</p>;
                                }
                                return <p key={index} className={classes.error}>{MessageErrors[key as keyof MessageErrors] as string}</p>;
                            }
                        })
                    }
                </div>
            }
        </div>
    );
};

export default Input;
