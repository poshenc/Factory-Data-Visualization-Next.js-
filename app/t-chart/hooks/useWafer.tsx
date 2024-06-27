import { GetWaferExistsParams } from "@/app/api/wafers/check-wafer-exists/request-dto"
import { GetOtherOptionsListParams } from "@/app/api/wafers/get-other-options-list/request-dto"
import { WaferInfoProps } from "@/app/t-chart/components/TChartInfo"
import { useEffect, useState } from "react"
import { checkWaferDoesExists, fetchModuleAndToolList, fetchOtherParamsList } from "../../ui/api/wafers/request"

export interface optionsLists {
    carrierId: string[]
    lotId: string[]
    moduleId: string[]
    slotNo: string[]
    toolId: string[]
    waferId: string[]
    recipeId: string[]
}

export function useWafer(inputWaferInfo: WaferInfoProps) {

    const [waferInfo, setWaferInfo] = useState<WaferInfoProps>(inputWaferInfo)
    const [optionsLists, setOptionsLists] = useState<optionsLists>({} as optionsLists)

    useEffect(() => {
        fetchModuleAndToolList().then((list) => {
            setOptionsLists(prev => ({
                ...prev,
                ...list
            }))
        })
    }, [])

    useEffect(() => {
        const getOtherParamsList = async () => {
            const data: GetOtherOptionsListParams = {
                moduleId: waferInfo.moduleId,
                toolId: waferInfo.toolId

            }

            const result = await fetchOtherParamsList(data)

            setOptionsLists(prev => ({
                ...prev,
                ...result
            }))
        }

        if (waferInfo.moduleId && waferInfo.toolId) {
            getOtherParamsList()
        }

    }, [waferInfo.moduleId, waferInfo.toolId])

    const checkWaferExists = async () => {
        if (waferInfo.toolId && waferInfo.moduleId && waferInfo.carrierId && waferInfo.recipeId && waferInfo.lotId && waferInfo.slotNo && waferInfo.waferId) {
            const params: GetWaferExistsParams = {
                carrierId: waferInfo.carrierId,
                lotId: waferInfo.lotId,
                moduleId: waferInfo.moduleId,
                slotNo: waferInfo.slotNo,
                toolId: waferInfo.toolId,
                waferId: waferInfo.waferId,
                recipeId: waferInfo.recipeId
            }
            const data = await checkWaferDoesExists(params)
            return data
        } else {
            return false
        }
    }

    return {
        waferInfo,
        setWaferInfo,
        checkWaferExists,
        optionsLists
    }
}