import SearchIcon from '@mui/icons-material/Search';
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Radio from "@mui/material/Radio/Radio";
import RadioGroup from "@mui/material/RadioGroup/RadioGroup";
import { ChangeEvent, useState } from "react";
import styles from './RadioCheckBox.module.scss';

interface Props {
    label: string
    options: string[]
    value: string
    setValue: (value: string) => void
    isRequired?: boolean
}

const RadioCheckBox = ({ label, options, value, setValue, isRequired = false }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>('')

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const filteredOptions = options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <div className={styles['search-container']}>
                <input id="searchInput" className={styles['search-input']} placeholder='Search...' value={searchTerm} onChange={handleSearchChange}></input>
                <label htmlFor="searchInput"><SearchIcon className={styles.icon} sx={{ fontSize: '34px' }} /></label>
            </div>
            <div className={styles['items-container']}>
                <RadioGroup value={value} onChange={handleChange}>
                    {filteredOptions.map(name => <FormControlLabel key={name} value={name} control={<Radio />} label={name} />)}
                </RadioGroup>
            </div>
        </div>
    )
}

export default RadioCheckBox