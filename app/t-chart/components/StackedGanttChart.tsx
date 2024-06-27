import { WaferItem, WafersContext } from "@/app/ui/context/WafersContext"
import { BarElement, CategoryScale, ChartData, Chart as ChartJS, Legend, LinearScale, PointElement, Tooltip } from "chart.js"
import { useContext, useEffect, useRef, useState } from "react"
import { Bar } from "react-chartjs-2"
import { HoverEvent, LayoutPadding, ZoomEvent } from "./ComboChart"

const hoverVerticalLine = {
    id: 'hoverVerticalLine',
    afterDatasetsDraw(chart: any) {
        if (chart._active.length > 0) {
            const { ctx, _active, chartArea: { top, bottom }, scales: { x } } = chart

            const defaultColors = ['#CFA47E', '#BED66F', '#94D6CD', '#D694A8', '#C2B6BD']
            const xCoorStart = x.getPixelForValue(_active[0].element.$context.parsed._custom.start)
            const xCoorEnd = x.getPixelForValue(_active[0].element.$context.parsed._custom.end)
            const xMin = x.getPixelForValue(x.min)
            const xMax = x.getPixelForValue(x.max)

            if (xCoorStart < xMin || xCoorEnd < xMin || xCoorStart > xMax || xCoorEnd > xMax) return

            ctx.save()
            ctx.lineWidth = 1.5
            ctx.strokeStyle = defaultColors[_active[0].datasetIndex]
            ctx.setLineDash([9, 4])
            // start line
            ctx.beginPath()
            ctx.moveTo(xCoorStart, top)
            ctx.lineTo(xCoorStart, bottom)
            ctx.stroke()
            ctx.closePath()
            // end line
            ctx.beginPath()
            ctx.moveTo(xCoorEnd, top)
            ctx.lineTo(xCoorEnd, bottom)
            ctx.stroke()
            ctx.closePath()
            ctx.setLineDash([])
        }
    }
}

ChartJS.register(
    BarElement,
    PointElement,
    CategoryScale,// X axis
    LinearScale, // Y axis
    Legend,
    Tooltip
)

const StackedGanttChart = ({
    data,
    setHoverEvent,
    zoomEvent,
    layoutPadding
}: {
    data: ChartData<'bar'>
    setHoverEvent: (event: HoverEvent) => void
    zoomEvent: ZoomEvent
    layoutPadding: LayoutPadding
}) => {
    const wafersContext = useContext(WafersContext)
    const chartRef = useRef<any>(null)
    const [isHover, setIsHover] = useState(false)

    useEffect(() => {
        if (!wafersContext.data.wafers.length) return;

        const updateVisibility = (wafer: WaferItem, indexSuffix: string) => {
            if (!wafer) return

            let indexArray: number[] = []
            chartRef.current?.data.datasets.forEach((dateset: any, index: number) => {
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
    }, [data.datasets, wafersContext.data.wafers])

    // data set config
    const ganttColors = ['#CFA47E', '#BED66F', '#94D6CD', '#D694A8', '#C2B6BD']
    let updatedGanntData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    }
    if (data.datasets?.length > 0 && chartRef.current) {
        const newDatasets = data.datasets.map((dataset: any, index: number) => ({
            ...dataset,
            backgroundColor: ganttColors[index],
            borderRadius: 20,
            borderSkipped: false
        }))
        updatedGanntData = {
            ...data,
            datasets: newDatasets
        }
    }

    let barOptions: any = {
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function () {
                        return ''
                    }
                }
            }
        },
        onHover: function (event: any, context: any) {
            if (context.length === 1) {
                setIsHover(true)
                if (!isHover) {
                    const { datasetIndex, index } = context[0]

                    const result = data.datasets[datasetIndex].data[index] as any

                    const event: HoverEvent = {
                        x: result.x ?? [],
                        y: datasetIndex.toString() ?? ''
                    }
                    setHoverEvent(event)
                }
            } else if (context.length === 0) {
                setIsHover(false)
                if (isHover) {
                    const event: HoverEvent = {
                        x: [],
                        y: ''
                    }
                    setHoverEvent(event)
                }
            }

        },
        layout: {
            padding: {
                left: layoutPadding.left,
                right: layoutPadding.right
            }
        },
        indexAxis: 'y',
        barThickness: 13,
        scales: {
            y: {
                min: '',
                stacked: true,
                display: false
            },
            x: {
                type: 'category',
                min: zoomEvent.min,
                max: zoomEvent.max,
                ticks: {
                    maxTicksLimit: 30,
                    callback: (value: any) => {
                        let xCount = 0
                        data.labels?.forEach(value => {
                            if (typeof value === 'number') {
                                xCount++
                            }
                        })

                        if (zoomEvent.min === 0 && xCount === zoomEvent.max + 1) {
                            return ((100 * value) / 1000).toFixed()
                        } else {
                            return (100 * value) / 1000
                        }
                    }
                }
            },
        },
        animation: false,
        responsive: true,
        maintainAspectRatio: false
    }

    return <Bar ref={chartRef} data={updatedGanntData} options={barOptions} plugins={[hoverVerticalLine]}></Bar>
}


export default StackedGanttChart