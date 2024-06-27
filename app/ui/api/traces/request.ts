import { GetTChartTracesParams } from "@/app/api/traces/t-chart/request-dto"
import { TChartTraces } from "@/app/api/traces/t-chart/response-dto"
import axios from "axios"

export const fetchTChartTraces = async (params: GetTChartTracesParams) => {
    const { data } = await axios.get<TChartTraces>('api/traces/t-chart', { params })
    return data
}

export const fetchTraceColumnNames = async () => {
    const { data } = await axios.get<string[]>('api/traces/column-names')
    return data
}