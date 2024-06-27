"use client"

import { forwardRef, useContext, useEffect, useMemo, useState } from 'react';

import CompareIcon from '@mui/icons-material/Compare';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Image from 'next/image';

import { SideBarContext } from '../../context/SideBarContext';
import { AlarmContext } from '../../context/TempAlarmContext';
import SideBarItem from '../SideBarItem/SideBarItem';
import styles from './SideBar.module.scss';
// import { getAllUnreadNotificationsCount } from '@/app/be/services/notifications';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

const StyledTreeItem = forwardRef((props: any, ref) => (
    <TreeItem
        className={styles.test}
        ref={ref}
        nodeId={props.nodeId}
        icon={props.icon}
        label={props.label}
        {...props}
    ></TreeItem>
));

// Adding displayName
StyledTreeItem.displayName = 'StyledTreeItem';

const SideBar = () => {
    const [noticationCount, setNotificationCount] = useState<number>(0)
    const sideBarContext = useContext(SideBarContext)
    const alarmContext = useContext(AlarmContext)
    const isOpen = sideBarContext.isOpen
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

    const sideBarClass = isOpen ? `${styles.sidebar} ${styles.open}` : `${styles.sidebar}`
    const toggleClass = isOpen ? `${styles.switches}` : `${styles.switches} ${styles.opposite}`

    let alarmCount = useMemo(() => {
        let count = 0
        alarmContext.alarms?.forEach((alarm: any) => {
            if (!alarm.Has_Read) count++
        })
        return count
    }, [alarmContext.alarms])

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         const count = await getAllUnreadNotificationsCount()
    //         setNotificationCount(count)
    //     }, 500)

    //     return () => clearInterval(interval)
    // }, [])

    const expandTreeItemHandler = () => {
        if (!sideBarContext.isOpen) sideBarContext.toggle()
        setExpandedNodes((oldExpanded) => oldExpanded.length === 0 ? ['comparison-charts'] : [])
    }

    useEffect(() => {
        if (!sideBarContext.isOpen) setExpandedNodes([])
    }, [sideBarContext.isOpen])

    const lableIcon =
        <div className={styles['tree-item']} >
            <EqualizerIcon sx={{ fontSize: '1.75rem' }} />
            {isOpen && <span>Comparison Charts</span>}
        </div>

    const classes = {
        focused: {
            bgcolor: "transparent",
        },
        selected: {
            bgcolor: 'transparent',
            color: "white"
        },
        hover: {
            bgcolor: 'transparent', // '#b0c4de'
            color: "white"
        }
    };

    return (
        <>
            <div className={sideBarClass}>
                <div className={styles['outer-layer']}>
                    <div className={toggleClass} >
                        <Image src="/Narrow.png"
                            width={20}
                            height={24}
                            alt="toggle" onClick={sideBarContext.toggle} />
                    </div>
                </div>

                <SideBarItem className='!mt-6' name={'Stage Chart'} url={"/u-chart"} icon={<AccountTreeIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} />
                <SideBarItem name={'Process Comparison'} url={"/t-chart"} icon={<CompareIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} />
                <SideBarItem name={'Item Analysis'} url={"/baseline"} icon={<StackedLineChartIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} />
                {/* <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={expandedNodes}
                    onNodeToggle={expandTreeItemHandler}
                    sx={{
                        ".MuiTreeItem-root": {
                            ".Mui-focused:not(.Mui-selected)": classes.focused,
                            ".Mui-selected, .Mui-focused.Mui-selected, .Mui-selected:hover": classes.focused,
                            ".Mui-selected": classes.selected,
                            ".Mui-selected:hover": classes.hover,
                            "& .MuiTreeItem-label": { paddingLeft: 0 },
                            "& .MuiTreeItem-content": { paddingLeft: '4px' }
                        },
                    }}
                >
                    <StyledTreeItem nodeId='comparison-charts' label={lableIcon} sx={{ ".MuiCollapse-root": { marginLeft: 0 } }}>
                        <SideBarItem className='!pl-14' name={'Process Comparison'} url={"/t-chart"} icon={<CompareIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} />
                        <SideBarItem className='!pl-14' name={'Cross Comparison'} url={"/baseline"} icon={<StackedLineChartIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} />
                    </StyledTreeItem>
                </TreeView> */}
                {/* <SideBarItem name={'Pre-Warning'} url={"/pre-warning"} alertCount={noticationCount} icon={<NotificationsIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} /> */}
                {/* <SideBarItem name={'Alarm'} url={"/alarm"} alertCount={alarmCount} icon={<NotificationImportantIcon sx={{ fontSize: '1.75rem', marginTop: '-0.1rem' }} />} isOpen={isOpen} /> */}


                {/* <span className={styles['version-text']}>0.0.1</span> */}
            </div>
        </>
    )
}

export default SideBar