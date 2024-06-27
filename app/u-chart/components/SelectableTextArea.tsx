import { WaferItem } from '@/app/ui/context/WafersContext';
import CloseIcon from '@mui/icons-material/Close';
import styles from './SelectableTextArea.module.scss';

const SelectableTextArea = ({
    wafer,
    index,
    onDelete
}: {
    wafer: WaferItem
    index: number
    onDelete: (index: number) => void
}) => {
    if (!wafer) {
        return <div></div>
    }

    const label = index === 0 ? `${styles['label']} ${styles['label-purple']}` : `${styles['label']} ${styles['label-green']}`

    return (
        <div className={styles.container}>
            <div className={label}>Stage {index + 1}</div>
            <button className={styles.button} onClick={() => onDelete(index)}>
                <CloseIcon fontSize='medium' sx={{ color: '#fff', '&:hover': { color: '#fa5252' } }} />
            </button>
        </div>
    )
}

export default SelectableTextArea