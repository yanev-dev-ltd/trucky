import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '../../../../../../../services/firebase'
import { Service } from '../../../../../types'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'

const useEditService = (service: Service | undefined) => {
    const [editedService, setEditedService] = useState(service)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedService(service), [service])

    const setField = useCallback((field: string, value: string | number | null | string[]) => {
        setEditedService((oldService) => {
            return {...oldService, [field]: value}
        })
    }, [])

    const saveService = useCallback(async () => {
        if (!auth?.currentUser?.uid || !editedService?.key) return
        try {
            await updateDoc(doc(firestore, 'services', editedService?.key), {
                cost: editedService.cost || '',
                date: editedService.date || '',
                drivers: editedService.drivers || [],
                place: editedService.place || '',
                reminderDate: editedService.reminderDate || '',
                reminderMileage: editedService.reminderMileage || '',
                type: editedService.type,
                part: editedService.part || '',
                vehicleId: editedService.vehicleId,
                userId: auth?.currentUser?.uid
            })
            enqueueSnackbar(
                intl.formatMessage({
                    id: 'app.Saved.service',
                }),
                { variant: 'success' }
            )
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
    }, [editedService])

    const deleteService = useCallback(async () => {
        if (!editedService?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'services', editedService?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedServiceSuccess',
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedServiceError',
            }), { variant: 'error', persist: true })
        }
    }, [editedService?.key])

    return { editedService, setField, saveService, deleteService }
}

export default useEditService