import { createNewRule } from '@/app/be/services/rules'
import Button from '@/app/ui/components/Button/Button'
import Input from '@/app/ui/components/Input/Input'
import SingleSelector from '@/app/ui/components/SingleSelector/SingleSelector'
import { useState } from 'react'
import styles from './NewRule.module.scss'

const RULES_OPTIONS = ['CONSECUTIVE_INCREASE', 'UPPER_LIMIT', 'LOWER_LIMIT']
const COLUMN_OPTIONS = ['Pressure', 'Flow']

interface Props {
    onConfirm: () => void
    onClose: () => void
}

const NewRule = ({ onConfirm, onClose }: Props) => {
    const [name, setName] = useState<string>('')
    const [rule, setRule] = useState<string>('')
    const [value, setValue] = useState<number>(0)
    const [column, setColumn] = useState<string>('')


    const confirmHandler = () => {
        createNewRule(name, rule, value, column)
        onConfirm()
        onClose()
    }

    return (
        <div className='p-20000rem'>
            <div className="page-title mb-25000rem">New Monitor Rule</div>
            <div className={styles['grid-container']}>
                <div>
                    <Input name='Name' value={name} isRequired onValueChange={value => setName(value)} />
                    <SingleSelector
                        label="Rule"
                        value={rule}
                        isRequired
                        options={RULES_OPTIONS}
                        onSelect={value => setRule(value)}
                    />
                </div>
                <div>
                    <Input name='Condition Value' value={value} type='number' isRequired onValueChange={value => setValue(Number(value))} />
                    <SingleSelector
                        label="Condition Column"
                        value={column}
                        isRequired
                        options={COLUMN_OPTIONS}
                        onSelect={value => setColumn(value)}
                    />
                </div>
            </div>
            <div className={styles['button-container']}>
                <Button onClick={onClose}>Cancel</Button>
                <Button className='me-0rem' onClick={confirmHandler}>Confirm</Button>
            </div>
        </div>
    )
}

export default NewRule