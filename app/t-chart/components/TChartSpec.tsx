import { fetchActionEvents } from '@/app/ui/api/events/request'
import { fetchTraceColumnNames } from '@/app/ui/api/traces/request'
import SingleSelector from '@/app/ui/components/SingleSelector/SingleSelector'
import { WafersContext } from '@/app/ui/context/WafersContext'
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import CheckBoxList from '../../ui/components/CheckBoxList/CheckBoxList'
import { TChartSpecType } from '../page'
import styles from './TChartSpec.module.scss'

const stepsOptions: string[] = ['Process']
for (let i = 1; i <= 10; i++) {
    stepsOptions.push(i.toString())
}

const TChartSpec = ({
    spec: { items, events, alignStep },
    setSpec,
}: {
    spec: TChartSpecType;
    setSpec: Dispatch<SetStateAction<TChartSpecType>>;
}) => {
    const wafersContext = useContext(WafersContext)

    const [itemOptions, setItemOptions] = useState<string[]>([])
    const [eventOptions, setEventOptions] = useState<string[]>([])

    // fetch all items options
    useEffect(() => {
        const getTraceColumnNames = async () => {
            const data = await fetchTraceColumnNames()
            setItemOptions(data)
        }

        getTraceColumnNames()
    }, [])

    // fetch all events based on wafers selected
    useEffect(() => {
        async function fetchEventOptions() {
            let eventsStringOptions: string[] = []

            const promises = wafersContext.data.wafers.map(async (wafers, index) => {
                const events = await fetchActionEvents(wafers);
                events.forEach(event => eventsStringOptions.push(`${event}-${index + 1}`));
            });
            await Promise.all(promises);

            setEventOptions(eventsStringOptions)
        }

        fetchEventOptions()
    }, [wafersContext.data.wafers])

    // map selected items arrays into an object
    const selectedItems: { [key: string]: boolean } = itemOptions.reduce((acc, option) => {
        acc[option] = items.includes(option)
        return acc
    }, {} as { [key: string]: boolean })

    // map selected events arrays into an object
    const selectedEvents: { [key: string]: boolean } = eventOptions.reduce((acc, option) => {
        acc[option] = events.includes(option)
        return acc
    }, {} as { [key: string]: boolean })

    const handleMultipleSelectionChange = (type: string, newSelectedObject: { [key: string]: boolean }) => {
        const newSelectedItems = Object.keys(newSelectedObject).filter(key => newSelectedObject[key]);
        setSpec(prev => ({
            ...prev,
            [type]: newSelectedItems
        }))
    }

    const handleSingleSelectionChange = (type: string, selectedString: string) => {
        setSpec(prev => ({
            ...prev,
            [type]: selectedString
        }))
    }

    const showAlignStep = useMemo(() => {
        const containsEmptyObject = wafersContext.data.wafers.some(obj => Object.keys(obj).length === 0);
        const hasTwoWafers = wafersContext.data.wafers.length === 2
        return hasTwoWafers && !containsEmptyObject
    }, [wafersContext.data.wafers])

    const itemContainer = showAlignStep ? styles['checkbox1-wrapper-shrunk'] : styles['checkbox1-wrapper-expanded']

    return (
        <div className={styles['container']}>
            <div className={itemContainer}>
                <CheckBoxList
                    label="Items"
                    items={selectedItems}
                    setItems={obj => handleMultipleSelectionChange('items', obj)}
                    limitAmount={5}
                    isRequired />
            </div>
            <div className={styles['checkbox2-wrapper']}>
                <CheckBoxList
                    label="Events"
                    items={selectedEvents}
                    setItems={obj => handleMultipleSelectionChange('events', obj)}
                    limitAmount={5} />
            </div>
            {showAlignStep && <SingleSelector
                className='mb-0'
                value={alignStep}
                label={'Align step'}
                options={stepsOptions}
                onSelect={val => handleSingleSelectionChange('alignStep', val)} />}
        </div>
    )
}

export default TChartSpec