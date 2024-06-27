import { fetchWaferRecipeList } from "@/app/ui/api/wafers/request";
import DateBetweenPicker from "@/app/ui/components/DateBetweenPicker/DateBetweenPicker";
import SingleSelector from "@/app/ui/components/SingleSelector/SingleSelector";
import { useModuleAndToolList } from "@/app/ui/hooks/useModuleAndToolList";
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import styles from './ModuleSpec.module.scss';

export interface ModuleSpecProps {
    toolId: string;
    moduleId: string;
    sdate: Dayjs | undefined;
    edate: Dayjs | undefined;
    recipeId: string;
}

export interface TimeRangeSpecProps {
    toolId: string;
    sdate: Dayjs | undefined;
    edate: Dayjs | undefined;
}

const ModuleSpec = ({
    index,
    spec,
    updateSpec,
    onRemoveModule,
}: {
    index: number
    spec: ModuleSpecProps
    updateSpec: (index: number, spec: ModuleSpecProps) => void
    onRemoveModule: (index: number) => void
}) => {
    const { moduleOptionList } = useModuleAndToolList()

    const [hasErrordModuleId, setHasErrordModuleId] = useState<boolean>(false)

    const getBgColor = (index: number) => {
        if (index === 0) return 'bg-orange-100'
        if (index === 1) return 'bg-sky-100'
        if (index === 2) return 'bg-yellow-100'
        if (index === 3) return 'bg-emerald-100'
    }

    const { data: recipeList, refetch: fetchRecipeList } = useQuery({
        queryKey: ['recipeList' + index],
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
                edate: edate.toString()
            }
            return fetchWaferRecipeList(data)
        } else {
            return null
        }
    }

    useEffect(() => {
        fetchRecipeList()
    }, [spec.toolId, spec.moduleId, spec.sdate, spec.edate])

    useEffect(() => {
        setHasErrordModuleId(false)
    }, [index])

    const updateHandler = (key: string, value: string | Dayjs) => {
        const updatedSpec = {
            ...spec,
            [key]: value
        }
        updateSpec(index, updatedSpec)
    }

    const moduleIdBlurHandler = () => {
        if (!spec.moduleId) {
            setHasErrordModuleId(true)
        } else {
            setHasErrordModuleId(false)
        }
    }

    return (
        <div key={index} className={`${styles['container']} ${getBgColor(index)}`}>
            <SingleSelector label='Model' value={spec.moduleId} className='!mb-5' isRequired options={moduleOptionList} onSelect={(value: string) => updateHandler('moduleId', value)} onBlured={moduleIdBlurHandler} error={hasErrordModuleId && 'Please choose a module!'} />
            <SingleSelector label='Release No.' value={spec.recipeId} className='!mb-0' options={recipeList} onSelect={(value: string) => updateHandler('recipeId', value)} />
            <DateBetweenPicker isRequired className={styles['date-picker']} label='Time Range' startTime={spec.sdate} endTime={spec.edate} setStartTime={(value: Dayjs) => updateHandler('sdate', value)} setEndTime={(value: Dayjs) => updateHandler('edate', value)} />
            <div className={styles['close-button-container']}><button onClick={() => onRemoveModule(index)}><CloseIcon fontSize='medium' sx={{ color: 'black', '&:hover': { color: '#fa5252' } }}></CloseIcon></button></div>
        </div>
    )
}

export default ModuleSpec