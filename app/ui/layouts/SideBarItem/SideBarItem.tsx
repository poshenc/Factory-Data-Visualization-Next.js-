import { SvgIconProps } from '@mui/material';
import { ReactElement } from 'react';
// import { NavLink } from 'react-router-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SideBarItem.module.scss';

const SideBarItem = ({
    name,
    url,
    isOpen,
    icon,
    className,
    alertCount = 0,
}: {
    name: string
    url: string
    isOpen: boolean
    icon: ReactElement<SvgIconProps>
    className?: string
    alertCount?: number
}) => {
    const pathname = usePathname()

    const textClass = isOpen ? styles['text-expanded'] : `${styles['text-expanded']} ${styles['text-collapse']}`
    const linkClass = pathname === url ?
        `text-link ${styles['nav-active']} ${styles['outer-layer']} ${className}` :
        `text-link ${styles['outer-layer']} ${className}`

    const alertClass = isOpen ? `${styles['alert-count']} ${styles['alert-expanded']}` : styles['alert-count']

    return (
        <Link href={url} className={linkClass}>
            <div className={styles['navigate-container']}>
                {alertCount > 0 && <span className={alertClass}>
                    {alertCount < 100 ? alertCount : '99+'}
                </span>}
                {icon}
                <span className={textClass}>{name}</span>
            </div>
        </Link >
    )
}

export default SideBarItem