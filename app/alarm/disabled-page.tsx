import GridInTabs from './components/GridInTabs'
import styles from './page.module.scss'

const Alarm = () => {
    return (
        <>
            <div className={styles['title-section']}>
                <div className="page-title">Alarm</div>
            </div>
            <GridInTabs></GridInTabs>
        </>
    )
}

export default Alarm