import { ButtonHTMLAttributes, FunctionComponent } from 'react'
import styles from './Button.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { }

const Button: FunctionComponent<Props> = ({ className = '', disabled, children, ...props }) => {
    const mainClass = `
        ${styles['btn-outline']} 
        ${className} 
        ${disabled ? styles['btn-disabled'] : ''}
    `
    return (
        <button {...props} disabled={disabled} className={`${mainClass}`}>
            {children}
        </button>
    )
}

export default Button