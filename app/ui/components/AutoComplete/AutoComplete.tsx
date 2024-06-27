import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Checkbox, Chip, ThemeProvider } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import muiTheme from '../../styles/mui-theme';
import styles from '../SingleSelector/SingleSelector.module.scss';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Props {
    label: string
    options: string[]
    onSelect(value: string[]): void
    value: string[]
    isRequired?: boolean
    className?: string
    onBlured?(): void
    error?: string | boolean
}

const AutoComplete = ({ label, options, value, onSelect, className, isRequired = false, onBlured, error }: Props) => {
    return (
        <div className={`mb-25000rem ${className}`}>
            <div className='section-title'>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <ThemeProvider theme={muiTheme}>
                <Autocomplete
                    multiple
                    id="checkboxes"
                    limitTags={2}
                    options={options}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    getOptionDisabled={(options) => (value.length >= 5 && !value.includes(options)) ? true : false}
                    value={value}
                    onChange={(event: any, newValue: any) => onSelect(newValue)}
                    renderOption={(props, option, { selected, index }) => (
                        <li {...props} key={index} >
                            <Checkbox
                                key={index}
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    renderTags={(tagValue, getTagProps) => {
                        return tagValue.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} label={option} />
                        ))
                    }}
                    style={{ width: '100%' }}
                    renderInput={(params) => (<TextField {...params} placeholder="Search..." />)}
                />
            </ThemeProvider>
            <div className={styles['error-message']}>{error}</div>
        </div>
    )
}

export default AutoComplete