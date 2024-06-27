"use client"

import { useEffect, useState } from "react"
import { getExecutorState, startPreWarningExecutor, stopPreWarningExecutor } from "../be/services/pre-warning/executor"
import GridInTabs from "./components/GridInTabs"
import styles from './page.module.scss'

const PreWarning = () => {
    const [executorState, setExecutorState] = useState<boolean>(false)

    useEffect(() => {
        const fetchState = async () => {
            try {
                const state = await getExecutorState()
                setExecutorState(state)
            } catch (e) {
                console.log(e)
            }
        }

        fetchState()
        const interval = setInterval(fetchState, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="page-title">Pre-Warning</div>
            <div className={styles['executor-container']}>
                <div className={executorState ? styles.running : styles.stopped}>
                    {executorState ? 'Monitoring' : 'Paused'}
                </div>
                <button onClick={e => startPreWarningExecutor()}>Start</button>
                <button onClick={e => stopPreWarningExecutor()}>Stop</button>
            </div>
            {/* <div className={styles['monitor-container']}>
                <MonitorChart></MonitorChart>
                <MonitorChart></MonitorChart>
                <MonitorChart></MonitorChart>
                <MonitorChart></MonitorChart>
            </div> */}
            <GridInTabs></GridInTabs>
        </>
    )
}

export default PreWarning