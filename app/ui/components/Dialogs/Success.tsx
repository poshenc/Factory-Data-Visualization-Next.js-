import Image from 'next/image'
import successIcon from '../../assets/img/Success.png'
import Button from '../Button/Button'
import styles from './Dialogs.module.scss'

interface Props {
    title: string
    message: string
    onClose: () => void
}

const Success = ({ title, message, onClose }: Props) => {
    return (
        <div className='p-20000rem'>
            <div className={styles['popup-header']}>
                <Image src={successIcon} alt="success" />
                <div className="page-title mb-18750rem mt-18750rem">{title}</div>
            </div>
            <div className={styles['message']}>{message}</div>
            <div className={styles['button-container']}>
                <Button className='me-0rem' onClick={onClose}>Close</Button>
            </div>
        </div>
    )
}

export default Success