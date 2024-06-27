import { ChangeEvent, InputHTMLAttributes, forwardRef, useImperativeHandle } from 'react'
import styles from './SelectableInput.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    value: string
    placeholder: string
    setValue: (value: string) => void
    onFocus: () => void
}

export type SelectableInputHandle = {
    onAction: () => void
}

// eslint-disable-next-line react/display-name
const SelectableInput = forwardRef<SelectableInputHandle, Props>(({ value, placeholder, setValue, onFocus, className = '', ...props }, ref) => {
    // callable actions
    useImperativeHandle(ref, () => {
        return {
            onAction: () => {
                console.log('imperative handle ref action');
            }
        }
    }, [])

    const mainClass = `${styles.input} ${className}`

    const changeHandler = ((event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    })

    return (
        <div className={mainClass}>
            <input value={value} placeholder={placeholder} {...props} autoComplete='off' onFocus={onFocus} onChange={changeHandler} />
        </div>
    )
})

export default SelectableInput