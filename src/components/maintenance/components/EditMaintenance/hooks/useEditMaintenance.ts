import { useState, useCallback, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '@/services/firebase'
import { Maintenance } from '@/components/maintenance/types'
import { deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { useEditMaintenanceProps } from '../types'
import useFiles from '@/hooks/useFiles'

const useEditMaintenance = ({ maintenance = { units: '' }, edit, onClose, onCancel, onEdit }: useEditMaintenanceProps) => {
    const [editedMaintenance, setEditedMaintenance] = useState<Maintenance>(maintenance)
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const { downloadFile, deleteFile } = useFiles()
    const files = JSON.parse(maintenance?.files || '[]')

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

    return {
        maintenance,
        saveMaintenanceField,
        setEditedMaintenance,
        editedMaintenance,
        deleteMaintenance,
        edit,
        reset,
        onClose,
        onCancel,
        onEdit,
        deleteFile,
        downloadFile,
        files,
    }
}

export default useEditMaintenance