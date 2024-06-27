import styles from "./StatusSign.module.scss"
interface Props {
    status:boolean
}

const StatusSign = (props: Props) => {
const dotClass = props.status ? styles['green-dot'] :styles['red-dot']
    return(
            <div className={dotClass} />
    )
}

export default StatusSign