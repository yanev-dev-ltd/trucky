import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { db, storage } from '../../../../services/firebase'
import { ref, update } from 'firebase/database'
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'
import { Files, UploadProps, UploadedFile } from '../types'
import { useSnackbar } from 'notistack'

const useUpload = ({filepath, dbpath, currentFiles}: UploadProps) => {
    const intl = useIntl()
    const [files, setFiles] = useState<Files>([])
    const [uploadProgress, setUploadProgress] = useState<number[]>([])
    const [uploadError, setUploadError] = useState<string[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const handleAddFiles = useCallback( 
        (event: ChangeEvent<HTMLInputElement>) => {
            if (
                !event ||
                !event.target ||
                !event.target.files ||
                event.target.files.length === 0
            ) {
                return
            }
            setFiles(
                Array.from(event?.target?.files || []).map((file) => {
                    return { file }
                })
            )
            setUploadProgress(Array.from({length: event?.target?.files ? event?.target?.files.length : 0}, () => 0))
        },
    [files])
    const handleUpload = useCallback(() => {
        if (!filepath || !dbpath) return
        files.map((f, i) => {
            const fileNameSplit = f.file.name.split('.')
            const ext = fileNameSplit.pop()
            const fileName = uuid() + '-' + Date.now() + '.' + ext
            const filePath = `${filepath}/${fileName}`
            const currentRef = storageRef(storage, filePath)
            const uploadTask = uploadBytesResumable(currentRef, f.file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress((prevProgress) => {
                        const newProgress = [...prevProgress]
                        newProgress[i] = Math.round(progress)
                        return newProgress
                    })
                },
                (error) => {
                    setUploadError((prevErrors) => {
                        const newErrors = [...prevErrors]
                        newErrors[i] = intl.formatMessage({
                            id: error.code || 'storage/unknown',
                        })
                        return newErrors
                    })
                    setUploadedFiles((oldUploadedFiles) => {
                        return [
                            ...oldUploadedFiles,
                            {
                                name: files[i].file.name,
                                url: 'error',
                                path: filePath,
                                date: new Date().getTime(),
                            },
                        ]
                    })
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setUploadedFiles((oldUploadedFiles) => {
                                return [
                                    ...oldUploadedFiles,
                                    {
                                        name: files[i].file.name,
                                        url: downloadURL,
                                        path: filePath,
                                        date: new Date().getTime()
                                    },
                                ]
                            })
                        }
                    )
                }
            )
            return null
        })
    }, [files, filepath])

    useEffect(() => {
        if (files.length > 0 && files.length === uploadedFiles.length) {
            update(
                ref(db, dbpath),
                {
                    files: [...currentFiles, ...uploadedFiles.filter((uf) => uf.url !== 'error')],
                }
            )
            const count = uploadedFiles.filter((uf) => uf.url !== 'error').length
            const errors = uploadedFiles.filter((uf) => uf.url === 'error').length // TODO: set error message
            enqueueSnackbar(intl.formatMessage({
                id: count === 0 ? 'app.UploadedNoDocumentsSuccess' : count === 1 ? 'app.UploadedOneDocumentSuccess' : 'app.UploadedManyDocumentsSuccess',
            }, { count }), { variant: 'success' })
            if (errors === 0) clearFiles()
        }
    }, [uploadedFiles, files, currentFiles])
    const clearFiles = useCallback(() => {
        setFiles([])
        setUploadError([])
        setUploadProgress([])
        setUploadedFiles([])
    }, [])

    return { files, clearFiles, handleAddFiles, handleUpload, uploadError, uploadProgress }
}

export default useUpload