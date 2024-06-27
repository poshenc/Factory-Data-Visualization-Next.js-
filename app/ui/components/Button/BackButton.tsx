import { ButtonHTMLAttributes, FunctionComponent } from 'react'
import styles from './Button.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { }

const BackButton: FunctionComponent<Props> = ({ className = '', disabled, children, ...props }) => {
    const mainClass = `
        ${styles['btn-outline']} 
        ${className} 
        ${disabled ? styles['btn-disabled'] : ''}
    `
    return (
        <button {...props} disabled={disabled} className={`${mainClass}`} onClick={() => window.history.back()}>
            Back
        </button>
    )
}

export default BackButton