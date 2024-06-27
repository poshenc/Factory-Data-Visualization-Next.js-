import { Checkbox, ListItemText, ThemeProvider } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '../SingleSelector/SingleSelector.module.scss';


import { useState } from 'react';
import muiTheme from '../../styles/mui-theme';

interface Props {
    label: string
    options: string[]
    onSelect(value: string[]): void
    defaultValue?: string[]
    isRequired?: boolean
    className?: string
    onBlured?(): void
    error?: string | boolean
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MultipleSelector = ({ label, options, onSelect, defaultValue = [], className, isRequired = false, onBlured, error }: Props) => {
    const [output, setOutput] = useState<string[]>(defaultValue);

    const changeHandler = (event: SelectChangeEvent<typeof output>) => {
        const value = event.target.value
        const arrayValue = typeof value === 'string' ? value.split(',') : value
        setOutput(arrayValue)
        onSelect(arrayValue)
    }

    const menuItems = options.map((value, index) => {
        return (
            <MenuItem key={index} value={value}>
                <Checkbox checked={output.indexOf(value) > -1} />
                <ListItemText primary={value} />
            </MenuItem>)
    })

    return (
        <div className={`mb-25000rem ${className}`}>
            <div className='section-title'>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <ThemeProvider theme={muiTheme}>
                <Select
                    multiple
                    value={output}
                    onChange={changeHandler}
                    onBlur={onBlured}
                    displayEmpty={true}
                    renderValue={(selected) => selected.length > 0 ? selected.join(',') : 'Multiple Select...'}
                    MenuProps={MenuProps}
                    data-testid={label}
                >
                    {menuItems}
                </Select>
            </ThemeProvider>
            <div className={styles['error-message']}>{error}</div>
        </div>
    )
}

export default MultipleSelector