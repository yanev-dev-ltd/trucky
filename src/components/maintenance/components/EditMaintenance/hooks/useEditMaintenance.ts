import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '@/services/firebase'
import { Maintenance } from '@/components/maintenance/types'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEditMaintenanceProps } from '../types'
import { on } from 'events'

const useEditMaintenance = ({ maintenance, edit, onClose, onCancel, onEdit }: useEditMaintenanceProps) => {
    const [editedMaintenance, setEditedMaintenance] = useState(maintenance)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()
    useEffect(() => setEditedMaintenance(maintenance), [maintenance])

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
        if (!editedMaintenance?.key || !auth?.currentUser?.uid) return
        try {
            await deleteDoc(doc(firestore, 'maintenances', editedMaintenance?.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceSuccess',
            }), { variant: 'success' })
            onClose()
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedMaintenanceError',
            }), { variant: 'error', persist: true })
        }
    }, [editedMaintenance?.key])

    return { maintenance, saveMaintenanceField, setEditedMaintenance, editedMaintenance, deleteMaintenance, edit, reset, onClose, onCancel, onEdit }
}

export default useEditMaintenance