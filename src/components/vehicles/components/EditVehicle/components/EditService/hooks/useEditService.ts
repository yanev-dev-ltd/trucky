import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { ref, update, remove } from 'firebase/database'
import { db, auth } from '../../../../../../../services/firebase'
import { Service } from '../../../../../types'

const useEditService = (service: Service | undefined) => {
    const [editedService, setEditedService] = useState(service)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedService(service), [service])

    const setField = useCallback((field: string, value: string | number | null) => {
        setEditedService((oldService) => {
            return {...oldService, [field]: value}
        })
    }, [])

    const saveService = useCallback(() => {
        if (!auth?.currentUser?.uid || !editedService?.key) return
        try {
            update(ref(db, 'service/' + auth?.currentUser?.uid + '/' + editedService?.key), {
                cost: editedService.cost || '',
                date: editedService.date || '',
                driver: editedService.driver || '',
                place: editedService.place || '',
                reminderDate: editedService.reminderDate || '',
                reminderMileage: editedService.reminderMileage || '',
                type: editedService.type,
                part: editedService.part || '',
                vehicle: editedService.vehicle
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
            }), { variant: 'error' })
        }
    }, [editedService])

    const deleteService = useCallback(() => {
        if (!editedService?.key || !auth?.currentUser?.uid) return
        try {
            remove(ref(db, 'service/' + auth.currentUser.uid + '/' + editedService?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedServiceSuccess',
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedServiceError',
            }), { variant: 'error' })
        }
    }, [editedService?.key])

    return { editedService, setField, saveService, deleteService }
}

export default useEditService