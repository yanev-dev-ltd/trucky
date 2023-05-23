import { useState, useEffect, useCallback } from 'react'
import { useEditDriverProps, EditDriverProps } from '../types'
import { Driver } from '@/components/drivers/types'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { db, auth, storage } from '@/services/firebase'
import { ref, update } from 'firebase/database'
import { UploadedFile } from '@/components/common/Upload/types'
import { saveAs } from 'file-saver'
import { ref as storageRef, deleteObject, getBlob } from 'firebase/storage'

const useEditDriver = ({ driver, edit }: useEditDriverProps) : EditDriverProps => {
    const [editedDriver, setEditedDriver] = useState<Driver | undefined>(driver)
    const router = useRouter()
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedDriver(driver), [driver])

    const saveDriverField = useCallback((field: keyof Driver) => {
        if (!driver?.key || !auth?.currentUser?.uid) return
        try {
            update(ref(db, 'drivers/' + auth?.currentUser?.uid + '/' + driver.key), {
                [field]: editedDriver?.[field],
            })
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.${field}`,
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        router.push('/drivers/' + driver.key)
    }, [editedDriver])

    const reset = useCallback(() => {
        setEditedDriver(driver)
    }, [setEditedDriver, driver])

    const downloadFile = useCallback(async (f: UploadedFile) => {
        saveAs(await getBlob(storageRef(storage, f.path)), f.name)
    }, [])

    const deleteUploadedFile = useCallback(
        (f: UploadedFile) => {
            if (!driver || !driver.key || !auth?.currentUser?.uid || !driver?.files) return
            const desertRef = storageRef(storage, f.path)
            deleteObject(desertRef)
                .then(() => {
                    const files = driver?.files
                        ? driver?.files.filter((uf) => uf.path !== f.path)
                        : []
                    update(
                        ref(
                            db,
                            'drivers/' +
                                auth?.currentUser?.uid +
                                '/' +
                                driver.key
                        ),
                        { files }
                    )
                    enqueueSnackbar(intl.formatMessage({
                        id: 'app.DeletedDocumentSuccess',
                    }), { variant: 'success' })
                })
                .catch(() => enqueueSnackbar(intl.formatMessage({
                    id: 'app.Error.deletingDocument',
                }), { variant: 'error', persist: true }))
        },
        [intl, driver]
    )

    const deleteDriver = useCallback(() => {
        console.log('delete driver: ',driver.key)
        // TODO: set driver as deleted with db flag
    }, [driver?.key])
    return {
        driver,
        edit,
        reset,
        saveDriverField,
        setEditedDriver,
        editedDriver,
        downloadFile,
        deleteUploadedFile,
        deleteDriver
    }
}

export default useEditDriver