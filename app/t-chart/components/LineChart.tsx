import { StepsTimeRange } from "@/app/api/events/steps/response-dto";
import { WaferItem, WafersContext } from "@/app/ui/context/WafersContext";
import { useChartActions } from "@/app/ui/hooks/useChartActions";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import { CategoryScale, Chart, ChartData, Chart as ChartJS, Legend, LineElement, LinearScale, LogarithmicScale, Point, PointElement, Tooltip } from "chart.js";
import 'chartjs-adapter-moment';
import ChartAnnotationsPlugin from 'chartjs-plugin-annotation';
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import styled from 'styled-components';
import { HoverEvent, LayoutPadding, ZoomEvent } from "./ComboChart";
import styles from './LineChart.module.scss';

const unitLabel = {
    id: 'unitLabel',
    afterDraw: (chart: any, args: any, options: any) => {
        const { ctx, chartArea: { top, bottom, right, left, width, height }, scales: { x }, } = chart
        const labelXVerticalPosition = chart.scales.x.height / 3 * 2
        const labelXHorizontalPostion = chart.scales.small.width + (chart.scales.large.width / 3)
        ctx.save()
        const text = 'sec';
        const positionX = width;
        const positionY = bottom;
        ctx.fillStyle = '#666';
        ctx.fillText(text, positionX + labelXHorizontalPostion, positionY + labelXVerticalPosition);
        ctx.restore()
        return
    }
}

let zoomPlugin: any

if (typeof window !== 'undefined') {
    import('chartjs-plugin-zoom')
        .then((module) => {
            zoomPlugin = module.default
        })
        .catch(err => console.error(err))
}

interface DivProps {
    $leftpx?: number;
    $toppx?: number
}

const StyledButtonsContainer = styled.div<DivProps>`
position: absolute;
left: ${(props: DivProps) => props.$leftpx}px;
top: ${(props: DivProps) => props.$toppx}px; 
`

ChartJS.register(
    LineElement,
    CategoryScale, // x axis
    LinearScale, // right Y axis
    LogarithmicScale, // left Y axis
    PointElement,
    Tooltip,
    Legend,
    ChartAnnotationsPlugin
)

const LineChart = ({
    data,
    stepData,
    eventsData,
    hoverEvent,
    setZoomEvent,
    setLayoutPadding
}: {
    data: ChartData<'line'>
    stepData: StepsTimeRange[][]
    eventsData: HoverEvent[]
    hoverEvent: HoverEvent
    setZoomEvent: (event: ZoomEvent) => void
    setLayoutPadding: (event: LayoutPadding) => void
}) => {
    const wafersContext = useContext(WafersContext)
    const chartRef = useRef<Chart<'line'> | null>(null)

    const {
        isChartHovered,
        buttonsLeftPadding,
        buttonsTopPadding,
        resetZoom,
        downloadChart,
        mouseMoveHandler,
        setIsChartHovered
    } = useChartActions(chartRef)

    let annotations: any = useMemo(() => ({}), [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filterAnnotation = useCallback(() => {
        if (chartRef.current) {
            const xMin = chartRef.current ? chartRef.current.scales.x.min : 0
            const xMax = chartRef.current ? chartRef.current.scales.x.max : 10000

            let result: any = {}

            // annotation: events start and end vertical line
            if (chartRef.current && data.labels) {
                const ganttColors = ['#CFA47E', '#BED66F', '#94D6CD', '#D694A8', '#C2B6BD']
                eventsData.forEach((event, indexOfItem) => {
                    if (event.x[0] > xMin && event.x[0] < xMax) {
                        const lineAnnotation1 = getLineAnnotation(event.x[0], ganttColors[Number(event.y)])
                        result['line' + indexOfItem + 'start'] = lineAnnotation1
                    }
                    if (event.x[1] < xMax && event.x[1] > xMin) {
                        const lineAnnotation2 = getLineAnnotation(event.x[1], ganttColors[Number(event.y)])
                        result['line' + indexOfItem + 'end'] = lineAnnotation2
                    }
                })
            }

            // annotation: step flag and vertical line
            stepData.forEach((steps, waferIndex) => {
                steps.forEach((step: any) => {
                    const xIndex = wafersContext.data.labels[waferIndex]?.indexOf(step.time)
                    if (!xIndex || xIndex < xMin || xIndex > xMax) return
                    const lineAnnotation = getStepLineAnnotation(xIndex, waferIndex, step.recipestepno)
                    result['step' + step.recipestepno + 'wafer' + waferIndex] = lineAnnotation
                })
            })

            Object.keys(annotations).forEach(key => delete annotations[key])
            Object.keys(result).forEach(annotation => annotations[annotation] = result[annotation])
            chartRef.current!.update()
        }
    }, [stepData, eventsData])

    useEffect(() => {
        if (hoverEvent.x.length === 2 && chartRef.current && data.labels) {
            const transparentColors = ['rgb(207, 164, 126, 0.25)', 'rgb(190, 214, 111, 0.25)', 'rgb(148, 214, 205, 0.25)', 'rgb(214, 148, 168, 0.25)', 'rgb(194, 182, 189, 0.25)']
            const eventIndex = Number(hoverEvent.y)
            const { x, large } = chartRef.current?.scales
            const xMin = Math.max(hoverEvent.x[0], x.min)
            const xMax = Math.min(hoverEvent.x[1], x.max)
            const { min: yMin, max: yMax } = large
            const boxAnnotation = getBoxAnnotation(xMin, xMax, yMin, yMax, transparentColors[eventIndex])
            annotations.box1 = boxAnnotation
            chartRef.current.update()
        } else {
            annotations.box1 = null
            chartRef.current?.update()
        }
    }, [hoverEvent.y])

    useEffect(() => {
        chartRef.current?.resetZoom()
    }, [data, stepData, eventsData])

    // data set config
    const lineDefaultColors = ['#d0a515', '#2596be', '#096631', '#a6176f', '#ba3f0f', '#9f72ad', '#8c5d6a', '#647291', '#7f9164', '#ad7c40']
    data.datasets.forEach((dataSet, i) => {
        dataSet.yAxisID = isMaxBelowOne(dataSet.data) ? 'small' : 'large'
        dataSet.backgroundColor = dataSet.label?.slice(-1) == '1' ? lineDefaultColors[i] : '#adb5bd'
        dataSet.borderColor = dataSet.label?.slice(-1) == '1' ? lineDefaultColors[i] : '#adb5bd'
        dataSet.pointStyle = false
        dataSet.borderWidth = 1
    })

    useEffect(() => {
        if (!wafersContext.data.wafers.length) return;

        const updateVisibility = (wafer: WaferItem, indexSuffix: string) => {
            if (!wafer) return

            let indexArray: number[] = []
            chartRef.current?.data.datasets.forEach((dateset, index) => {
                if (dateset.label?.slice(-1) === indexSuffix) {
                    indexArray.push(index)
                }
            })

            if (wafer.visibility) {
                indexArray.forEach(index => chartRef.current?.show(index))
            } else {
                indexArray.forEach(index => chartRef.current?.hide(index))
            }
        }

        wafersContext.data.wafers.forEach((wafer, index) => {
            const indexSuffix = (index + 1).toString()
            updateVisibility(wafer, indexSuffix)
        })
    }, [wafersContext.data])

    // options config
    let lineOptions: any = useMemo(() => ({
        plugins: {
            legend: {
                position: 'bottom'
            },
            annotation: {
                drawTime: 'beforeDraw',
                clip: false,
                annotations: annotations
            },
            tooltip: {
                callbacks: {
                    title: (value: any) => value[0].dataIndex / 10 + ' seconds'
                }
            },
            zoom: {
                limits: {
                    x: {
                        minRange: 1
                    }
                },
                zoom: {
                    drag: {
                        enabled: true,
                        threshold: 15
                    },
                    mode: 'xy',
                    onZoomComplete: ({ chart }: any) => {
                        setZoomEvent({
                            min: chart.scales.x.min,
                            max: chart.scales.x.max
                        })
                        setLayoutPadding({
                            left: chart.scales.small.width,
                            right: chart.scales.large.width,
                        })
                        filterAnnotation()
                    }
                }
            }
        },
        scales: {
            small: {
                // type: 'logarithmic',
                type: 'linear',
                position: 'left',
                min: -1,
                max: 1,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                },
                grid: {
                    display: false
                }
            },
            large: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 1000
            },
            x: {
                type: 'category',
                ticks: {
                    maxTicksLimit: 30,
                    callback: (value: any) => chartRef.current?.isZoomedOrPanned() ? (100 * value) / 1000 : (value / 10).toFixed()
                }
            }
        },
        layout: {
            padding: {
                top: 54
            }
        },
        animation: false,
        responsive: true,
        maintainAspectRatio: false
    }), [annotations, eventsData, stepData])

    return (
        <div className={styles.container} onMouseMove={mouseMoveHandler} onMouseOut={() => setIsChartHovered(false)}>
            {isChartHovered && <StyledButtonsContainer onMouseEnter={() => setIsChartHovered(true)} $leftpx={buttonsLeftPadding} $toppx={buttonsTopPadding}>
                <CloseFullscreenIcon className={styles.download} onClick={resetZoom} />
                <DownloadIcon className={styles.download} onClick={downloadChart} />
            </StyledButtonsContainer>}
            <Line ref={chartRef} data={data} options={lineOptions} plugins={[zoomPlugin, unitLabel]} />
        </div>
    )
}

function getBoxAnnotation(xMin: number, xMax: number, yMin: number, yMax: number, backgroundColor: string): {} {
    return {
        type: 'box',
        xMin,
        xMax,
        yMin,
        yMax,
        backgroundColor,
        yScaleID: 'large',
        borderWidth: 0
    }
}

function getLineAnnotation(xCoor: number, borderColor: string): {} {
    return {
        type: 'line',
        xMin: xCoor,
        xMax: xCoor,
        borderColor,
        borderWidth: 1.5,
        borderDash: [9, 4]
    }
}

function getStepLineAnnotation(xCoor: number, waferIndex: number, stepIndex: number): {} {
    return {
        type: 'line',
        xMin: xCoor,
        xMax: xCoor,
        borderColor: waferIndex === 0 ? '#ead2b7' : '#ced4da',
        borderWidth: 1.5,
        borderDash: [9, 4],
        label: {
            color: '#525252',
            backgroundColor: waferIndex === 0 ? '#f0e4d7' : '#e9ecef',
            content: stepIndex,
            padding: 5,
            display: true,
            font: { weight: 'regular' },
            borderRadius: 4,
            position: 'end',
            yAdjust: waferIndex === 0 ? -59 : -32  // yAdjust: waferIndex === 1 ? -325 : -298
        }
    }
}

function calculateMax(arr: (number | Point | null)[]): number | null {
    const numbers: number[] = arr.filter(item => typeof item === 'number') as number[];

    if (numbers.length === 0) return null;

    // Find the maximum number in the array
    const maxNumber = Math.max(...numbers);
    return maxNumber;
}

function isMaxBelowOne(arr: (number | Point | null)[]): boolean {
    const maxNumber = calculateMax(arr);
    return maxNumber !== null && maxNumber < 1;
}

export default LineChart