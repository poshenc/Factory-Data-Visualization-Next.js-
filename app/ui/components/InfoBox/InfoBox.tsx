import styles from './InfoBox.module.scss'

interface Props {
    data: { [key: string]: string }
    heightClass?: string
    className?: string
}

const InfoBox = (props: Props) => {
    const height = props.heightClass ? props.heightClass : ''
    const main = props.className ? props.className : ''

    const keys = Object.keys(props.data)

    const trItems = keys.map((key, index) => (
        <tr key={index}>
            <td>{key}</td>
            <td>{props.data[key]}</td>
        </tr>))

    return (
        <>
            <table className={`${styles.wrapper} ${height} ${main}`}>
                <tbody>
                    {trItems}
                </tbody>
            </table >
        </>
    )

}

export default InfoBox