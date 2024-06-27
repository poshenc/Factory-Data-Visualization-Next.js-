import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useEffect } from 'react';
import styles from './ToggleSelector.module.scss';

interface Props {
    label: string
    options: string[]
    value: string
    setValue: (value: string) => void
    isRequired?: boolean
}

const ToggleSelector = ({ label, options, value, setValue, isRequired = false }: Props) => {
    useEffect(() => {
        if (options?.length === 0) {
            setValue('')
        } else if (value) {
            setValue(value)
        }
    }, [])

    const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string,) => {
        if (newValue !== null) {
            setValue(newValue)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </div>
            <div>
                <ToggleButtonGroup
                    value={value}
                    exclusive
                    onChange={handleChange}
                >
                    {options.map(name => {
                        return <ToggleButton
                            key={name}
                            value={name}
                            sx={{
                                textTransform: 'none',
                                fontFamily: 'NotoSansTC-Medium',
                                fontSize: '1rem',
                                paddingLeft: '1.5rem',
                                paddingRight: '1.5rem',
                                height: '3.0225rem',
                                border: '#04203c 0.125rem solid',
                                color: '#04203c',
                                '&.Mui-selected, &.Mui-selected:hover': {
                                    color: '#ffffff',
                                    backgroundColor: '#04203c'
                                }
                            }}
                        >{name}</ToggleButton>
                    })}
                </ToggleButtonGroup>
            </div>
        </div>
    )
}

export default ToggleSelector