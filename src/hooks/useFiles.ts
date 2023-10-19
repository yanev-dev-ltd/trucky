import { useCallback } from 'react'
import { UploadedFile } from '@/components/common/Upload/types'
import { saveAs } from 'file-saver'
import { ref as storageRef, getBlob, deleteObject } from 'firebase/storage'
import { firestore, auth, storage } from '@/services/firebase'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { updateDoc, doc } from 'firebase/firestore'

const useFiles = () => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const downloadFile = useCallback(async (f: UploadedFile) => {
        saveAs(await getBlob(storageRef(storage, f.path)), f.name)
    }, [])

    const deleteFile = useCallback(
        (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => {
            if (!auth?.currentUser?.uid || !files) return
            const desertRef = storageRef(storage, f.path)
            deleteObject(desertRef)
                .then(async () => {
                    try {
                        await updateDoc(doc(firestore, dbpath, dbkey), {
                            files: JSON.stringify(files.filter((uf) => uf.path !== f.path) || []),
                        })
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