import { useState, useEffect, useCallback } from 'react'
import { useEditDriverProps, EditDriverProps } from '../types'
import { Driver } from '@/components/drivers/types'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { firestore, auth } from '@/services/firebase'
import { collection, updateDoc, doc, where, query, onSnapshot, deleteDoc } from 'firebase/firestore'
import { Group } from '@/components/common/Group/types'
import { setGroups } from '@/components/common/Group/redux'
import { useDispatch } from 'react-redux'

const useEditDriver = ({ driver, edit }: useEditDriverProps) : EditDriverProps => {
    const [editedDriver, setEditedDriver] = useState<Driver | undefined>(driver)
    const router = useRouter()
    const intl = useIntl()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedDriver(driver), [driver])

    useEffect(() => {
        if (!auth.currentUser?.uid || !driver?.key) {
            return
        }
        const qg = query(collection(firestore, 'groups'), where('userId', '==', auth.currentUser?.uid), where('type', '==', 'driver'))
        const unsubscribeGroups = onSnapshot(qg, (querySnapshot) => {
            const groups: Group[] = []
            querySnapshot.forEach((doc) => {
                groups.push({key: doc.id, ...doc.data()})
            })
            dispatch(setGroups(groups))
        }, (error) => enqueueSnackbar(error.message, { variant: 'error', persist: true }))
        return () => {
            unsubscribeGroups()
        }
    }, [auth.currentUser?.uid, driver?.key])

    const saveDriverField = useCallback(async (field: keyof Driver) => {
        if (!driver?.key || !auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'drivers', driver.key), { [field]: editedDriver?.[field]})
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

    const deleteDriver = useCallback(async () => {
        if (!driver.key) return
        try {
            await deleteDoc(doc(firestore, 'drivers', driver.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedDriverSuccess',
            }), { variant: 'success' })
            router.push('/drivers')
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedDriverError',
            }), { variant: 'error', persist: true })
        }
    }, [driver?.key])
    return {
        driver,
        edit,
        reset,
        saveDriverField,
        setEditedDriver,
        editedDriver,
        deleteDriver
    }
}

export default useEditDriver