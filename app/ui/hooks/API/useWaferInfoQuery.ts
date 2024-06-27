import { GetUChartWafersParams } from "@/app/api/wafers/u-chart/request-dto"
import { useQuery } from "@tanstack/react-query"
import { fetchWaferSummary } from "../../api/wafers/request"

export const useGetWafersQuery = (params: GetUChartWafersParams) => {
    return useQuery({
        queryKey: ['Wafers'],
        queryFn: () => fetchWaferSummary(params),
        enabled: false,
    })
}