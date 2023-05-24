import { useState, useEffect, useCallback } from 'react'
import { useEditDriverProps, EditDriverProps } from '../types'
import { Driver } from '@/components/drivers/types'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { db, auth } from '@/services/firebase'
import { ref, update } from 'firebase/database'
import useFiles from '@/hooks/useFiles'

const useEditDriver = ({ driver, edit }: useEditDriverProps) : EditDriverProps => {
    const [editedDriver, setEditedDriver] = useState<Driver | undefined>(driver)
    const router = useRouter()
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const { downloadFile, deleteFile } = useFiles()
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
        deleteFile,
        deleteDriver
    }
}

export default useEditDriver