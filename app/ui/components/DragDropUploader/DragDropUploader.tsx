import { FunctionComponent, useCallback, useState } from "react"
import { useDropzone } from 'react-dropzone'

import styles from './DragDropUploader.module.scss'

import fileIcon from '../../assets/svg/fileIcon.svg'

interface Props {
    label: string
    acceptFile?: {
        [key: string]: string[];
    }
    onUpload(file: any): void
    isRequired?: boolean
}

const DragDropUploader: FunctionComponent<Props> = ({ label, acceptFile, onUpload, isRequired = false }) => {
    const [message, setMessage] = useState<string>('Browse or drop file')

    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        setMessage(acceptedFiles[0].name)
        onUpload(acceptedFiles[0])
    }, [onUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptFile
    })

    const dropBoxClass = `
        ${styles['dropbox-container']}
        ${isDragActive ? styles['border-hover'] : ''}
        ${message !== 'Browse or drop file' ? styles['border-hover'] : ''}
    `

    return (
        <div>
            <label htmlFor={label} className='section-title'>
                {label}
                {isRequired && <span className={styles.asterisk}>*</span>}
            </label>
            <div className='mt-10000rem' {...getRootProps()}>
                <input id={label} {...getInputProps()} />

                <div className={dropBoxClass}>
                    {
                        isDragActive ?
                            'Drop the file here ...' :
                            (
                                <>
                                    <img className={styles.icon} src={fileIcon} alt='file-icon' />
                                    <span>{message}</span>
                                </>
                            )
                    }

                </div>
            </div>

        </div>
    )
}

export default DragDropUploader