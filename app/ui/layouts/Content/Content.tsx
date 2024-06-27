"use client"

import { useContext } from 'react';

import { SideBarContext } from '../../context/SideBarContext';
import styles from './Content.module.scss';

const Content = ({
    children
}: {
    children: React.ReactNode
}) => {
    const sideBarContext = useContext(SideBarContext)

    const mainContainerClass = sideBarContext.isOpen ? styles['main-content-layouts'] : `${styles['main-content-layouts']} ${styles['content-expanded']}`

    return (
        <div className={mainContainerClass}>
            {children}
        </div>
    )
}

export default Content