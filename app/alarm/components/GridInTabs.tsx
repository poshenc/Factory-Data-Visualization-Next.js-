"use client"

import { DialogContext } from '@/app/ui/context/DialogContext';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import styles from './GridInTabs.module.scss';
import GridTable from './GridTable';
// import NewRule from './NewRule';
import EditRule from './EditRule';
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
    const [value, setValue] = useState(61)
    const [allModules, setAllModules] = useState<{
        id: number;
        Module_Name: string;
    }[]>([])

    useEffect(() => {
        const modules = [{
            id: 61,
            Module_Name: 'ENTRON-EX-13-42 F1-1'
        }, {
            id: 62,
            Module_Name: 'ENTRON-EX-13-42 F2-2'
        }]
        setAllModules(modules)
    }, [])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    const { openDialog, closeDialog } = useContext(DialogContext)

    const editHandler = () => {
        openDialog(<EditRule></EditRule>)
    }


    return (
        <div className={styles.container}>
            <StyledTabs
                value={value}
                onChange={handleChange}
                aria-label="styled tabs example"
            >
                {allModules?.map((rule) => {
                    return <TabWithNotification key={rule.id} value={rule.id} label={rule.Module_Name} />
                })}
            </StyledTabs>
            <div className={styles['button-container']}>
                <button className={styles['new-button']} onClick={editHandler}>Edit Monitor Rule</button>
            </div>

            {allModules.length > 0 && <GridTable ruleId={value}></GridTable>}
        </div>
    );
}