import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from 'react';
import muiTheme from '../../styles/mui-theme';
import styles from './SingleSelector.module.scss';

interface Props {
    label: string
    options: string[] | null | undefined
    value: string
    onSelect(value: string): void
    className?: string
    onBlured?(): void
    isRequired?: boolean
    error?: string | boolean
}

const SingleSelector = ({ label, options, onSelect, value, className = '', onBlured, isRequired = false, error }: Props) => {
    useEffect(() => {
        if (options && options.length > 0 && !options.includes(value) && value !== '') {
            onSelect('')
        }
    }, [options])

    const onSelectChangeHandler = (event: SelectChangeEvent) => {
        const value = event.target.value === 'clear' ? '' : event.target.value
        onSelect(value)
    }

    const isValueInOptions = options && options.length > 0 && (options.includes(value) || value === '')

    const menuItems = options?.map((value, index) => {
        return <MenuItem key={index} value={value}>{value}</MenuItem>
    })

    return (
        <div className={`mb-10 ${className}`}>
            <div className='section-title'>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <ThemeProvider theme={muiTheme}>
                {isValueInOptions ? (
                    <Select data-testid={label} onChange={onSelectChangeHandler} onBlur={onBlured} value={value} sx={{ backgroundColor: '#fff' }} displayEmpty disabled={!options}>
                        {<MenuItem value="" disabled>Select...</MenuItem>}
                        {(!isRequired && value) && <MenuItem key='clear' value='clear' className={styles.clear}>Clear selection</MenuItem>}
                        {menuItems}
                    </Select>) : (
                    <Select value='' disabled />
                )}
            </ThemeProvider>
            <div className={styles['error-message']}>{error}</div>
        </div >
    )
}

export default SingleSelector