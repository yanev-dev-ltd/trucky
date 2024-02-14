import { ro } from 'date-fns/locale';
import { useState, useCallback, useEffect } from 'react'
import { useEditDocumentsProps } from '../types'
import { Document } from '../../../types'
import { auth, firestore, storage } from '@/services/firebase'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { useRouter } from 'next/router';

const useEditDocument = ({ editDocument, setEditDocument, redirectTo }: useEditDocumentsProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [document, setDocument] = useState<Document | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [confirmDeleteDocument, setConfirmDeleteDocument] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        setDocument(editDocument)
    }, [editDocument])

    const cancel = useCallback(() => {
        setDocument(undefined)
        setEditDocument && setEditDocument(undefined)
        setConfirmDeleteDocument(false)
        if (redirectTo) {
            router.push(redirectTo)
        }
    }, [redirectTo])

    const saveDocument = useCallback(async () => {
        if (!document?.key || !auth?.currentUser?.uid) return
        const { key, ...rest } = document
        setIsLoading(true)
        try {
            await updateDoc(doc(firestore, 'documents', document.key), {
                ...rest,
                date: new Date().getTime(),
                status: document.reminderDate === editDocument?.reminderDate ? document.status || 'active' : 'active'})
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.document`,
            }), { variant: 'success' })
            cancel()
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        setIsLoading(false)
    }, [document, setIsLoading, setEditDocument])

    const deleteDocument = useCallback(async () => {
        if (!document?.key || !auth?.currentUser?.uid) return
        setIsLoading(true)
        const desertRef = storageRef(storage, document.path)
            deleteObject(desertRef)
                .then(async () => {
                    try {
                        await deleteDoc(doc(firestore, 'documents', document?.key))
                        enqueueSnackbar(intl.formatMessage({
                            id: 'app.DeletedDocumentSuccess',
                        }), { variant: 'success' })
                        cancel()
                    } catch (err) {
                        enqueueSnackbar(intl.formatMessage({
                            id: 'app.Error.deletingDocument',
                        }), { variant: 'error', persist: true })
                    }
                })
                .catch(() => enqueueSnackbar(intl.formatMessage({
                    id: 'app.Error.deletingDocument',
                }), { variant: 'error', persist: true }))
                .finally(() => setIsLoading(false))
    }, [document])
    return { document, setDocument, isLoading, saveDocument, cancel, deleteDocument, confirmDeleteDocument, setConfirmDeleteDocument }
}

export default useEditDocument