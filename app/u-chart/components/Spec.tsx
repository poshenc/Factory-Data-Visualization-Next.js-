import DateBetweenPicker from '@/app/ui/components/DateBetweenPicker/DateBetweenPicker'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import ModuleSpec, { ModuleSpecProps, TimeRangeSpecProps } from './ModuleSpec'
import styles from './Spec.module.scss'

const Spec = ({
  modules,
  isByModule = true,
  toolId,
  updateModuleSpec,
  updateTimeSpec
}: {
  modules: ModuleSpecProps[];
  isByModule: boolean;
  toolId: string;
  updateModuleSpec: (spec: ModuleSpecProps[]) => void;
  updateTimeSpec: (spec: TimeRangeSpecProps) => void;

}) => {
  // for time range
  const [sdate, setSdate] = useState<Dayjs>(dayjs(null))
  const [edate, setEdate] = useState<Dayjs>(dayjs(null))
  const [errorTimeLimit, setErrorTimeLimit] = useState<boolean>(false)

  const [selectedModule, setSelectedModule] = useState<number>(0)

  const addModuleHandler = () => {
    const updatedModules = [...modules]
    updatedModules.push({
      toolId: toolId,
      moduleId: '',
      sdate: dayjs(null),
      edate: dayjs(null),
      recipeId: ''
    })
    updateModuleSpec(updatedModules)

    setSelectedModule(modules.length)
  }

  useEffect(() => {
    const updatedModules = modules.map(module => ({
      ...module,
      toolId: toolId
    }))
    updateModuleSpec(updatedModules)
  }, [toolId])

  const removeModuleHandler = (index: number) => {
    const updatedModules = [...modules]
    updatedModules.splice(index, 1)
    updateModuleSpec(updatedModules)
    setSelectedModule(0)
  }

  const getTabColor = (index: number) => {
    if (index === selectedModule) {
      if (index === 0) return 'bg-orange-100'
      if (index === 1) return 'bg-sky-100'
      if (index === 2) return 'bg-yellow-100'
      if (index === 3) return 'bg-emerald-100'
    } else {
      if (index === 0) return 'bg-orange-100 text-slate-400'
      if (index === 1) return 'bg-sky-100 text-slate-400'
      if (index === 2) return 'bg-yellow-100 text-slate-400'
      if (index === 3) return 'bg-emerald-100 text-slate-400'
    }
  }

  const getActiveColor = (index: number) => {
    if (index === selectedModule) {
      if (index === 0) return 'bg-orange-400'
      if (index === 1) return 'bg-sky-400'
      if (index === 2) return 'bg-yellow-400'
      if (index === 3) return 'bg-emerald-400'
    }
  }

  const moduleTabs = modules.map((value, index) => {
    return (
      <div key={index} className={`${styles['tab']} ${getTabColor(index)}`} onClick={() => setSelectedModule(index)}>
        {index + 1}
        <div className={`${styles['active']} ${getActiveColor(index)}`}></div>
      </div>
    )
  })

  const updateSpecHandler = (index: number, data: ModuleSpecProps) => {
    const updatedModules = [...modules]
    updatedModules[index] = { ...data }
    updateModuleSpec(updatedModules)
  }

  useEffect(() => {
    if (!isByModule) {
      updateTimeSpec({ toolId, sdate, edate })
    }
  }, [sdate, edate])

  if (isByModule) {
    return (
      <div className={styles['modules-container']}>
        <div>
          {moduleTabs}
          {modules.length < 4 && <div className={styles['add-tab']} onClick={addModuleHandler}><AddRoundedIcon sx={{ fontSize: '20px', color: 'rgb(168,162,158)' }}></AddRoundedIcon></div>}
        </div>
        {modules.length > 0 && <ModuleSpec spec={modules[selectedModule]} updateSpec={updateSpecHandler} index={selectedModule} onRemoveModule={removeModuleHandler} />}
      </div>
    )
  } else {
    return (
      <div className={styles['container']}>
        <DateBetweenPicker isRequired className={styles['date-picker']} label='Time Limit' startTime={sdate} endTime={edate} setStartTime={setSdate} setEndTime={setEdate} errorTimeLimit={errorTimeLimit} setErrorTimeLimit={setErrorTimeLimit} />
      </div>
    )
  }
}

export default Spec