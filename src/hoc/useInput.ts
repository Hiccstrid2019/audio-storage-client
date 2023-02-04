import React, {useEffect, useState} from "react";

interface Validations {
    minLength?: number;
    maxLength?: number;
    checkEmpty?: boolean;
    checkEmail?: boolean;
    fieldName?: string
}

export interface Errors {
    isEmpty: boolean;
    isMinLengthError: boolean;
    minLength: number;
    isMaxLengthError: boolean;
    maxLength: number;
    emailError: boolean;
    fieldName?: string;
}

export interface MessageErrors  {
    isEmpty: (name: string) => string;
    minLengthError: (name: string, minLength: number) => string;
    maxLengthError: (name: string, minLength: number) => string;
    emailError: string;
}

export const MessageErrors: MessageErrors = {
    isEmpty: (name: string) => `the ${name} cannot be empty`,
    minLengthError: (name: string, minLength: number) => `the ${name} must be more than ${minLength} characters`,
    maxLengthError: (name: string, minLength: number) => `the ${name} must be less than ${minLength} characters`,
    emailError: "the email is not valid"
}

const useValidation = (value: string, validations: Validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [isMinLengthError, setMinLengthError] = useState(false);
    const [minLength, setMinLength] = useState(0);

    const [emailError, setEmailError] = useState(false);

    const [isMaxLengthError, setMaxLengthError] = useState(false);
    const [maxLength, setMaxLength] = useState(0);

    useEffect(() => {
        for (let validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation]! ? setMinLengthError(true) : setMinLengthError(false);
                    setMinLength(validations[validation]!);
                    break;
                case 'maxLength':
                    value.length > validations[validation]! ? setMaxLengthError(true) : setMaxLengthError(false);
                    setMaxLength(validations[validation]!);
                    break;
                case 'checkEmpty':
                    value ? setEmpty(false) : setEmpty(true);
                    break;
                case 'checkEmail':
                    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                    re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
                    break;
            }
        }
    }, [value])

    return {
        isEmpty,
        isMinLengthError,
        minLength,
        isMaxLengthError,
        maxLength,
        emailError,
        fieldName: validations?.fieldName
    }
}

export const useInput = (initialValue: string, validations: Validations) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const onBlur = () => {
        setDirty(true);
    }

    const isValid = () => {
        return !valid.isEmpty && !valid.isMinLengthError && !valid.isMaxLengthError && !valid.emailError;
    }

    const displayErrors = () => {
        setDirty(true);
    }

    return {
        value,
        clear: () => {setValue(''); setDirty(false)},
        onChange,
        onBlur,
        isDirty,
        valid,
        isValid,
        displayErrors
    }
}
