import Tab from '@mui/material/Tab';
import { useContext, useEffect, useState } from 'react';
import { AlarmContext } from '../../ui/context/TempAlarmContext';
import styles from './TabWithNotification.module.scss';

const TabWithNotification = ({
    value,
    ...otherProps
}: {
    label: string
    value: number
}) => {
    const [notificationCount, setNotificationCount] = useState<number>(0)
    const alarmContext = useContext(AlarmContext)

    useEffect(() => {
        let count = 0
        alarmContext.alarms.forEach((alarm: any) => {
            if (alarm.Rule_Id === value && !alarm.Has_Read) count++
        })
        setNotificationCount(count)
    }, [alarmContext.alarms])


    return (
        <div className={styles.wrapper}>
            {notificationCount > 0 && <span className={styles.count}>{notificationCount}</span>}
            <Tab
                {...otherProps}
                className={styles.tab}
                sx={{
                    '&.Mui-selected': {
                        fontFamily: "NotoSansTC-Bold",
                        color: '#04203C',
                    },
                    '&.Mui-focusVisible': {
                        backgroundColor: 'rgba(100, 95, 228, 0.32)',
                    },
                    textTransform: "none"
                }}
                disableRipple
                value={value}
            />
        </div>
    )
}

export default TabWithNotification