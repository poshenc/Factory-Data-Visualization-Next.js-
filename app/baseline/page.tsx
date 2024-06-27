"use client"

import { useQuery } from '@tanstack/react-query'
import { ChartData } from 'chart.js'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { GetBaselineWafersParams } from '../api/wafers/baseline/request-dto'
import { fetchTraceColumnNames } from '../ui/api/traces/request'
import { fetchBaselineWaferData } from '../ui/api/wafers/request'
import RadioCheckBox from '../ui/components/RadioCheckBox/RadioCheckBox'
import SingleSelector from '../ui/components/SingleSelector/SingleSelector'
import BaselineChart from './components/BaselineChart'
import ModuleSpec, { ModuleSpecProps } from './components/ModuleSpec'
import Tag, { TagInfo } from './components/Tag'
import styles from './page.module.scss'

const SAMPLESPEC: ModuleSpecProps = {
    "toolId": "tesla_sensor",
    "moduleId": "model_3",
    "sdate": dayjs("2023-06-02T16:00:00.000Z"),
    "edate": dayjs("2024-06-26T16:00:00.000Z"),
    "recipeId": ""
}

const Baseline = () => {
    const [spec, setSpec] = useState<ModuleSpecProps>(SAMPLESPEC)
    const [item, setItem] = useState<string>('altitude')
    const [itemOptions, setItemOptions] = useState<string[]>([])
    const [alignStep, setAlignStep] = useState<string>('Process')
    const [tags, setTags] = useState<TagInfo[]>([])

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['baselineWafer'],
        queryFn: () => getBaselineWaferData(),
        enabled: false
    })

    useEffect(() => {
        refetch()
        setTags([])
    }, [spec, item, alignStep, refetch])

    // dynamic insert selected items
    useEffect(() => {
        const getTraceColumnNames = async () => {
            const data = await fetchTraceColumnNames()
            setItemOptions(data)
        }

        getTraceColumnNames()
    }, [])

    const getBaselineWaferData = async () => {
        const { toolId, moduleId, sdate, edate, recipeId } = spec

        if (toolId && moduleId && sdate?.isValid() && edate?.isValid()) {
            const params: GetBaselineWafersParams = {
                toolId,
                moduleId,
                sdate: sdate.toString(),
                edate: edate.toString(),
                recipeId,
                items: [item],
                alignStep: alignStep === 'Process' ? '' : alignStep
            }

            return fetchBaselineWaferData(params)
        }
        return {} as ChartData<'line'>
    }

    const getState = () => {
        const { toolId, moduleId, sdate, edate, recipeId } = spec

        if (!toolId || !moduleId || !sdate?.isValid() || !edate?.isValid()) return null

        if (isFetching) {
            return 'Fetching...'
        } else if (!data?.datasets && item) {
            return 'No data found'
        }
        return null
    }

    const nodeClickHandler = useCallback((newTag: TagInfo) => {
        setTags(prev => {
            let updatedTags = [...prev]
            if (updatedTags.length >= 4) {
                updatedTags.shift()
            }
            updatedTags = [...updatedTags, newTag]
            return updatedTags
        })
    }, [])

    const removeTag = useCallback((index: number) => {
        setTags(prev => prev.filter((_, i) => i !== index))
    }, [])

    return (
        <>
            <div className="page-title">Item Analysis</div>
            <div className={styles.content}>
                <div className={styles['spec-container']}>
                    <ModuleSpec spec={spec} setSpec={setSpec} />
                    {getState() && <span className={styles.state}>{getState()}</span>}
                    <div className={styles['items-container']}>
                        <RadioCheckBox label="Items" isRequired options={itemOptions} value={item} setValue={setItem} />
                    </div>
                    <SingleSelector value={alignStep} onSelect={setAlignStep} className='!mb-0' label='Align Step' options={['Process', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']} isRequired />
                </div>
                <div className={styles['chart-container']}>
                    <BaselineChart data={data ?? {} as ChartData<'line'>} nodeClick={nodeClickHandler}></BaselineChart>
                    <div className={styles['actions-section']}>
                        <div className={styles.tags}>
                            {tags.map((tag, i) => (<Tag key={i} tag={tag} index={i} removeTag={removeTag} />))}
                        </div>
                        <div className={styles['selected-item-container']}>
                            <div>Selected Item: </div>
                            {item && <div className={styles['selected-item']}>{item}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Baseline