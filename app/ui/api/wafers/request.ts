import { GetBaselineWafersParams } from "@/app/api/wafers/baseline/request-dto";
import { GetWaferExistsParams } from "@/app/api/wafers/check-wafer-exists/request-dto";
import { GetOtherOptionsListParams } from "@/app/api/wafers/get-other-options-list/request-dto";
import { OtherOptionsList } from "@/app/api/wafers/get-other-options-list/response-dto";
import { ToolAndModuleList } from "@/app/api/wafers/get-tool-and-module-list/response-dto";
import { GetWafersRecipeListParams } from "@/app/api/wafers/recipe-id-list/request-dto";
import { GetUChartWafersParams } from "@/app/api/wafers/u-chart/request-dto";
import { GetUChartTimeRangeWafersParams } from "@/app/api/wafers/u-chart/time-range/request-dto";
import axios from "axios";
import { ChartData } from "chart.js";

export const fetchWaferSummary = async (waferSummary: GetUChartWafersParams): Promise<any[]> => {
    const { data } = await axios.get<any[]>('api/wafers/u-chart', {
        params: waferSummary
    })
    return data
}

export const fetchTimeRangeWaferSummary = async (waferSummary: GetUChartTimeRangeWafersParams): Promise<any[]> => {
    const { data } = await axios.get<any[]>('api/wafers/u-chart/time-range', {
        params: waferSummary
    })
    return data
}

export const fetchWaferRecipeList = async (params: GetWafersRecipeListParams): Promise<any[]> => {
    const { data } = await axios.get<string[]>('api/wafers/recipe-id-list', { params })
    return data
}


export const fetchBaselineWaferData = async (params: GetBaselineWafersParams): Promise<ChartData<'line'>> => {
    const { data } = await axios.get<ChartData<'line'>>('api/wafers/baseline', { params })
    return data
}

export const checkWaferDoesExists = async (params: GetWaferExistsParams) => {
    const { data } = await axios.post<boolean>('api/wafers/check-wafer-exists', params)
    return data
}

export const fetchOtherParamsList = async (params: GetOtherOptionsListParams) => {
    const { data } = await axios.get<OtherOptionsList>('api/wafers/get-other-options-list', { params })
    return data
}

export const fetchModuleAndToolList = async () => {
    const { data } = await axios.get<ToolAndModuleList>('api/wafers/get-tool-and-module-list')
    return data
}
