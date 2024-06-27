import { StepsTimeRange } from "@/app/api/events/steps/response-dto";
import { ChartData } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import styles from './ComboChart.module.scss';
import LineChart from './LineChart';
import StackedGanttChart from "./StackedGanttChart";
import WaferTimeChart from "./WaferTimeChart";

export interface HoverEvent {
    x: number[]
    y: string
}

export interface ZoomEvent {
    min: number
    max: number
}

export interface LayoutPadding {
    left: number
    right: number
}

export interface WaferVisibilityState {
    [key: string]: boolean
}

const ComboChart = ({
    lineData,
    ganttData,
    stepData
}: {
    lineData: ChartData<'line'>
    ganttData: ChartData<'bar'>
    stepData: StepsTimeRange[][]
}) => {
    const [hoverEvent, setHoverEvent] = useState<HoverEvent>({
        x: [],
        y: ''
    })
    const [zoomEvent, setZoomEvent] = useState<ZoomEvent>({
        min: 0,
        max: 10000
    })
    const [layoutPadding, setLayoutPadding] = useState<LayoutPadding>({
        left: 34,
        right: 44
    })
    const [waferVisibility, setWaferVisibility] = useState<WaferVisibilityState>({
        wafer1: true,
        wafer2: true
    })

    useEffect(() => {
        if (lineData.datasets?.length === 0) {
            setWaferVisibility({
                wafer1: true,
                wafer2: true
            })
        }
    }, [lineData.datasets])


    const eventsData: HoverEvent[] = useMemo(() => {
        if (ganttData.labels?.length! > 0) {
            let result = [] as HoverEvent[]
            ganttData.datasets.forEach((data: any, index: number) => {
                data.data.forEach((eventItem: any) => {
                    const event: HoverEvent = {
                        x: eventItem.x ?? [],
                        y: index.toString()
                    }
                    result.push(event)
                })
            })
            return result
        }
        return []
    }, [ganttData])

    const filteredStepData = useMemo(() => {
        if (stepData.length <= 0) return []
        let filteredStepData: StepsTimeRange[][] = []

        stepData.forEach((step, index) => {
            if (Object.values(waferVisibility)[index]) {
                filteredStepData.push(step)
            } else {
                filteredStepData.push([])
            }
        })

        return filteredStepData
    }, [waferVisibility, stepData, lineData.datasets])

    if (!lineData.datasets || lineData.datasets.length < 1) {
        return <div className={styles.fallBack}>Select spec to show chart</div>
    }

    return (
        <>
            <div className={styles['items-chart']}>
                <WaferTimeChart waferVisibility={waferVisibility} setWaferVisibility={setWaferVisibility}></WaferTimeChart>
                <LineChart data={lineData} eventsData={eventsData} hoverEvent={hoverEvent} setZoomEvent={setZoomEvent} setLayoutPadding={setLayoutPadding} stepData={filteredStepData}></LineChart>
            </div>
            <div className={styles['events-chart']}>
                <StackedGanttChart data={ganttData} setHoverEvent={setHoverEvent} layoutPadding={layoutPadding} zoomEvent={zoomEvent}></StackedGanttChart>
            </div>
        </>
    )
}

export default ComboChart