import Button from "../Button/Button"
import styles from './Dialogs.module.scss'

interface Props {
    title: string
    message: string
    onClose: () => void
    onConfirm: () => void
}

const Confirmation = ({ title, message, onClose, onConfirm }: Props) => {
    return (
        <div className='p-20000rem'>
            <div className={styles['popup-header']}>
                {/* <img className="w-20000rem" src={successIcon} alt="success" /> */}
                <div className="page-title mb-18750rem mt-18750rem">{title}</div>
            </div>
            <div className={styles['message']}>{message}</div>
            <div className={styles['button-container']}>
                <Button onClick={onClose}>Cancel</Button>
                <Button className='me-0rem' onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    )
}

export default Confirmation