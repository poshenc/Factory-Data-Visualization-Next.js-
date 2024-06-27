import { getNotificationCountByRuleId } from '@/app/be/services/notifications';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';
import styles from './TabWithNotification.module.scss';

const TabWithNotification = ({
    value,
    ...otherProps
}: {
    label: string
    value: number
}) => {
    const [notificationCount, setNotificationCount] = useState<number>(0)

    useEffect(() => {
        const fetchCount = async () => {
            const count = await getNotificationCountByRuleId(value)
            setNotificationCount(count)
        }

        fetchCount()
        const interval = setInterval(fetchCount, 500)

        return () => clearInterval(interval)
    }, [value])


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