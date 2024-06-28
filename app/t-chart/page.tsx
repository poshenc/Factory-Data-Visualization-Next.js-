"use client"

import { ChartData } from 'chart.js'
import { useContext, useEffect, useState } from 'react'
import { GetStepsTimeRangeParams } from '../api/events/steps/request-dto'
import { StepsTimeRange } from '../api/events/steps/response-dto'
import { GetEventTimeRangeParams } from '../api/events/time-range/request-dto'
import { GetTChartTracesParams } from '../api/traces/t-chart/request-dto'
import { fetchEventTimeRange, fetchStepsTimeRange } from '../ui/api/events/request'
import { fetchTChartTraces } from '../ui/api/traces/request'
import { WafersContext } from '../ui/context/WafersContext'
import ComboChart from './components/ComboChart'
import TChartInfo from './components/TChartInfo'
import TChartSpec from './components/TChartSpec'
import styles from './page.module.scss'

export interface TChartSpecType {
    items: string[]
    events: string[]
    alignStep: string
}

export default function Page() {
    const wafersContext = useContext(WafersContext)

    const [lineChartData, setLineChartData] = useState<ChartData<'line'>>({} as ChartData<'line'>)
    const [barChartData, setBarChartData] = useState<ChartData<'bar'>>({ datasets: [] } as ChartData<'bar'>)
    const [stepData, setStepData] = useState<StepsTimeRange[][]>([])
    const [tChartSpec, setTChartSpec] = useState<TChartSpecType>({
        items: wafersContext.data.items ?? [],
        events: [
            "doors install-1",
            "sensor install-1",
            "windows install-1",
            "sensor install-2"
        ],
        alignStep: 'Process'
    })

    // fetch Wafer Traces 
    useEffect(() => {
        async function fetchTwoChartData() {
            let chartData: ChartData<'line'> = {
                labels: [],
                datasets: []
            }

            const updatedLabels = [...wafersContext.data.labels]

            if (tChartSpec.items.length === 0) {
                return setLineChartData(chartData)
            }

            for (let index = 0; index < wafersContext.data.wafers.length; index++) {
                if (wafersContext.data.wafers[index].toolId) {
                    const wafer = wafersContext.data.wafers[index]

                    const params: GetTChartTracesParams = {
                        ...wafer,
                        slotNo: Number(wafer.slotNo),
                        items: tChartSpec.items,
                        alignStep: tChartSpec.alignStep === "Process" ? '' : tChartSpec.alignStep
                    }

                    const waferData = await fetchTChartTraces(params)

                    if (index === 0) {
                        chartData.labels = waferData.labels
                    } else if (waferData.labels.length > chartData.labels?.length!) {
                        chartData.labels = waferData.labels
                    }

                    updatedLabels[index] = waferData.labels

                    waferData.datasets.forEach(dataset => {
                        dataset.label = dataset.label + '-' + (index + 1)
                        chartData.datasets.push(dataset)
                    })
                }
            }

            wafersContext.setData(prev => ({
                ...prev,
                labels: updatedLabels,
                items: tChartSpec.items
            }))

            setLineChartData(chartData)
        }

        fetchTwoChartData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tChartSpec.items, tChartSpec.alignStep, wafersContext.data.wafers])

    // fetch Event Range Data
    useEffect(() => {
        async function fetchEventRangeData() {
            let ganntData: ChartData<'bar'> = {
                labels: [],
                datasets: []
            }

            if (tChartSpec.events.length === 0 || wafersContext.data.labels.length === 0) {
                return setBarChartData(ganntData)
            }

            for (const event of tChartSpec.events) {
                if (event.split('-')[1] === '1' && Object.keys(wafersContext.data.wafers[0]).length === 0) break
                if (event.split('-')[1] === '2' && Object.keys(wafersContext.data.wafers[1]).length === 0) break

                let eventParam: GetEventTimeRangeParams = {} as GetEventTimeRangeParams

                if (event.split('-')[1] === '1') {
                    eventParam = {
                        ...wafersContext.data.wafers[0],
                        slotNo: Number(wafersContext.data.wafers[0].slotNo),
                        event: event.split('-')[0]
                    }
                } else {
                    eventParam = {
                        ...wafersContext.data.wafers[1]!,
                        slotNo: Number(wafersContext.data.wafers[1]!.slotNo),
                        event: event.split('-')[0]
                    }
                }

                const eventTimeRange = await fetchEventTimeRange(eventParam)

                let result: any = {
                    label: `${eventTimeRange.label}-${event.split('-')[1]}`,
                    data: []
                }

                for (const eventItem of eventTimeRange.data) {
                    let indexedEvent: any = {
                        x: [],
                        y: ''
                    }

                    if (event.split('-')[1] === '1') {
                        indexedEvent.x[0] = wafersContext.data.labels[0]?.indexOf(eventItem.x[0])
                        indexedEvent.x[1] = wafersContext.data.labels[0]?.indexOf(eventItem.x[1])
                    } else {
                        indexedEvent.x[0] = wafersContext.data.labels[1]?.indexOf(eventItem.x[0])
                        indexedEvent.x[1] = wafersContext.data.labels[1]?.indexOf(eventItem.x[1])
                    }
                    indexedEvent.y = `${eventTimeRange.label}-${event.split('-')[1]}`

                    result.data.push(indexedEvent)
                }

                ganntData.datasets.push(result)
            }

            if (wafersContext.data.wafers[1]) {
                ganntData.labels = wafersContext.data.labels[0]?.length! > wafersContext.data.labels[1]?.length! ? wafersContext.data.labels[0] : wafersContext.data.labels[1]
            } else {
                ganntData.labels = wafersContext.data.labels[0]
            }

            ganntData.labels = ganntData.labels!.map((value, i) => i)

            setBarChartData(ganntData)
        }

        fetchEventRangeData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tChartSpec.events, tChartSpec.alignStep, wafersContext.data.labels])

    // fetch Wafer Steps Data
    useEffect(() => {
        async function fetchStepTimes() {
            let stepData: StepsTimeRange[][] = []

            for (const wafer of wafersContext.data.wafers) {
                const params: GetStepsTimeRangeParams = {
                    ...wafer,
                    slotNo: Number(wafer.slotNo)
                }
                const waferStepRange = await fetchStepsTimeRange(params)
                stepData.push(waferStepRange)
            }

            setStepData(stepData)
        }

        const removeEventsByWaferIndex = (index: number) => {
            setTChartSpec(prev => {
                return {
                    ...prev,
                    alignStep: '',
                    events: prev.events.filter(event => event.split('-')[1] !== (index + 1).toString())
                }
            })
        }

        if (wafersContext.data.wafers[0] && Object.keys(wafersContext.data.wafers[0]).length === 0) {
            removeEventsByWaferIndex(0)
        } else if (wafersContext.data.wafers[1] && Object.keys(wafersContext.data.wafers[1]).length === 0) {
            removeEventsByWaferIndex(1)
        }

        fetchStepTimes()
    }, [wafersContext.data.wafers])

    return (
        <>
            <div className="page-title">Process Chart</div>
            {/* <span className={styles.temp} onClick={handler}>insert</span> */}
            <div className={styles['content-wrapper']}>
                <TChartSpec spec={tChartSpec} setSpec={setTChartSpec}></TChartSpec>
                <div className={styles['right-content']}>
                    <div className={styles['info-block']}>
                        <TChartInfo index={0}></TChartInfo>
                        <div className={styles.vs}>vs</div>
                        <TChartInfo index={1}></TChartInfo>
                    </div>
                    <div className={styles.tChart}>
                        <ComboChart lineData={lineChartData} ganttData={barChartData} stepData={stepData}></ComboChart>
                    </div>
                </div>
            </div>
        </>
    )
}