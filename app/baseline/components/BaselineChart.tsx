'use client'

import { useChartActions } from '@/app/ui/hooks/useChartActions';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import { CategoryScale, Chart, ChartData, Chart as ChartJS, Legend, LineElement, LinearScale, Point, PointElement, Tooltip } from 'chart.js';
import ChartAnnotationsPlugin from 'chartjs-plugin-annotation';
import { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import styles from './BaselineChart.module.scss';
import { TagInfo } from './Tag';

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

// cutsom chart plugin
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

// dependencies hooks
const useChartOptions = (data: ChartData<'line'>, chartRef: any, nodeClick: any): any => useMemo(() => ({
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
                mode: 'xy'
            }
        },
        tooltip: {
            callbacks: {
                title: () => '',
                footer: (event: any) => {
                    const { dataset } = event[0]
                    return `Part: ${dataset.lotid}\n`
                        + `Charger system: ${dataset.carrierid}\n`
                        + `FSD version: ${dataset.slotno}\n`
                        + `AP version: ${dataset.waferid}\n`
                        + `Time: ${dataset.label}`
                }
            }
        }
    },
    onClick: (event: any, elements: any) => {
        if (elements[0]) {
            const { carrierid, label, lotid, slotno, waferid } = event.chart.tooltip.dataPoints[0].dataset

            const data: TagInfo = {
                time: label,
                value: event.chart.tooltip.dataPoints[0].formattedValue,
                lotId: lotid,
                carrierId: carrierid,
                slotId: slotno.toString(),
                waferId: waferid
            }

            nodeClick(data)
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
            top: 30
        }
    },
    animation: false,
    responsive: true,
    maintainAspectRatio: false
}), [data, nodeClick])

// data set config
const lineDefaultColors = [
    '#FF6A98', '#AFA100', '#FC61D5', '#00C1A3', '#7997FF', '#FF62BC', '#B59F00',
    '#FF6C91', '#1BB700', '#FF689F', '#CF9400', '#00C095', '#D89000', '#00BECA',
    '#EA8331', '#00BE6C', '#DC8D00', '#00B8E5', '#F8766D', '#9CA700', '#FA62DB',
    '#8DAB00', '#F763E0', '#00C0B1', '#E76BF3', '#4CB400', '#D675FE', '#00BB4E',
    '#D39200', '#FF61C9', '#A3A500', '#FF6C91', '#00ABFD', '#FF61C2', '#39B600',
    '#A18CFF', '#00C19C', '#9590FF', '#00BFC4', '#ED8141', '#00C0B8', '#C77CFF',
    '#00BDD0', '#BF80FF', '#00BCD6', '#AC88FF', '#00C0BE', '#F67963', '#00B0F6',
    '#FF65AE', '#00BA42', '#FF66A7', '#CA9700', '#00C1AA', '#F464E5', '#00B81F',
    '#B584FF', '#5BB300', '#EC69EF', '#00BC59', '#CF78FF', '#7CAE00', '#FE61CF',
    '#A9A300', '#E26EF7', '#00BF75', '#E38800', '#00BF7D', '#FF63B5', '#529EFF',
    '#FF6C91', '#679BFF', '#FF6C91', '#C59900', '#F066EA', '#C09B00', '#DC71FA',
    '#00BD63', '#8893FF', '#35A2FF', '#00A5FF', '#F37B59', '#00BBDB', '#E08B00',
    '#00BAE0', '#E7861B', '#00B6EA', '#F07E4D', '#00A8FF', '#00ADFA', '#00B2F3',
    '#00B4EF', '#00C08D', '#00C085', '#00B933', '#67B100', '#72B000', '#85AD00',
    '#95A900', '#BB9D00'
]

ChartJS.register(
    LineElement,
    CategoryScale, // x axis
    LinearScale, // Y axis
    PointElement,
    Tooltip,
    Legend,
    ChartAnnotationsPlugin
)

const BaselineChart = ({
    data,
    nodeClick
}: {
    data: ChartData<'line'>;
    nodeClick: (data: TagInfo) => void
}) => {
    const chartRef = useRef<Chart<'line'> | null>(null)

    const {
        isChartHovered,
        buttonsLeftPadding,
        resetZoom,
        downloadChart,
        mouseMoveHandler,
        setIsChartHovered
    } = useChartActions(chartRef)

    const options = useChartOptions(data, chartRef, nodeClick)

    if (!data.datasets || data.datasets.length === 0) {
        return <div className={styles.fallBack}>Select spec to show chart</div>
    }

    data.datasets.forEach((dataSet, i) => {
        dataSet.yAxisID = isMaxBelowOne(dataSet.data) ? 'small' : 'large'
        dataSet.backgroundColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.borderColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.pointBorderColor = dataSet.backgroundColor ?? lineDefaultColors[i]
        dataSet.pointStyle = false
        dataSet.tension = 0.05
        dataSet.borderWidth = 1
        dataSet.label = new Date(dataSet.label!).toLocaleString('sv')
    })

    return (
        <div className={styles.container} onMouseMove={mouseMoveHandler} onMouseOut={() => setIsChartHovered(false)}>
            {isChartHovered && <StyledButtonsContainer onMouseEnter={() => setIsChartHovered(true)} $leftpx={buttonsLeftPadding}>
                <CloseFullscreenIcon className={styles.download} onClick={resetZoom} />
                <DownloadIcon className={styles.download} onClick={downloadChart} />
            </StyledButtonsContainer>}
            <Line ref={chartRef} data={data} options={options} plugins={[zoomPlugin, unitLabel]} />
        </div>
    )
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

export default BaselineChart