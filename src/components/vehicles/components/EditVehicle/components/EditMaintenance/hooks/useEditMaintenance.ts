import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '@/services/firebase'
import { Maintenance } from '@/components/maintenance/types'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'

const useEditMaintenance = (maintenance: Maintenance | undefined) => {
    const [editedMaintenance, setEditedMaintenance] = useState(maintenance)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedMaintenance(maintenance), [maintenance])

    const setField = useCallback((field: string, value: string | number | null | string[]) => {
        setEditedMaintenance((oldMaintenance) => {
            return {...oldMaintenance, [field]: value}
        })
    }, [])

    const saveMaintenance = useCallback(async () => {
        if (!auth?.currentUser?.uid || !editedMaintenance?.key) return
        try {
            await updateDoc(doc(firestore, 'maintenance', editedMaintenance?.key), {
                cost: editedMaintenance.cost || '',
                date: editedMaintenance.date || '',
                drivers: editedMaintenance.drivers || [],
                place: editedMaintenance.place || '',
                reminderDate: editedMaintenance.reminderDate || '',
                reminderMileage: editedMaintenance.reminderMileage || '',
                type: editedMaintenance.type,
                part: editedMaintenance.part || '',
                vehicleId: editedMaintenance.vehicleId,
                userId: auth?.currentUser?.uid
            })
            enqueueSnackbar(
                intl.formatMessage({
                    id: 'app.Saved.maintenance',
                }),
                { variant: 'success' }
            )
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
    }, [editedMaintenance])

    const deleteMaintenance = useCallback(async () => {
        if (!editedMaintenance?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'maintenance', editedMaintenance?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceSuccess',
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceError',
            }), { variant: 'error', persist: true })
        }
    }, [editedMaintenance?.key])

    return { editedMaintenance, setField, saveMaintenance, deleteMaintenance }
}

export default useEditMaintenance