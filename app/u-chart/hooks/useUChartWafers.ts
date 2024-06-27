import { GetUChartWafersParams } from "@/app/api/wafers/u-chart/request-dto"
import { GetUChartTimeRangeWafersParams } from "@/app/api/wafers/u-chart/time-range/request-dto"
import { useQuery } from "@tanstack/react-query"
import { ChartData } from "chart.js"
import { useEffect, useMemo } from "react"
import { fetchTimeRangeWaferSummary, fetchWaferSummary } from "../../ui/api/wafers/request"
import { ModuleSpecProps } from "../components/ModuleSpec"
import { UChartSpecType } from "../components/UChartSpec"

const createPromise = (data: ModuleSpecProps, uChartSpec: UChartSpecType) => {
    return new Promise(async (resolve, reject) => {
        const { toolId, moduleId, sdate, edate, recipeId } = data
        try {
            if (toolId && moduleId && sdate?.isValid() && edate?.isValid()) {
                const { items, statistics } = uChartSpec

                const data: GetUChartWafersParams = {
                    toolId,
                    moduleId,
                    sdate: sdate.toString(),
                    edate: edate.toString(),
                    recipeId,
                    items: items.map(item => `${item}_${statistics.toLowerCase()}`)
                }
                const result = await fetchWaferSummary(data)
                resolve(result)
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateAllWaferSummary = async (uChartSpec: UChartSpecType): Promise<any[] | null> => {

    if (uChartSpec.modules.length > 0) {
        if (uChartSpec.modules.length === 0) return null
        const promiseArray = uChartSpec.modules.map((module) => createPromise(module, uChartSpec))
        return Promise.all(promiseArray)
    } else {
        return updateTimeRangeSummary(uChartSpec)
    }
}

const updateTimeRangeSummary = async (uChartSpec: UChartSpecType): Promise<any[] | null> => {
    if (!uChartSpec.timeRange.sdate || !uChartSpec.timeRange.edate) return null
    return new Promise(async (resolve, reject) => {
        try {
            const { toolId, sdate, edate } = uChartSpec.timeRange
            if (toolId && sdate?.isValid() && edate?.isValid()) {
                const { items, statistics } = uChartSpec

                const data: GetUChartTimeRangeWafersParams = {
                    toolId,
                    sdate: sdate.toString(),
                    edate: edate.toString(),
                    items: items.map(item => `${item}_${statistics.toLowerCase()}`)
                }
                const result = await fetchTimeRangeWaferSummary(data)
                resolve(result)
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }

    })
}

const tranformWaferSummaryToChartData = (allWaferSummaryData: any[] | null | undefined): ChartData<'line'> => {
    let firstValidDataset = allWaferSummaryData?.find(waferData => {
        return Array.isArray(waferData) && waferData.length > 0
    })

    if (!allWaferSummaryData || !firstValidDataset) {
        return {
            labels: [],
            datasets: []
        }
    }

    // Merges date-time label arrays from two wafer data sets
    const labels: string[] = []
    allWaferSummaryData.forEach((wafer) => {
        if (wafer) {
            const label = wafer.map((item: any) => new Date(item.time).toLocaleString('sv'))
            labels.push(...label)
        }
    })

    // Merges Y values from two wafer data sets
    const defaultColors = [
        'rgba(255, 237, 213, 0.7)', 'rgba(224, 242, 254, 0.7)', 'rgba(254, 249, 195, 0.7)',
        'rgba(209, 250, 229, 0.7)', "rgba(255, 232, 217, 0.7)", "rgba(217, 250, 212, 0.7)",
        "rgba(200, 249, 255, 0.7)", "rgba(255, 230, 255, 0.7)", "rgba(255, 236, 209, 0.7)",
        "rgba(205, 252, 220, 0.7)", "rgba(211, 246, 255, 0.7)", "rgba(255, 228, 255, 0.7)",
        "rgba(254, 240, 204, 0.7)", "rgba(197, 253, 231, 0.7)", "rgba(224, 242, 255, 0.7)",
        "rgba(255, 227, 250, 0.7)", "rgba(242, 243, 203, 0.7)", "rgba(192, 253, 242, 0.7)",
        "rgba(239, 237, 255, 0.7)", "rgba(255, 228, 239, 0.7)"
    ]
    const defaultKeys = ["time", "toolid", "moduleid", "recipeid", "lotid", "carrierid", "slotno", "waferid", "recipestepno"]

    const datasetItems = Object.keys(firstValidDataset[0]).filter((key: string) => !defaultKeys.includes(key))

    const datasets = datasetItems.map((item: string) => {
        const sets: any[] = []
        const colors: any[] = []

        allWaferSummaryData.forEach((wafer, index) => {
            if (wafer) {
                const set = wafer.map((dataItem: any) => dataItem[item])
                sets.push(...set)
                const adjustedIndex = index % defaultColors.length
                for (let i = 0; i < set.length; i++) {
                    colors.push(defaultColors[adjustedIndex])
                }
            }
        })

        return {
            label: item,
            data: sets,
            colors
        }
    })

    return {
        labels,
        datasets,
    }
}

export const useUChartWafers = (uChartSpec: UChartSpecType) => {

    const { data: allWaferSummaryData, refetch: fetchAllWaferSummary, isFetching, isError } = useQuery({
        queryKey: ['AllWafersSummary'],
        queryFn: () => updateAllWaferSummary(uChartSpec),
        enabled: false,
    })

    useEffect(() => {
        fetchAllWaferSummary()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uChartSpec.modules, uChartSpec.timeRange, uChartSpec.items, uChartSpec.statistics])

    const rawData = useMemo(() => {
        const filteredAllWaferSummaryData = allWaferSummaryData?.filter((el) => el) ?? []
        return filteredAllWaferSummaryData.flat(1)
    }, [allWaferSummaryData])

    const statusMessage = useMemo((): string => {
        if (isFetching || !allWaferSummaryData) return ''

        if (uChartSpec.modules.length > 0) {
            if (isError) return 'Something wrong.'

            const noDataTabs: number[] = []
            allWaferSummaryData.forEach((wafer, index) => {
                if (wafer?.length === 0) {
                    noDataTabs.push(index + 1)
                }
            })

            if (noDataTabs.length === 0) return ''
            if (uChartSpec.items.length === 0) return 'Please select at least an item.'
            return `No data found in Tab ${noDataTabs.join(', ')}.`
        } else if (uChartSpec.timeRange.edate?.isValid() && uChartSpec.timeRange.sdate?.isValid()) {
            if (uChartSpec.items.length === 0) return 'Please select at least an item.'
            if (allWaferSummaryData?.length === 0) return 'No data.'
        }
        return ''
    }, [isFetching, isError, uChartSpec, allWaferSummaryData])

    const chartData = useMemo(() => {
        return allWaferSummaryData ? tranformWaferSummaryToChartData(allWaferSummaryData) : {} as ChartData<'line'>
    }, [allWaferSummaryData])

    return {
        rawData,
        chartData,
        statusMessage,
    }
}
