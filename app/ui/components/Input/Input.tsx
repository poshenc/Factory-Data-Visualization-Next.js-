import React, { ChangeEvent, InputHTMLAttributes, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    value: string | number;
    error?: string | boolean;
    onValueChange(value: string): void;
    isRequired?: boolean;
    isPassword?: boolean;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, Props>(({ name, error, className = '', value, onValueChange, isRequired = false, isPassword, ...props }, ref) => {
    const mainClass = `${styles.input} ${className}`

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        onValueChange(event.target.value)
    }

    // for password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : props.type

    const togglePasswordVisiblity = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const eyeIcon = isPasswordVisible ?
        (<VisibilityIcon onClick={togglePasswordVisiblity}></VisibilityIcon>) :
        (<VisibilityOffIcon onClick={togglePasswordVisiblity}></VisibilityOffIcon>)

    return (
        <>
            <div className={mainClass}>
                <label htmlFor={name}>
                    {name}
                    {isRequired && <span className={styles.asterisk}>*</span>}
                </label>
                <input id={name} ref={ref} {...props} value={value} onChange={onChangeHandler} type={inputType} autoComplete='off' />
                <div className={styles['error-message']}>{error}</div>
                <div className={styles['eye-icon']}>{isPassword && eyeIcon}</div>
            </div>
        </>
    )
})

export default Input