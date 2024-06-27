import { MenuItem, Select, SelectChangeEvent, ThemeProvider } from "@mui/material";
import { useState } from "react";

import muiTheme from "../../styles/mui-theme";
import styles from './GroupSelector.module.scss';

interface Props {
    label: string
    options: any
    onSelect(value: string): void
    defaultValue?: string,
    className?: string
    isRequired?: boolean
    onBlured?(): void
    error?: string | boolean
}

const GroupSelector = ({ label, options, onSelect, defaultValue = '', className = '', isRequired = false, onBlured, error }: Props) => {
    const [value, setValue] = useState<string>(defaultValue)

    const onSelectChangeHandler = (event: SelectChangeEvent) => {
        setValue(event.target.value)
        onSelect(event.target.value)
    }

    const onBlur = () => {
        if (onBlured) {
            onBlured()
        }
    }
    const keys = Object.keys(options)

    const menuItems = keys.map((key: string) => {
        let header = <MenuItem disabled>{key}</MenuItem>
        let items = options[key].map((option: string, index: number) =>
            <MenuItem key={option + index} value={option}>{option}</MenuItem>)
        return [header, items]
    })

    return (
        <div className={`mb-25000rem ${className}`}>
            <div className='section-title'>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <ThemeProvider theme={muiTheme}>
                <Select value={value} onChange={onSelectChangeHandler} onBlur={onBlur} displayEmpty>
                    <MenuItem value="" disabled>Select...</MenuItem>
                    {menuItems}
                </Select>
            </ThemeProvider>
            <div className={styles['error-message']}>{error}</div>
        </div>
    )
}

export default GroupSelector