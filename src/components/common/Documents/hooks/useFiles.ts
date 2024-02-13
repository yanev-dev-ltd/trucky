import { useCallback } from 'react'
import { saveAs } from 'file-saver'
import { ref as storageRef, getBlob, deleteObject } from 'firebase/storage'
import { firestore, auth, storage } from '@/services/firebase'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { deleteDoc, doc } from 'firebase/firestore'
import { Document } from '../types'

const useFiles = () => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const downloadFile = useCallback(async (f: Document) => {
        saveAs(await getBlob(storageRef(storage, f.path)), f.name)
    }, [])

    const deleteFile = useCallback(
        (f: Document) => {
            if (!auth?.currentUser?.uid) return
            const desertRef = storageRef(storage, f.path)
            deleteObject(desertRef)
                .then(async () => {
                    try {
                        await deleteDoc(doc(firestore, 'documents', f.key))
                        enqueueSnackbar(intl.formatMessage({
                            id: 'app.DeletedDocumentSuccess',
                        }), { variant: 'success' })
                    } catch (err) {
                        enqueueSnackbar(intl.formatMessage({
                            id: 'app.Error.deletingDocument',
                        }), { variant: 'error', persist: true })
                    }
                })
                .catch(() => enqueueSnackbar(intl.formatMessage({
                    id: 'app.Error.deletingDocument',
                }), { variant: 'error', persist: true }))
        },
        [intl]
    )
    return { downloadFile, deleteFile }
}

export default useFiles