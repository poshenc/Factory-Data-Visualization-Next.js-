import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './CheckBoxList.module.scss';

interface Props {
    label: string
    items: { [key: string]: boolean }
    setItems: (value: { [key: string]: boolean }) => void
    limitAmount?: number
    isRequired?: boolean
}

const CheckBoxList = ({ label, items, setItems, limitAmount = -1, isRequired = false }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isReachLimit, setIsReachLimit] = useState<boolean>(false)

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setItems({
            ...items,
            [event.target.name]: event.target.checked,
        });
    };

    const filteredItems = Object.keys(items)
        .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((obj: any, key: any) => {
            obj[key] = items[key];
            return obj;
        }, {});


    useEffect(() => {
        if (Object.values(items).filter((element) => element).length >= limitAmount) {
            setIsReachLimit(true)
        } else {
            setIsReachLimit(false)
        }
    }, [items])

    const error = Object.keys(items).filter((name: string) => items[name]).length > limitAmount && limitAmount > 0

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
                {Object.keys(filteredItems).map(name =>
                    <div key={name}>
                        <Checkbox checked={items[name]} onChange={handleChange} name={name} disabled={!items[name] && isReachLimit} />
                        <span>{name}</span>
                    </div>
                )}
            </div>
            {error && <div className={styles['error-message']}>Max items amount is {limitAmount}.</div>}
        </div>
    )
}

export default CheckBoxList