import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, useDocumentsProps } from '../types'
import { bg, enUS } from 'date-fns/locale'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { firestore, auth, storage } from '@/services/firebase'
import useFiles from './useFiles'
import { v4 as uuid } from 'uuid'
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { useIntl } from 'react-intl'
import { addDoc, collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

const useDocuments = ({ type, typeId, light }: useDocumentsProps) => {
    const { downloadFile } = useFiles()
    const intl = useIntl()
    const [filesToUpload, setFilesToUpload] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<number[]>([])
    const [editFile, setEditFile] = useState<Document | undefined>(undefined)
    const [uploadError, setUploadError] = useState<string[]>([])
    const [titles, setTitles] = useState<string[]>([])
    const [reminderDates, setReminderDates] = useState<(number | null)[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const readyRef = useRef(true)
    const { enqueueSnackbar } = useSnackbar()
    const { settings } = useSelector((state: RootState) => state.settings)
    const [documents, setDocuments] = useState<Document[]>([])
    const locale = useMemo(() => {
        switch (settings?.locale) {
            case 'bg':
                return bg
            default:
                return enUS
        }
    }, [settings?.locale])

    useEffect(() => {
        if (!auth.currentUser?.uid || !typeId) {
            return
        }
        setIsLoading(true)
        const conditions = [where('userId', '==', auth.currentUser?.uid), where('typeId', '==', typeId)]
        const qd = query(
            collection(firestore, 'documents'),
            ...conditions,
            orderBy('date', 'desc'))
        const unsubscribeDocuments = onSnapshot(qd, (querySnapshot) => {
            const documents: Document[] = []
            querySnapshot.forEach((doc) => {
                documents.push({key: doc.id, ...doc.data()})
            })
            setDocuments(documents)
            setIsLoading(false)
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        return () => {
            unsubscribeDocuments()
        }
    }, [auth.currentUser?.uid, typeId])

    const clearFiles = useCallback(() => {
        setTitles([])
        setReminderDates([])
        setFilesToUpload([])
        setUploadError([])
        setUploadProgress([])
        setUploadedFiles([])
        setIsLoading(false)
    }, [])

    const handleAddFiles = useCallback( 
        (event: ChangeEvent<HTMLInputElement>) => {
            clearFiles()
            if (
                !event ||
                !event.target ||
                !event.target.files ||
                event.target.files.length === 0
            ) {
                return
            }
            setFilesToUpload(
                Array.from(event?.target?.files || [])
            )
            setUploadProgress(Array.from({length: event?.target?.files ? event?.target?.files.length : 0}, () => 0))
        },
    [clearFiles])

    const handleUpload = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        setIsLoading(true)
        filesToUpload.map((f, i) => {
            const fileNameSplit = f?.name?.split('.') || []
            const ext = fileNameSplit.pop()
            const fileName = uuid() + '-' + Date.now() + '.' + ext
            const filePath = `user/${auth.currentUser?.uid}/${type}/${fileName}`
            const currentRef = storageRef(storage, filePath)
            const uploadTask = uploadBytesResumable(currentRef, f)
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
                                key: f.name,
                                name: f.name,
                                url: 'error',
                                path: filePath,
                                date: new Date().getTime(),
                            },
                        ]
                    })
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await addDoc(collection(firestore, "documents"), {
                                name: filesToUpload[i].name,
                                url: downloadURL,
                                path: filePath,
                                date: new Date().getTime(),
                                userId: auth.currentUser?.uid,
                                type,
                                typeId,
                                title: titles[i] || '',
                                reminderDate: reminderDates[i] || null,
                                status: 'active'
                            })
                            readyRef.current = true
                            setUploadedFiles((oldUploadedFiles) => {
                                return [
                                    ...oldUploadedFiles,
                                    {
                                        key: filesToUpload[i].name,
                                        name: filesToUpload[i].name,
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
    }, [filesToUpload, type, typeId, intl, titles, reminderDates])

    useEffect(() => {
        if (filesToUpload.length > 0 && filesToUpload.length === uploadedFiles.length && readyRef.current) {
            const count = uploadedFiles.filter((uf) => uf.url !== 'error').length
            const errors = uploadedFiles.filter((uf) => uf.url === 'error').length
            if (count > 0) {
                enqueueSnackbar(intl.formatMessage({
                    id: count === 1 ? 'app.UploadedOneDocumentSuccess' : 'app.UploadedManyDocumentsSuccess',
                }, { count }), { variant: 'success' })
            }
            if (errors > 0) {
                enqueueSnackbar(intl.formatMessage({
                    id: errors === 1 ? 'app.UploadedOneDocumentError' : 'app.UploadedManyDocumentsError',
                }, { errors }), { variant: 'error' })
            }
            clearFiles()   
            readyRef.current = false
        }
    }, [uploadedFiles, filesToUpload, readyRef.current, intl, enqueueSnackbar, clearFiles])

    return {
        documents,
        locale,
        downloadFile,
        editFile,
        setEditFile,
        type,
        handleAddFiles,
        clearFiles,
        filesToUpload,
        handleUpload,
        uploadProgress,
        uploadError,
        titles,
        setTitles,
        reminderDates,
        setReminderDates,
        isLoading,
        light,
    }
}

export default useDocuments