"use client"

import Button from "@/app/ui/components/Button/Button"
import dayjs from "dayjs"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { WaferProps, WafersContext } from "../ui/context/WafersContext"
import { TimeRangeSpecProps } from "./components/ModuleSpec"
import SelectableTextArea from "./components/SelectableTextArea"
import UChartSpec, { UChartSpecType } from "./components/UChartSpec"
import ULineChart from "./components/ULineChart"
import { useUChartWafers } from "./hooks/useUChartWafers"
import styles from './page.module.scss'

const SAMPLE_SELECTED: UChartSpecType = {
    modules: [
        {
            toolId: "tesla_sensor",
            moduleId: "model_3",
            sdate: dayjs("2023-06-24T16:00:00.000Z"),
            edate: dayjs("2024-10-24T16:00:00.000Z"),
            recipeId: ""
        },
        {
            toolId: "tesla_sensor",
            moduleId: "model_Y",
            sdate: dayjs("2023-06-18T16:00:00.000Z"),
            edate: dayjs("2024-06-27T16:00:00.000Z"),
            recipeId: ""
        }
    ],
    timeRange: {} as TimeRangeSpecProps,
    lower: "",
    upper: "",
    items: [
        "speed",
        "vibration",
        "altitude",
        "sound",
        "light"
    ],
    statistics: "Range"
}


const UChart = () => {
    const wafersContext = useContext(WafersContext)

    const [uChartSpec, setUChartSpec] = useState<UChartSpecType>(SAMPLE_SELECTED)

    const {
        rawData,
        chartData,
        statusMessage,
    } = useUChartWafers(uChartSpec)

    useEffect(() => {
        setUChartSpec(prev => ({
            ...prev,
            lower: '',
            upper: ''
        }))
    }, [rawData])

    // useEffect(() => {
    //     wafersContext.resetWafers()
    // }, [uChartSpec.modules, uChartSpec.timeRange])

    useEffect(() => {
        wafersContext.setData((prev: WaferProps) => ({
            ...prev,
            items: uChartSpec.items
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uChartSpec.items])

    return (
        <>
            <div className={styles['title-section']}>
                <div className="page-title">Stage chart</div>
                <div className={styles['right-actions']}>
                    {wafersContext.data.wafers.length >= 2 ? 'Stage compare:' : 'Selected stage:'}
                    <SelectableTextArea wafer={wafersContext.data.wafers[0]} index={0} onDelete={wafersContext.removeWaferHandler}></SelectableTextArea>
                    {wafersContext.data.wafers.length >= 2 && <span className={styles.vs}>vs</span>}
                    <SelectableTextArea wafer={wafersContext.data.wafers[1]} index={1} onDelete={wafersContext.removeWaferHandler}></SelectableTextArea>
                    <Link href={'/t-chart'}>
                        <Button disabled={wafersContext.data.wafers.length < 1} className="me-0rem float-right">Next</Button>
                    </Link>
                </div>
            </div>
            <div className={styles.uChart}>
                <ULineChart data={chartData} rawData={rawData} upper={uChartSpec.upper} lower={uChartSpec.lower}></ULineChart>
            </div>
            <div className='relative'>
                <span className={styles.error}>{statusMessage}</span>
                <UChartSpec spec={uChartSpec} setSpec={setUChartSpec}></UChartSpec>
            </div>
        </>
    )
}

export default UChart