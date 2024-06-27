import { CategoryScale, Chart, ChartData, Chart as ChartJS, ChartOptions, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import ChartAnnotationsPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale, // x axis
    LinearScale, // Y axis
    PointElement,
    Legend,
    zoomPlugin,
    ChartAnnotationsPlugin,
    Tooltip
)

interface LineProps {
    data: ChartData<'line'>
    options?: ChartOptions<'line'>
    xAnnotationIndexLabel?: { [key: number]: string }
    yAnnotationValuesLabel?: { [key: number]: string }
    annotationMode?: 'drawX' | 'drawY' | 'delete' | 'default'
    onNodeClick?: (value: string) => void
}

export type LineChartHandle = {
    resetZoom: () => void
    zoom: () => void
}

const hoverVerticalLine = {
    id: 'hoverVerticalLine',
    beforeDatasetsDraw(chart: any) {
        const { ctx, tooltip, chartArea: { top, bottom }, scales: { x } } = chart
        if (tooltip._active.length > 0) {
            const xCoor = x.getPixelForValue(tooltip.dataPoints[0].parsed.x)
            ctx.save()
            ctx.lineWidth = 3
            ctx.setLineDash([6, 6])
            ctx.beginPath()
            ctx.moveTo(xCoor, top)
            ctx.lineTo(xCoor, bottom)
            ctx.stroke()
            ctx.closePath()
            ctx.setLineDash([])
        }
    }
}

const hoverHorizontalLine = {
    id: 'hoverHorizontalLine',
    beforeDatasetsDraw(chart: any) {
        const { ctx, tooltip, chartArea: { left, right }, scales: { x, y } } = chart
        if (tooltip._active.length > 0) {
            const yCoor = y.getPixelForValue(tooltip.dataPoints[0].parsed.y)
            ctx.save()
            ctx.lineWidth = 3
            ctx.setLineDash([6, 6])
            ctx.beginPath()
            ctx.moveTo(left, yCoor)
            ctx.lineTo(right, yCoor)
            ctx.stroke()
            ctx.closePath()
            ctx.setLineDash([])
        }
    }
}

// eslint-disable-next-line react/display-name
const LineChart = forwardRef<LineChartHandle, LineProps>(({ data, options, xAnnotationIndexLabel = {}, yAnnotationValuesLabel = {}, annotationMode = 'default', onNodeClick }, ref) => {    // ref to canvas element
    const chartRef = useRef<Chart<'line'> | null>(null)

    // annotations
    let annotations = getAnnotattions(xAnnotationIndexLabel, yAnnotationValuesLabel)
    annotationModeConfiguration(annotations, annotationMode)

    // callable actions
    useImperativeHandle(ref, () => {
        return {
            resetZoom: () => {
                chartRef.current!.resetZoom()
            },
            zoom: () => {
                chartRef.current!.options!.plugins!.zoom = {
                    zoom: {
                        drag: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                }
                chartRef.current!.update()
            }
        }
    }, [])

    // dynamic hover Line plugin
    useEffect(() => {
        console.log('switch mode');

        // remove zoom feature
        chartRef.current!.options!.plugins!.zoom = {}
        chartRef.current!.update()

        if (annotationMode === 'drawX') {
            chartRef.current!.config.plugins?.pop()
            chartRef.current!.config.plugins?.push(hoverVerticalLine)
            chartRef.current!.update()
        } else if (annotationMode === 'drawY') {
            chartRef.current!.config.plugins?.pop()
            chartRef.current!.config.plugins?.push(hoverHorizontalLine)
            chartRef.current!.update()
        } else {
            chartRef.current!.config.plugins?.pop()
            chartRef.current!.update()
        }
    }, [annotationMode])

    // config default data
    const defaultColors = ['#04203C', '#2596be']
    data.datasets.forEach((dataSet, i) => {
        dataSet.backgroundColor = dataSet.backgroundColor ?? defaultColors[i]
        dataSet.borderColor = dataSet.borderColor ?? defaultColors[i]
        dataSet.pointBorderColor = dataSet.pointBorderColor ?? defaultColors[i]
        dataSet.tension = dataSet.tension ?? 0.05
    })

    // options config
    options = options ?? {
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            // zoom: {
            //     zoom: {
            //         drag: {
            //             enabled: true
            //         },
            //         mode: 'xy',
            //     }
            // },
            annotation: {
                clip: false,
                annotations: annotations
            }
        },
        onClick: (event, elements, chart) => {
            if (elements[0] && onNodeClick) {
                const i = elements[0].index
                const xValue = chart.tooltip?.title[0]
                onNodeClick(xValue ?? '')
            }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true }
        },
        layout: {
            padding: {
                top: 40,
                right: 50
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }

    function annotationModeConfiguration(annotations: any[], annotationMode: 'drawX' | 'drawY' | 'delete' | 'default') {
        switch (annotationMode) {
            case 'drawX':
                annotations.forEach(annotation => {
                    annotation.enter = () => { }
                    annotation.leave = () => { }
                })
                break
            case 'drawY':
                annotations.forEach(annotation => {
                    annotation.enter = () => { }
                    annotation.leave = () => { }
                })
                break
            case 'delete':
                annotations.forEach(annotation => {
                    annotation.click = ({ chart, element }: any) => {
                        console.log('Remove');
                        console.log('axis: ', element.options.scaleID);
                        console.log('value: ', element.options.value);
                    }

                    annotation.enter = (context: any) => {
                        const id = context.element.options.id!
                        const annotations = (options!.plugins!.annotation!.annotations as any)
                        const index = annotations.findIndex((x: any) => x.id === id)
                        annotations[index].label.content = 'X'
                        annotations[index].label.backgroundColor = 'red'
                        annotations[index].borderColor = 'red'
                        context.chart.canvas.style.cursor = 'pointer'
                        context.chart.update()
                    }

                    annotation.leave = (context: any) => {
                        const id = context.element.options.id!
                        const annotations = (options!.plugins!.annotation!.annotations as any)
                        const index = annotations.findIndex((x: any) => x.id === id)
                        annotations[index].label.content = annotations[index].label.originalContent
                        if (annotations[index].scaleID === 'x') {
                            annotations[index].label.backgroundColor = '#e86c24'
                            annotations[index].borderColor = '#e86c24'
                        } else if (annotations[index].scaleID === 'y') {
                            annotations[index].label.backgroundColor = '#04203C'
                            annotations[index].borderColor = '#b8bccc'
                        }
                        context.chart.canvas.style.cursor = 'default'
                        context.chart.update()
                    }
                })
                break
            default:
                annotations.forEach(annotation => {
                    annotation.enter = () => { }
                    annotation.leave = () => { }
                })
                break
        }
    }

    return <Line ref={chartRef} data={data} options={options} plugins={[]}></Line>
})

function getAnnotattions(xAnnotationIndexLabel: { [key: number]: string }, yAnnotationValuesLabel: { [key: number]: string }) {
    let annotations: any[] = []

    for (const key in xAnnotationIndexLabel) {
        const annotation = {
            id: 'verticalLine' + key,
            type: 'line',
            scaleID: 'x',
            drawTime: 'beforeDatasetsDraw',
            borderDash: [6, 6],
            value: Number(key),
            borderColor: '#e86c24',
            borderWidth: 3,
            label: {
                backgroundColor: '#e86c24',
                content: xAnnotationIndexLabel[key],
                originalContent: xAnnotationIndexLabel[key],
                display: true,
                font: { weight: 'regular' },
                borderRadius: 4,
                position: 'start',
                yAdjust: -40
            }
        }
        annotations.push(annotation)
    }

    for (const key in yAnnotationValuesLabel) {
        const annotation = {
            id: 'horizontalLine' + key,
            type: 'line',
            drawTime: 'beforeDatasetsDraw',
            scaleID: 'y',
            value: Number(key),
            borderDash: [6, 6],
            borderColor: '#b8bccc',
            borderWidth: 3,
            label: {
                backgroundColor: '#04203C',
                content: yAnnotationValuesLabel[key],
                originalContent: yAnnotationValuesLabel[key],
                display: true,
                font: { weight: 'regular' },
                borderRadius: 4,
                position: 'end',
                xAdjust: 50
            }
        }
        annotations.push(annotation)
    }
    return annotations
}

export default LineChart