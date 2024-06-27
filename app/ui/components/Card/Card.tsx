import styles from './Card.module.scss'

interface Props {
    children: React.ReactNode
    className?: string
}

const Card = ({ children, className = '' }: Props) => {
    const mainClass = `${styles.card} ${className}`

    return (
        <div className={mainClass}>
            {children}
        </div>
    )
}

export default Card