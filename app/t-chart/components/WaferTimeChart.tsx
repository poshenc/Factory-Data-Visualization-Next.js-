import { WafersContext } from '@/app/ui/context/WafersContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useContext } from 'react';
import { WaferVisibilityState } from './ComboChart';
import styles from './WaferTimeChart.module.scss';

const WaferTimeChart = ({
    waferVisibility,
    setWaferVisibility
}: {
    waferVisibility: WaferVisibilityState
    setWaferVisibility: (visibleWafers: WaferVisibilityState) => void
}) => {
    const wafersContext = useContext(WafersContext)

    const iconSx = { fontSize: '0.9rem', marginRight: '0.15rem', paddingBottom: '2px' }

    const toggleVisibility = (tagIndex: string) => {

        const updatedVisibility = {
            ...waferVisibility,
            [tagIndex]: !waferVisibility[tagIndex]
        }
        setWaferVisibility(updatedVisibility)
    }

    return (
        <div className={styles['wafer-time-chart-container']}>
            {wafersContext.data.wafers[0]?.lotId && <div className={`${styles.tag1} ${styles.tag}`} onClick={() => toggleVisibility('wafer1')}>
                {waferVisibility.wafer1 ? <VisibilityIcon sx={iconSx} /> : <VisibilityOffIcon sx={iconSx} />}
                W1
            </div>}
            {wafersContext.data.wafers[1]?.lotId && <div className={`${styles.tag2} ${styles.tag}`} onClick={() => toggleVisibility('wafer2')}>
                {waferVisibility.wafer2 ? <VisibilityIcon sx={iconSx} /> : <VisibilityOffIcon sx={iconSx} />}
                W2
            </div>}
        </div>
    )
}

export default WaferTimeChart