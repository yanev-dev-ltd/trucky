import { useCallback } from 'react'
import { UploadedFile } from '@/components/common/Upload/types'
import { saveAs } from 'file-saver'
import { ref as storageRef, getBlob, deleteObject } from 'firebase/storage'
import { db, auth, storage } from '@/services/firebase'
import { ref, update } from 'firebase/database'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'

const useFiles = () => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const downloadFile = useCallback(async (f: UploadedFile) => {
        saveAs(await getBlob(storageRef(storage, f.path)), f.name)
    }, [])

    const deleteFile = useCallback(
        (f: UploadedFile, dbpath: string, files: UploadedFile[]) => {
            if (!auth?.currentUser?.uid || !files) return
            const desertRef = storageRef(storage, f.path)
            deleteObject(desertRef)
                .then(() => {
                    update(
                        ref(
                            db,
                            dbpath
                        ),
                        { files: files.filter((uf) => uf.path !== f.path) || [] }
                    )
                    enqueueSnackbar(intl.formatMessage({
                        id: 'app.DeletedDocumentSuccess',
                    }), { variant: 'success' })
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