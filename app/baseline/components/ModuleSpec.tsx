import { fetchWaferRecipeList } from "@/app/ui/api/wafers/request"
import DateBetweenPicker from "@/app/ui/components/DateBetweenPicker/DateBetweenPicker"
import SingleSelector from "@/app/ui/components/SingleSelector/SingleSelector"
import { useModuleAndToolList } from "@/app/ui/hooks/useModuleAndToolList"
import { useQuery } from "@tanstack/react-query"
import { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import styles from './ModuleSpec.module.scss'

export interface ModuleSpecProps {
    toolId: string
    moduleId: string
    sdate: Dayjs | undefined
    edate: Dayjs | undefined
    recipeId: string
}

const ModuleSpec = ({
    spec,
    setSpec
}: {
    spec: ModuleSpecProps
    setSpec: (spec: ModuleSpecProps) => void
}) => {
    const { toolId, moduleId, recipeId, sdate, edate } = spec
    const { moduleOptionList, toolOptionList } = useModuleAndToolList()

    const [errorTimeLimit, setErrorTimeLimit] = useState<boolean>(false)

    const { data: recipeList, refetch: fetchRecipeList, isLoading } = useQuery({
        queryKey: ['baseline-recipeList'],
        queryFn: () => updateWaferRecipeList(),
        enabled: false,
    })

    const updateWaferRecipeList = async () => {
        const { toolId, moduleId, sdate, edate } = spec
        if (toolId && moduleId && sdate?.isValid() && edate?.isValid()) {
            const data = {
                toolId,
                moduleId,
                sdate: sdate.toString(),
                edate: edate.toString(),
            }
            return fetchWaferRecipeList(data)
        } else {
            return []
        }
    }

    const updateSpecHandler = (type: 'toolId' | 'moduleId' | 'sdate' | 'edate' | 'recipeId', data: string | Dayjs) => {
        if (type !== 'recipeId') {
            fetchRecipeList()
        }

        setSpec({
            ...spec,
            [type]: data
        })
    }

    useEffect(() => {
        setSpec({
            ...spec,
            recipeId
        })
    }, [recipeList])

    return (
        <div className={styles['container']}>
            <SingleSelector label='Tool' value={toolId} className='!mb-5' isRequired options={toolOptionList} onSelect={val => updateSpecHandler('toolId', val)} />
            <SingleSelector label='Model' value={moduleId} className='!mb-5' isRequired options={moduleOptionList} onSelect={val => updateSpecHandler('moduleId', val)} />
            <DateBetweenPicker isRequired className={styles['date-picker']} label='Time Range' startTime={sdate} endTime={edate} setStartTime={val => updateSpecHandler('sdate', val)} setEndTime={val => updateSpecHandler('edate', val)} errorTimeLimit={errorTimeLimit} setErrorTimeLimit={setErrorTimeLimit} />
            {(recipeList?.length === 0 && !isLoading && toolId && moduleId && sdate! < edate!) && <span className={styles['error']}>no data</span>}
            {(recipeList && recipeList.length > 0) && <SingleSelector value={recipeId} label='Recipe' className='!mt-5 !mb-0' options={recipeList ?? []} onSelect={val => updateSpecHandler('recipeId', val)} />}
        </div>
    )
}

export default ModuleSpec