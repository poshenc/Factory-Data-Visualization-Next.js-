"use client"

import { getAllRules } from '@/app/be/services/rules';
import { DialogContext } from '@/app/ui/context/DialogContext';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import EditRule from './EditRule';
import styles from './GridInTabs.module.scss';
import GridTable from './GridTable';
import NewRule from './NewRule';
import TabWithNotification from './TabWithNotification';

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        backgroundColor: '#04203C'
    },
})

export default function GridInTabs() {
    const [value, setValue] = useState(0)
    const [allRules, setAllRules] = useState<{
        id: number;
        Rule_Name: string;
        Method_Name: string;
        Condition_Value: number;
        Condition_Column: string;
    }[]>([])

    const fetchAllRules = async () => {
        const rules = await getAllRules()
        if (!rules.some((rule) => rule.id === value)) {
            setValue(rules[0]?.id ?? 0)
        }
        setAllRules(rules)
    }

    useEffect(() => {
        fetchAllRules()
    }, [])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    const { openDialog, closeDialog } = useContext(DialogContext)

    const newHandler = () => {
        openDialog(<NewRule onClose={closeDialog} onConfirm={fetchAllRules}></NewRule>)
    }

    const editHandler = () => {
        openDialog(<EditRule onClose={fetchAllRules}></EditRule>)
    }


    return (
        <div className={styles.container}>
            <StyledTabs
                value={value}
                onChange={handleChange}
                aria-label="styled tabs example"
            >
                {allRules?.map((rule) => {
                    return <TabWithNotification key={rule.id} value={rule.id} label={rule.Rule_Name} />
                })}
            </StyledTabs>
            <div className={styles['button-container']}>
                <button className={styles['new-button']} onClick={editHandler}>Edit Monitor Rule</button>
                <button className={styles['new-button']} onClick={newHandler}>New Monitor Rule</button>
            </div>

            {allRules.length > 0 && <GridTable ruleId={value}></GridTable>}
        </div>
    );
}