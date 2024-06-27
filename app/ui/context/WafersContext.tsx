"use client"

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react'

export interface WaferItem {
    slotNo: string
    carrierId: string
    lotId: string
    waferId: string
    toolId: string
    moduleId: string
    recipeId: string
    chartDataIndex?: number
    visibility?: boolean
}
export interface WaferProps {
    wafers: WaferItem[]
    labels: Date[][]
    items?: string[]
}

const SAMPLE_SELECTED: WaferProps = {
    "wafers": [
        {
            "chartDataIndex": 18,
            "slotNo": "1",
            "carrierId": "CHAdeMo",
            "lotId": "Air Filter",
            "waferId": "01",
            "toolId": "tesla_sensor",
            "moduleId": "model_3",
            "recipeId": "tesla_recipe.137",
            "visibility": true
        },
        {
            "chartDataIndex": 25,
            "slotNo": "8",
            "carrierId": "CHAdeMo",
            "lotId": "Air Filter",
            "waferId": "08",
            "toolId": "tesla_sensor",
            "moduleId": "model_3",
            "recipeId": "tesla_recipe.145",
            "visibility": true
        }
    ],
    "labels": [],
    "items": [
        "speed",
        "vibration",
        "altitude",
        "sound",
        "light"
    ]
}

interface Store {
    data: WaferProps;
    setData: Dispatch<SetStateAction<WaferProps>>;
    resetWafers: () => void;
    removeWaferHandler: (index: number) => void;
}

const WafersContext = createContext<Store>({} as Store)

const WafersProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<WaferProps>(SAMPLE_SELECTED)

    const removeWaferHandler = (index: number) => {
        setData((prev: WaferProps) => ({
            ...prev,
            wafers: prev.wafers.filter((wafer, i) => i !== index)
        }))
    }

    const resetWafers = () => {
        setData(prev => ({
            ...prev,
            wafers: []
        }))
    }

    const wafersContext = {
        data,
        setData,
        resetWafers,
        removeWaferHandler
    }

    return <WafersContext.Provider value={wafersContext}>
        {children}
    </WafersContext.Provider>
}

export { WafersContext, WafersProvider }

