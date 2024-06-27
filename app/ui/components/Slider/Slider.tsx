import { useState } from 'react';
import styles from './Slider.module.scss';

const Slider = ({
    defaulValue,
    max,
    onSelect,
    waferIndex
}: {
    defaulValue: string
    max: string
    onSelect(value: string): void
    waferIndex: number
}) => {
    const [value, setValue] = useState<string>(defaulValue)

    const changeHandler = (event: any) => {
        setValue(event.target.value)
        onSelect(event.target.value)
    }

    const mark = waferIndex === 0 ? styles['wafer1-mark'] : styles['wafer2-mark']
    const sliderColor = waferIndex === 0 ? '#efdac2' : '#D1DBE5'
    const filledPercentage: number = (Number(value) / Number(max)) * 100
    const filledBackground = { background: `linear-gradient(to right, transparent 0%, transparent ${filledPercentage}%, ${sliderColor} ${filledPercentage}%, ${sliderColor} 100%` }

    return (
        <div className={styles['slider-container']}>
            <input className={`${styles.slider} ${mark}`} type="range" id="range" name="range" min="0" max={max} value={value} onChange={changeHandler} style={filledBackground} />
        </div>
    )
}

export default Slider


