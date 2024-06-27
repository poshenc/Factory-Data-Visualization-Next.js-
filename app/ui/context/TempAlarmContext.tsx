"use client"

import { PropsWithChildren, createContext, useState } from "react"

const FAKE_DATA = [
    {
        "id": 1250,
        "Rule_Id": 61,
        "LotID": "F1-B2Degas Ti bolt",
        "RecipeID": "F1_TiN N5(30nm)_",
        "SlotNo": "2",
        "WaferID": "02",
        "CarrierID": "202311282",
        "Has_Read": false,
        "AlarmedItems": "DC1Power,DC1Voltage,DC1Current",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F1-1"
    }, {
        "id": 1251,
        "Rule_Id": 61,
        "LotID": "F1-B2Degas Ti bolt",
        "RecipeID": "F1_TiN N5(30nm)_",
        "SlotNo": "3",
        "WaferID": "03",
        "CarrierID": "202311282",
        "Has_Read": true,
        "AlarmedItems": "DC1Power,DC1Voltage",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F1-1"
    }, {
        "id": 1271,
        "Rule_Id": 62,
        "LotID": "EUNO-310",
        "RecipeID": "F2_EUNO-9",
        "SlotNo": "9",
        "WaferID": "09",
        "CarrierID": "111222333",
        "Has_Read": false,
        "AlarmedItems": "DC1Power,DC1Voltage,DC1Current",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F2-2"
    }, {
        "id": 1272,
        "Rule_Id": 62,
        "LotID": "EUNO-290",
        "RecipeID": "F2_EUNO-4",
        "SlotNo": "4",
        "WaferID": "04",
        "CarrierID": "111222333",
        "Has_Read": false,
        "AlarmedItems": "DC1Voltage,DC1Current",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F2-2"
    }, {
        "id": 1269,
        "Rule_Id": 62,
        "LotID": "EUNO-285",
        "RecipeID": "F2_EUNO-23",
        "SlotNo": "22",
        "WaferID": "22",
        "CarrierID": "111222333",
        "Has_Read": false,
        "AlarmedItems": "DC1Current",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F2-2"
    },
    {
        "id": 1270,
        "Rule_Id": 62,
        "LotID": "EUNO-300",
        "RecipeID": "F2_EUNO-19",
        "SlotNo": "3",
        "WaferID": "03",
        "CarrierID": "111222333",
        "Has_Read": true,
        "AlarmedItems": "DC1Power,DC1Voltage,DC1Current",
        "ToolID": 'ENTRON-EX-13-42',
        "ModuleID": "F2-2"
    }
]

interface Store {
    alarms: any
    setAlarms: any
}

const AlarmContext = createContext<Store>({} as Store)

const AlarmProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [alarms, setAlarms] = useState(FAKE_DATA)

    const alarmContext = {
        alarms,
        setAlarms
    }

    return <AlarmContext.Provider value={alarmContext}>
        {children}
    </AlarmContext.Provider>
}

export {
    AlarmContext,
    AlarmProvider
}

