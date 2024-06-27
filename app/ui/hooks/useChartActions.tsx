import { useContext, useEffect, useState } from "react";
import Success from "../components/Dialogs/Success";
import { DialogContext } from "../context/DialogContext";

export function useChartActions({ current: chartRef }: any) {
    const [isChartHovered, setIsChartHovered] = useState(false)
    const [buttonsLeftPadding, setButtonsLeftPadding] = useState(0)
    const [buttonsTopPadding, setButtonsTopPadding] = useState(0)

    // react dialog context
    const { openDialog, closeDialog } = useContext(DialogContext)

    const resetZoom = () => {
        chartRef?.resetZoom()
    }

    useEffect(() => {
        function handleRightClick(event: Event) {
            const element = event.target as HTMLElement
            if (element.tagName === 'CANVAS') {
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                resetZoom()
            }
        }

        chartRef?.canvas.addEventListener('contextmenu', handleRightClick)
    }, [chartRef])

    const downloadChart = async () => {
        let url = ''
        const canvasFound = document.getElementsByTagName('canvas')

        if (canvasFound.length === 1) {
            url = chartRef?.canvas.toDataURL('image/jpg')
        } else {
            const url1 = canvasFound[0].toDataURL('image/jpg')
            const url2 = canvasFound[1].toDataURL('image/jpg')
            url = await combineImages(url1, url2)
        }

        const a: any = document.createElement('a')
        a.href = url
        a.download = 'ChartImage.jpg'
        a.click()
        setTimeout(() => {
            openDialog(<Success title='Success' message='Chart image has been downloaded.' onClose={closeDialog}></Success>)
        }, 250)
    }

    const combineImages = (url1: string, url2: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const chart1 = new Image()
            const chart2 = new Image()

            const loadPromise1 = new Promise(resolve => chart1.onload = resolve)
            const loadPromise2 = new Promise(resolve => chart2.onload = resolve)

            chart1.src = url1
            chart2.src = url2

            Promise.all([loadPromise1, loadPromise2]).then(() => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    reject(new Error('Could not get canvas context'))
                    return
                }

                canvas.width = Math.max(chart1.width, chart2.width)
                canvas.height = chart1.height + chart2.height

                ctx.drawImage(chart1, 0, 0)
                ctx.drawImage(chart2, 0, chart1.height)

                const combinedImage = canvas.toDataURL('image/jpg')

                resolve(combinedImage)
            }).catch(error => {
                reject(error)
            })
        })
    }

    const mouseMoveHandler = () => {
        setIsChartHovered(true)
        setButtonsLeftPadding(chartRef?.chartArea.right! - 65)
        setButtonsTopPadding(chartRef?.chartArea.top! + 5)
    }

    return {
        isChartHovered,
        buttonsLeftPadding,
        buttonsTopPadding,
        resetZoom,
        downloadChart,
        mouseMoveHandler,
        setIsChartHovered
    }
}

