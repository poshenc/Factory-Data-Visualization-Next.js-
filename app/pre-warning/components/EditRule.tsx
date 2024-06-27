import { deleteRuleById, getAllRules } from "@/app/be/services/rules";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import styles from './EditRule.module.scss';

interface Props {
    onClose: () => void
}

const EditRule = ({ onClose }: Props) => {

    const [allRules, setAllRules] = useState<any[]>([])

    useEffect(() => {
        getAllRules().then((rules) => setAllRules(rules))

        return () => onClose()
    }, [])

    const removeRule = (id: number) => {
        setAllRules(prev => prev.filter((data) => data.id !== id))
        deleteRuleById(id)
    }

    return (
        <div className='p-20000rem'>
            <div className="page-title mb-15000rem">Edit Monitor Rule</div>
            {allRules.map(element => (
                <div key={element.id}>
                    <div className={styles['grid-item']}>
                        <div>{element.Rule_Name}</div>
                        <button onClick={() => removeRule(element.id)}><CloseIcon fontSize='medium' sx={{ color: 'black', '&:hover': { color: '#fa5252' } }}></CloseIcon></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EditRule