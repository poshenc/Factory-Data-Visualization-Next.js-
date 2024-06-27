'use client'

import { WafersContext } from '@/app/ui/context/WafersContext';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode, useContext, useMemo } from 'react';
import { AlarmContext } from '../../ui/context/TempAlarmContext';
import styles from './GridTable.module.scss';

const renderReadIcon = (param: any) => {
    let content: ReactNode

    if (param.row.Has_Read) {
        content = <Image src={"/read.svg"} width={24} height={24} alt={'read'}></Image>
    } else {
        content = <Image src={"/unread.svg"} width={24} height={24} alt={'unread'}></Image>
    }

    return (
        <div className={styles['read-wrapper']}>
            {content}
        </div>
    )
}


export default function GridTable({
    ruleId
}: {
    ruleId: number
}) {
    const wafersContext = useContext(WafersContext)
    const alarmContext = useContext(AlarmContext)
    const router = useRouter()

    const renderReadAllIcon = (ruleId: any) => {
        const readAllHandler = () => {
            alarmContext.setAlarms((prev: any) => {
                const updatedArr = [...prev]
                updatedArr.forEach(data => {
                    if (data.Rule_Id === ruleId) {
                        data.Has_Read = true
                    }
                })
                return updatedArr
            })
        }

        return (
            <div className={styles['read-all-wrapper']}>
                <div className={styles['read-all']} onClick={readAllHandler}>Read All</div>
            </div>
        )
    }

    const columns: GridColDef[] = [
        { field: "readIcon", renderHeader: () => renderReadAllIcon(ruleId), renderCell: renderReadIcon, width: 110, sortable: false, disableColumnMenu: true },
        { field: 'LotID', headerName: 'LotID', width: 200, sortable: false, disableColumnMenu: true },
        { field: 'RecipeID', headerName: 'RecipeID', width: 200, sortable: false, disableColumnMenu: true },
        { field: 'SlotNo', headerName: 'SlotNo', width: 200, sortable: false, disableColumnMenu: true },
        { field: 'WaferID', headerName: 'WaferID', width: 200, sortable: false, disableColumnMenu: true },
        { field: 'CarrierID', headerName: 'CarrierID', width: 200, sortable: false, disableColumnMenu: true },
        { field: 'AlarmedItems', headerName: 'Alarmed items', width: 500, sortable: false, disableColumnMenu: true }
    ]

    const rows = useMemo(() => {
        return alarmContext.alarms.filter((alarm: any) => alarm.Rule_Id === ruleId)
    }, [alarmContext.alarms, ruleId])


    const handleRowClickEvent = (params: GridRowParams<any>) => {
        alarmContext.setAlarms((prev: any) => {
            const contextIndex = alarmContext.alarms.findIndex((data: any) => data.id === params.row.id)
            const updatedArr = [...prev]
            updatedArr[contextIndex].Has_Read = true
            return updatedArr
        })

        const { LotID, CarrierID, SlotNo, ModuleID, RecipeID, ToolID, WaferID, AlarmedItems } = params.row
        const newWafer = {
            slotNo: SlotNo,
            carrierId: CarrierID,
            lotId: LotID,
            waferId: WaferID,
            toolId: ToolID,
            moduleId: ModuleID,
            recipeId: RecipeID,
            visibility: true
        }

        wafersContext.setData((prev) => ({
            ...prev,
            wafers: [newWafer],
            items: AlarmedItems.split(',')
        }))

        router.push('/t-chart')

    }

    return (
        <Box sx={{
            height: 630,
            width: '100%',
            "& .MuiDataGrid-columnHeader": {
                fontSize: "1.25rem",
                fontFamily: "NotoSansTC-Bold"
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                outline: "none !important",
            },
            "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
            {
                outline: "none !important",
            },
            '& .MuiDataGrid-row:hover': {
                cursor: 'pointer'
            }
        }}>
            <DataGrid
                sx={{
                    ".unread": {
                        fontFamily: "NotoSansTC-Bold",
                        bgcolor: '#f2f6fc',
                        "&:hover": {
                            bgcolor: "#dfdce3",
                        },
                    },
                    ".read": {
                        bgcolor: '#ffffff',
                        fontFamily: "NotoSansTC-Regular",
                        "&:hover": {
                            bgcolor: "#dfdce3",
                        },
                    }
                }}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 50,
                        },
                    },
                }}
                pageSizeOptions={[50]}
                disableRowSelectionOnClick
                getRowClassName={(params) => {
                    return params.row.Has_Read ? 'read' : 'unread'
                }}
                onRowClick={handleRowClickEvent}
            />
        </Box>
    );
}