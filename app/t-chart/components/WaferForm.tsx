import Button from "@/app/ui/components/Button/Button"
import SingleSelector from "@/app/ui/components/SingleSelector/SingleSelector"
import { useState } from "react"
import { useWafer } from "../hooks/useWafer"
import { WaferInfoProps } from "./TChartInfo"
import styles from './WaferForm.module.scss'

const WaferForm = ({
    previousWaferInfo,
    onSubmit,
    onClose
}: {
    previousWaferInfo: WaferInfoProps
    onSubmit: (waferInfo: WaferInfoProps) => void,
    onClose: () => void
}) => {
    const [errorMessage, setErrorMessage] = useState<string>('')

    const {
        waferInfo,
        setWaferInfo,
        checkWaferExists,
        optionsLists
    } = useWafer(previousWaferInfo)

    const selectHandler = (key: string, value: string) => {
        setErrorMessage('')
        setWaferInfo(prev => ({
            ...prev,
            [key]: value
        }))

        if (key === 'toolId' || key === 'moduleId') {
            setWaferInfo(prev => ({
                ...prev,
                carrierId: '',
                lotId: '',
                recipeId: '',
                slotNo: '',
                waferId: '',
            }))
        }
    }

    const onSave = async () => {
        if (!(waferInfo.carrierId && waferInfo.lotId && waferInfo.moduleId && waferInfo.recipeId && waferInfo.slotNo && waferInfo.toolId && waferInfo.waferId)) {
            setErrorMessage('All fields are required.')
            return
        }
        const isValid = await checkWaferExists()
        if (!isValid) {
            setErrorMessage('Wafer not found.')
            return
        }
        onClose()
        onSubmit(waferInfo)
    }

    return (
        <div className='p-20000rem'>
            <div className={styles['popup-header']}>
                <div className="page-title">Choose</div>
            </div>
            <div className={styles['form-container']}>
                <SingleSelector label='Tool' isRequired options={optionsLists.toolId} onSelect={(value) => selectHandler('toolId', value)} value={waferInfo.toolId} />
                <SingleSelector label='Model' isRequired options={optionsLists.moduleId} onSelect={(value) => selectHandler('moduleId', value)} value={waferInfo.moduleId} />
                <SingleSelector label='Charger system' isRequired options={optionsLists.carrierId} onSelect={(value) => selectHandler('carrierId', value)} value={waferInfo.carrierId} />
                <SingleSelector label='Release No.' isRequired options={optionsLists.recipeId} onSelect={(value) => selectHandler('recipeId', value)} value={waferInfo.recipeId} />
                <SingleSelector label='Part' isRequired options={optionsLists.lotId} onSelect={(value) => selectHandler('lotId', value)} value={waferInfo.lotId} />
                <SingleSelector label='FSD version' isRequired options={optionsLists.slotNo} onSelect={(value) => selectHandler('slotNo', value)} value={waferInfo.slotNo} />
                <SingleSelector label='AP version' isRequired options={optionsLists.waferId} onSelect={(value) => selectHandler('waferId', value)} value={waferInfo.waferId} />
            </div >
            <div className={styles['button-container']}>
                {errorMessage && < div className={styles['error-message']}>{errorMessage}</div>}
                <Button onClick={onClose}>Close</Button>
                <Button className='me-0' onClick={onSave}>Save</Button>
            </div>
        </div >
    )
}

export default WaferForm