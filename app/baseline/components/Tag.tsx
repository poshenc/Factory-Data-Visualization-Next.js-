import styles from './Tag.module.scss';

export type TagInfo = {
    time: string;
    value: string;
    lotId: string;
    carrierId: string;
    slotId: string;
    waferId: string;
}

const Tag = ({
    tag,
    index,
    removeTag
}: {
    tag: TagInfo;
    index: number;
    removeTag: (index: number) => void;
}) => {
    return (
        <div className={styles.container}>
            <p>Time: {tag.time}</p>
            <p>Value: {tag.value}</p>
            <p>Lot ID: {tag.lotId}</p>
            <p>Carrier ID: {tag.carrierId}</p>
            <p>Slot No: {tag.slotId}</p>
            <p>Wafer ID: {tag.waferId}</p>
            <div className={styles['close-btn']} onClick={() => removeTag(index)}>X</div>
        </div>
    )
}

export default Tag