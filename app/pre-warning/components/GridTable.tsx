import { getNotificationsByRuleId, readAllNotificationsByRuleId, readSingleNotification } from '@/app/be/services/notifications';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
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
    const [rows, setRows] = useState<any[]>([])

    const renderReadAllIcon = (ruleId: any) => {
        const readAllHandler = () => {
            setRows(prev => {
                const updatedArr = [...prev]
                updatedArr.forEach(data => data.Has_Read = true)
                return updatedArr
            })
            readAllNotificationsByRuleId(ruleId)
        }

        return (
            <div className={styles['read-all-wrapper']}>
                <div className={styles['read-all']} onClick={readAllHandler}>Read All</div>
            </div>
        )
    }

    const formatToMilliSeconds = (param: any) => {
        return param.value.toLocaleString('sv')
    }

    const columns: GridColDef[] = [
        { field: "readIcon", renderHeader: () => renderReadAllIcon(ruleId), renderCell: renderReadIcon, width: 110, sortable: false, disableColumnMenu: true },
        { field: 'Description', headerName: 'Description', width: 650, sortable: false, disableColumnMenu: true },
        { field: 'Occurrence', headerName: 'Occurrence Time', width: 250, valueFormatter: (param) => formatToMilliSeconds(param), sortable: false, disableColumnMenu: true },
    ]

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getNotificationsByRuleId(ruleId)
            setRows(data)
        }

        fetchNotifications()
        const interval = setInterval(fetchNotifications, 500)

        return () => clearInterval(interval)
    }, [ruleId])


    const handleRowClickEvent = (params: GridRowParams<any>) => {
        setRows(prev => {
            const index = prev.findIndex(data => data.id === params.row.id)
            const updatedArr = [...prev]
            updatedArr[index].Has_Read = true
            return updatedArr
        })
        readSingleNotification(params.row.id)
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