import { fetchTraceColumnNames } from '@/app/ui/api/traces/request'
import AutoComplete from '@/app/ui/components/AutoComplete/AutoComplete'
import Input from '@/app/ui/components/Input/Input'
import SingleSelector from '@/app/ui/components/SingleSelector/SingleSelector'
import ToggleSelector from '@/app/ui/components/ToggleSelector/ToggleSelector'
import { useInput } from '@/app/ui/hooks/useInput'
import { useModuleAndToolList } from '@/app/ui/hooks/useModuleAndToolList'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ModuleSpecProps, TimeRangeSpecProps } from './ModuleSpec'
import Spec from './Spec'
import styles from './UChartSpec.module.scss'

const STATISTICS_OPTIONS = ['Avg', 'Max', 'Min', 'Range']
const MODE_OPTIONS = ['By Module', 'By Time Range']

export interface UChartSpecType {
    modules: ModuleSpecProps[]
    timeRange: TimeRangeSpecProps
    lower: string
    upper: string
    items: string[]
    statistics: string
}

const UChartSpec = ({
    spec,
    setSpec
}: {
    spec: UChartSpecType;
    setSpec: Dispatch<SetStateAction<UChartSpecType>>;
}) => {
    const { toolOptionList } = useModuleAndToolList()

    const {
        value: mode,
        setValue: setMode,
        handleInputBlur: handleModeBlur,
        hasError: hasErrordMode
    } = useInput(MODE_OPTIONS[0], 'notEmpty')

    const {
        value: toolId,
        setValue: setToolId,
        handleInputBlur: handleToolIdBlur,
        hasError: hasErrordToolId
    } = useInput('', 'notEmpty')

    const [itemsOptions, setItemsOptions] = useState<string[]>([])


    // fetch item lists on init
    useEffect(() => {
        const getTraceColumnNames = async () => {
            const data = await fetchTraceColumnNames()
            setItemsOptions(data)
        }

        getTraceColumnNames()
    }, [])

    const updateOtherSpec = (key: 'lower' | 'upper' | 'items' | 'statistics', value: string | string[]) => {
        setSpec((prev: UChartSpecType) => ({
            ...prev,
            [key]: value
        }))
    }

    const updateModuleSpecHandler = (data: ModuleSpecProps[]) => {
        setSpec((prev: UChartSpecType) => ({
            ...prev,
            modules: data,
            timeRange: {} as TimeRangeSpecProps
        }))
    }

    const updateTimeRangeSpecHandler = (timeRange: TimeRangeSpecProps) => {
        setSpec((prev: UChartSpecType) => ({
            ...prev,
            modules: [],
            timeRange
        }))
    }

    const modeChangeHandler = (val: string) => {
        if (val === mode) return

        setMode(val)
        updateModuleSpecHandler([])
    }

    useEffect(() => {
        if (toolOptionList && toolOptionList?.length > 0) {
            setToolId(toolOptionList[0])
        }
    }, [setToolId, toolOptionList])

    return (
        <div className={styles['container']}>
            <div className={styles['left-content']}>
                <SingleSelector label='Mode' className='!mb-5' isRequired options={MODE_OPTIONS} value={mode} onSelect={modeChangeHandler} onBlured={handleModeBlur} error={hasErrordMode && 'Please choose a mode!'} />
                <SingleSelector label='Tool' className='!mb-5' isRequired options={toolOptionList} value={toolId} onSelect={setToolId} onBlured={handleToolIdBlur} error={hasErrordToolId && 'Please choose a tool!'} />
            </div>
            <Spec isByModule={mode === 'By Module' ? true : false} toolId={toolId} modules={spec.modules} updateModuleSpec={updateModuleSpecHandler} updateTimeSpec={updateTimeRangeSpecHandler}></Spec>
            <div className={styles['right-content']}>
                <AutoComplete label={'Items'} options={itemsOptions} value={spec.items} onSelect={val => updateOtherSpec('items', val)} isRequired></AutoComplete>
                <div className={styles['stat-container']}>
                    <div>
                        <ToggleSelector label='Statistics' options={STATISTICS_OPTIONS} value={spec.statistics} setValue={val => updateOtherSpec('statistics', val)} isRequired />
                    </div>
                    <Input className='!mb-0' name='Lower' value={spec.lower} onValueChange={val => updateOtherSpec('lower', val)} />
                    <Input className='!mb-0' name='Upper' value={spec.upper} onValueChange={val => updateOtherSpec('upper', val)} />
                </div>
            </div>
        </div>

    )

}

export default UChartSpec
