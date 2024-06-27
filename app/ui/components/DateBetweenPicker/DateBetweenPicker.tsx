"use client"

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import styles from './DateBetweenPicker.module.scss';

const DateBetweenPicker = (
    {
        label,
        startTime = undefined,
        endTime = undefined,
        errorTimeLimit = false,
        setStartTime,
        setEndTime,
        setErrorTimeLimit,
        isRequired = false,
        className = ''
    }: {
        label: string
        startTime: Dayjs | undefined
        endTime: Dayjs | undefined
        errorTimeLimit?: boolean
        setStartTime: (time: Dayjs) => void
        setEndTime: (time: Dayjs) => void
        setErrorTimeLimit?: (value: boolean) => void
        isRequired?: boolean
        className?: string
    }) => {
    const [minDate, setMinDate] = useState<Dayjs | undefined>()

    function setLowerTimeHandler(time: Dayjs | null) {
        if (!time) return

        setMinDate(time)
        setStartTime(time)

        if (endTime && endTime < time && setErrorTimeLimit) {
            setErrorTimeLimit(true)
        } else if (endTime && time < endTime && setErrorTimeLimit) {
            setErrorTimeLimit(false)
        }
    }

    function setUpperTimeHandler(time: Dayjs | null) {
        if (!time) return

        setEndTime(time)

        if (startTime && time < startTime && setErrorTimeLimit) {
            setErrorTimeLimit(true)
        } else if (startTime && time > startTime && setErrorTimeLimit) {
            setErrorTimeLimit(false)
        }
    }

    return (
        <div className={`mb-10 ${className}`}>
            <label className={styles.label} htmlFor={label}>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </label>
            <div className={styles['input-container']}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={styles['date-picker']}>
                        <DateTimePicker
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            format='YYYY/MM/DD HH:mm:ss'
                            value={startTime}
                            onChange={(newValue) => setLowerTimeHandler(newValue)}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '11px 0 11px 14px'
                                    }
                                },
                            }}
                        />
                    </div>
                    <div className={styles['date-picker']}>
                        <DateTimePicker
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            format='YYYY/MM/DD HH:mm:ss'
                            minDateTime={minDate}
                            value={endTime}
                            onChange={(newValue) => setUpperTimeHandler(newValue)}
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '11px 0 11px 14px'
                                    }
                                },
                            }}
                        />
                    </div>
                </LocalizationProvider>
                {errorTimeLimit && <div className={styles['error-message']} > Invalid time range.</div >}
            </div >
        </div >
    )
}

export default DateBetweenPicker