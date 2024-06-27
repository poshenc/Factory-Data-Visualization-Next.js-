import { DialogContext } from '@/app/ui/context/DialogContext';
import { WaferItem, WafersContext } from '@/app/ui/context/WafersContext';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useContext } from 'react';
import styles from './TChartInfo.module.scss';
import WaferForm from './WaferForm';

export interface WaferInfoProps {
    carrierId: string
    lotId: string
    moduleId: string
    slotNo: string
    toolId: string
    waferId: string
    recipeId: string
}

const TChartInfo = ({
    index
}: {
    index: number
}) => {
    const wafersContext = useContext(WafersContext)
    const info = wafersContext.data.wafers[index] ?? {
        carrierId: '',
        lotId: '',
        moduleId: '',
        slotNo: '',
        toolId: '',
        waferId: '',
        recipeId: '',
    } as WaferInfoProps

    const { carrierId, lotId, moduleId, slotNo, toolId, waferId, recipeId } = info

    const { openDialog, closeDialog } = useContext(DialogContext)

    const backgroundColor = index === 0 ? styles['yellow-bg'] : styles['gray-bg']

    const submitWaferHandler = (waferInfo: any) => {
        wafersContext.setData(prev => {
            let updatedWafers = [...prev.wafers]
            waferInfo.visibility = true
            updatedWafers[index] = waferInfo
            return {
                ...prev,
                wafers: updatedWafers
            }
        })
    }

    const editHandler = () => {
        openDialog(<WaferForm onSubmit={submitWaferHandler} onClose={closeDialog} previousWaferInfo={info}></WaferForm>)
    }

    const visibilityHandler = (state: boolean) => {
        if (!wafersContext.data.wafers[index]) return

        wafersContext.setData(prev => {
            let updatedWafers = [...prev.wafers]
            updatedWafers[index].visibility = state
            return {
                ...prev,
                wafers: updatedWafers
            }
        })
    }

    const deleteHandler = () => {
        wafersContext.setData(prev => {
            let updatedWafers = [...prev.wafers]
            updatedWafers[index] = {} as WaferItem
            return {
                ...prev,
                wafers: updatedWafers
            }
        })
    }

    if (!lotId) {
        return (
            <div className={`${styles.container} ${styles.new} ${backgroundColor} !shadow-md hover:bg-sky-50 transition-all duration-200`} onClick={editHandler}>
                <AddRoundedIcon sx={{ fontSize: '40px', color: 'rgb(168,162,158)' }}></AddRoundedIcon>
                <div>Add Wafer</div>
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${backgroundColor} !shadow-md`}>
            <div className={styles['info-row']}>
                <div><b>Tool:</b> {toolId}</div>
                <div><b>Model:</b> {moduleId}</div>
            </div>
            <div className={styles['info-row']}>
                <div><b>Part:</b> {lotId}</div>
                <div><b>Release No.:</b> {recipeId}</div>
                <div><b>FSD version:</b> {slotNo}</div>
            </div>
            <div className={styles['info-row']}>
                <div><b>AP version:</b> {waferId}</div>
                <div><b>Charger system:</b> {carrierId}</div>
            </div>
            <div className={styles['icons-container']}>
                {wafersContext.data.wafers[index]?.toolId &&
                    (wafersContext.data.wafers[index].visibility ?
                        <VisibilityIcon className={styles.icon} onClick={() => visibilityHandler(false)} /> :
                        <VisibilityOffIcon className={styles.icon} onClick={() => visibilityHandler(true)} />)
                }
                <EditIcon className={styles.icon} onClick={editHandler} />
                <ClearIcon className={styles.icon} onClick={deleteHandler} />
            </div>
        </div>
    )
}

export default TChartInfo