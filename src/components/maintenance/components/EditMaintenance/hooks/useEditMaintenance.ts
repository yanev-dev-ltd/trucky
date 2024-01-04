import { useState, useCallback, useEffect, SetStateAction, Dispatch } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '@/services/firebase'
import { Maintenance } from '@/components/maintenance/types'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { useEditMaintenanceProps } from '../types'

const useEditMaintenance = ({ maintenance = { units: '' }, edit, onClose, onCancel, onEdit }: useEditMaintenanceProps) => {
    const [editedMaintenance, setEditedMaintenance] = useState(maintenance)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()

    const saveMaintenanceField = useCallback(async (field: keyof Maintenance) => {
        if (!maintenance?.key || !auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'maintenances', maintenance.key), { [field]: editedMaintenance?.[field]})
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.${field}`,
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        onCancel()
    }, [editedMaintenance])

    const reset = useCallback(() => {
        setEditedMaintenance(maintenance)
    }, [setEditedMaintenance, maintenance])

    const deleteMaintenance = useCallback(async () => {
        if (!maintenance?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'maintenances', maintenance?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceSuccess',
            }), { variant: 'success' })
            onClose()
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceError',
            }), { variant: 'error', persist: true })
        }
    }, [maintenance?.key, auth?.currentUser?.uid])

    return { maintenance, saveMaintenanceField, setEditedMaintenance, editedMaintenance, deleteMaintenance, edit, reset, onClose, onCancel, onEdit }
}

export default useEditMaintenance