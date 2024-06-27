import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import styles from './EditRule.module.scss';

interface Props {
    onClose?: () => void
}

const EditRule = ({ onClose }: Props) => {

    const [allRules, setAllRules] = useState<{
        id: number
        name: string
        lowerLimit: number
        upperLimit: number
    }[]>([])

    useEffect(() => {
        const rules = [{
            id: 1,
            name: 'DC1Power',
            lowerLimit: 100,
            upperLimit: 500
        }, {
            id: 2,
            name: 'DC1Voltage',
            lowerLimit: 100,
            upperLimit: 500
        }, {
            id: 3,
            name: 'DC1Current',
            lowerLimit: 100,
            upperLimit: 500
        }]
        setAllRules(rules)

        return () => {
            if (onClose) onClose()
        }
    }, [])

    const removeRule = (id: number) => {
        setAllRules(prev => prev.filter((data) => data.id !== id))
    }

    const updateRule = (id: number, field: string, value: string) => {
        setAllRules(prev => {
            return prev.map(rule => {
                if (rule.id === id) {
                    return {
                        ...rule,
                        [field]: value
                    }
                } else {
                    return rule
                }
            })
        })
    }

    return (
        <div className='p-20000rem'>
            <div className="page-title mb-15000rem">Edit Monitor Rule</div>
            <div className={styles['grid-header']}>
                <div>Name</div>
                <div>Lower</div>
                <div>Upper</div>
                <div></div>
            </div>
            {allRules.map(element => (
                <div key={element.id}>
                    <div className={styles['grid-item']}>
                        <input className={styles['input-box']} type="text" value={element.name} onChange={e => updateRule(element.id, 'name', e.target.value)} />
                        <input className={styles['input-box']} type="text" value={element.lowerLimit} onChange={e => updateRule(element.id, 'lowerLimit', e.target.value)} />
                        <input className={styles['input-box']} type="text" value={element.upperLimit} onChange={e => updateRule(element.id, 'upperLimit', e.target.value)} />
                        <button onClick={() => removeRule(element.id)}><CloseIcon fontSize='medium' sx={{ color: 'black', '&:hover': { color: '#fa5252' } }}></CloseIcon></button>
                    </div>
                </div>
            ))}
            <div className={styles.new}>+</div>
        </div>
    )
}

export default EditRule