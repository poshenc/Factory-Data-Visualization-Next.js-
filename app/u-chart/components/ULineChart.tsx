'use client'

import { WaferItem, WaferProps, WafersContext } from '@/app/ui/context/WafersContext';
import { useChartActions } from '@/app/ui/hooks/useChartActions';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import { CategoryScale, Chart, ChartData, Chart as ChartJS, Legend, LineElement, LinearScale, Point, PointElement, Tooltip } from 'chart.js';
import ChartAnnotationsPlugin from 'chartjs-plugin-annotation';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import styles from './ULineChart.module.scss';

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
}

const StyledButtonsContainer = styled.div<DivProps>`
position: absolute;
left: ${(props: DivProps) => props.$leftpx}px;
top: 35px;
`

ChartJS.register(
    LineElement,
    CategoryScale, // x axis
    LinearScale, // Y axis
    PointElement,
    Tooltip,
    Legend,
    ChartAnnotationsPlugin
)

const ULineChart = ({
    data,
    rawData,
    lower,
    upper,
}: {
    data: ChartData<'line'>;
    rawData?: any;
    lower: string;
    upper: string;
}) => {
    const chartRef = useRef<Chart<'line'> | null>(null)
    const wafersContext = useContext(WafersContext)
    const {
        isChartHovered,
        buttonsLeftPadding,
        resetZoom,
        downloadChart,
        mouseMoveHandler,
        setIsChartHovered
    } = useChartActions(chartRef)

    const [onResetZoom, setOnResetZoom] = useState(false)

    let annotations: any = useMemo(() => {
        let result: any = {}

        // annotation: upper and lower horizontal line
        if (chartRef.current && data.datasets && data.datasets.length > 0) {
            if (!isNaN(parseFloat(lower))) {
                result['horizontal-lower-line'] = getHorizontalLineAnnotation(parseFloat(lower))
            }

            if (!isNaN(parseFloat(upper))) {
                result['horizontal-upper-line'] = getHorizontalLineAnnotation(parseFloat(upper))
            }
        }

        // annotation: vertical mark label annotations
        if (chartRef.current && wafersContext.data.wafers.length > 0) {
            const colors = ['rgb(135 90 133)', 'rgb(101 183 145)']
            wafersContext.data.wafers.forEach((wafer, i) => {
                if (wafer.chartDataIndex === undefined) return
                const lineAnnotation = getMarkAnnotation(wafer.chartDataIndex, colors[i], i + 1)
                result['mark' + i] = lineAnnotation
            })
        }

        // annotation: background color box annotations
        if (data.datasets && data.datasets.length > 0) {
            const { colors } = data.datasets[0] as any
            const colorsArray = getColorRanges(colors)

            colorsArray.forEach(box => {
                const { startIndex, endIndex, color } = box

                if (startIndex === endIndex) {
                    const lineAnnotation = getLineBackgroundAnnotation(startIndex, color)
                    result['mark' + color] = lineAnnotation
                } else {
                    const backgroundAnnotation = getBoxBackgroundAnnotation(startIndex, endIndex, color)
                    result['background' + startIndex + color] = backgroundAnnotation
                }
            })
        }

        return result
    }, [data.datasets, lower, upper, wafersContext.data.wafers, onResetZoom, chartRef.current])


    // chart actions
    const onNodeClick = useCallback((data: any, chartDataIndex: number) => {
        const { lotid, carrierid, slotno, moduleid, recipeid, toolid, waferid } = data
        const newWafer = {
            chartDataIndex,
            slotNo: slotno,
            carrierId: carrierid,
            lotId: lotid,
            waferId: waferid,
            toolId: toolid,
            moduleId: moduleid,
            recipeId: recipeid,
            visibility: true
        }

        if (wafersContext.data.wafers.length >= 2) {
            wafersContext.setData((prev) => ({
                ...prev,
                wafers: [prev.wafers[1], newWafer],
            }))
        } else {
            wafersContext.setData((prev: WaferProps) => {
                const updatedWafers: WaferItem[] = [...prev.wafers]
                updatedWafers.push(newWafer)
                return {
                    ...prev,
                    wafers: updatedWafers,
                }
            })
        }
    }, [wafersContext])


    // options config
    let options: any = useMemo(() => ({
        plugins: {
            legend: {
                position: 'bottom'
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
                        if (chart.getZoomLevel() === 1) {
                            setOnResetZoom(prev => !prev)
                            return
                        }

                        const currentXMin = chart.scales.x.min
                        const currentXMax = chart.scales.x.max

                        Object.keys(annotations).forEach(name => {
                            const annotation = chart.config.options.plugins.annotation.annotations[name]

                            if (!annotation) return

                            if (annotation.type === 'box') {
                                annotation.backgroundColor =
                                    (annotation.xMax < currentXMin || annotation.xMin > currentXMax)
                                        ? 'transparent'
                                        : annotation.backgroundColor

                                annotation.xMin = Math.max(annotation.xMin, currentXMin)
                                annotation.xMax = Math.min(annotation.xMax, currentXMax)
                            } else if (annotation.type === 'line') {
                                annotation.borderColor =
                                    (annotation.xMax < currentXMin || annotation.xMin > currentXMax)
                                        ? 'transparent'
                                        : annotation.borderColor
                            }
                        })

                        chartRef.current!.update()
                    }
                }
            },
            tooltip: {
                callbacks: {
                    title: () => '',
                    footer: (event: any) => {
                        const index = event[0].dataIndex
                        if (rawData[index]) {
                            return `Tool: ${rawData[index].toolid}\n`
                                + `Model: ${rawData[index].moduleid}\n`
                                + `Part: ${rawData[index].lotid}\n`
                                + `Charger system: ${rawData[index].carrierid}\n`
                                + `FDS version: ${rawData[index].slotno}\n`
                                + `AP version: ${rawData[index].waferid}\n`
                                + `Release No.: ${rawData[index].recipeid}\n`
                                + `Time: ${new Date(rawData[index].time).toLocaleString('sv')}`
                        }
                    }
                }
            },
            annotation: {
                clip: false,
                annotations: annotations
            }
        },
        onClick: (event: any, elements: any) => {
            if (elements[0]) {
                const index = elements[0].index
                onNodeClick(rawData[index], index)
            }
        },
        scales: {
            small: {
                id: 'small',
                type: 'linear',
                position: 'left',
                // min: 0.0001,
                // max: 1,
                // ticks: {
                //     autoSkip: true,
                //     maxTicksLimit: 10,
                //     callback: function (value: number) {
                //         return toScientificNotation(value)
                //     },
                // }
            },
            large: {
                id: 'large',
                type: 'linear',
                position: 'right',
                grid: {
                    display: false
                }
            }
        },
        layout: {
            padding: {
                top: 30
            }
        },
        animation: false,
        responsive: true,
        maintainAspectRatio: false
    }), [annotations, onNodeClick, rawData])

    if (!data.datasets || data.datasets.length === 0) {
        return <div className={styles.fallBack}>Select spec to show chart</div>
    }

    // data set config
    const lineDefaultColors = ['#04203C', '#2596be', '#096631', '#a6176f', '#ba3f0f']
    data.datasets.forEach((dataSet, i) => {
        dataSet.yAxisID = isMaxBelowOne(dataSet.data) ? 'small' : 'large'
        dataSet.backgroundColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.borderColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.pointBorderColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.tension = 0.05
        dataSet.borderWidth = 1
    })

    return (
        <div className={styles.container} onMouseMove={mouseMoveHandler} onMouseOut={() => setIsChartHovered(false)}>
            {isChartHovered && <StyledButtonsContainer onMouseEnter={() => setIsChartHovered(true)} $leftpx={buttonsLeftPadding}>
                <CloseFullscreenIcon className={styles.download} onClick={resetZoom} />
                <DownloadIcon className={styles.download} onClick={downloadChart} />
            </StyledButtonsContainer>}
            <Line ref={chartRef} data={data} options={options} plugins={[zoomPlugin]} />
        </div>
    )
}

function getHorizontalLineAnnotation(yCoor: number): {} {
    let result: any = {
        type: 'line',
        yMin: yCoor,
        yMax: yCoor,
        borderColor: '#C4A484',
        borderWidth: 2,
        borderDash: [9, 4]
    }

    result.yScaleID = yCoor > 1 ? 'large' : 'small'
    return result
}


function getMarkAnnotation(xCoor: number, borderColor: string, stepIndex: number): {} {
    return {
        type: 'line',
        xMin: xCoor,
        xMax: xCoor,
        borderColor,
        borderWidth: 1.5,
        borderDash: [9, 4],
        label: {
            backgroundColor: borderColor,
            content: stepIndex,
            padding: 5,
            display: true,
            font: { weight: 'regular' },
            borderRadius: 4,
            position: 'end',
            yAdjust: -30
        }
    }
}

function getLineBackgroundAnnotation(xCoor: number, color: string): {} {
    return {
        type: 'line',
        drawTime: 'beforeDatasetsDraw',
        xMin: xCoor,
        xMax: xCoor,
        borderColor: color,
        borderWidth: 8
    }
}

function getBoxBackgroundAnnotation(xMin: number, xMax: number, color: string): {} {
    return {
        type: 'box',
        drawTime: 'beforeDatasetsDraw',
        xMin: xMin,
        xMax: xMax,
        backgroundColor: color,
        borderWidth: 0
    }
}

function getColorRanges(colorsArray: string[]): any[] {
    let result: any[] = []
    if (colorsArray.length === 0) return result

    let startIndex = 0
    let currentColor = colorsArray[0]

    for (let i = 1; i <= colorsArray.length; i++) {
        if (colorsArray[i] !== currentColor || i === colorsArray.length) {
            result.push({
                startIndex: startIndex,
                endIndex: i - 1,
                color: currentColor
            })

            startIndex = i

            if (i < colorsArray.length) {
                currentColor = colorsArray[i]
            }
        }
    }

    return result
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

export default ULineChart