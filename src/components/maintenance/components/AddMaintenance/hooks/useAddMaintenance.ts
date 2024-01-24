import { useState, useCallback, useEffect, SyntheticEvent } from 'react'
import { Maintenance } from '@/components/maintenance/types'
import { useAddMaintenanceProps } from '../types'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore, storage } from '@/services/firebase'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import useFiles from '@/hooks/useFiles'
import { UploadedFile } from '@/components/common/Upload/types'
import { ref as storageRef, deleteObject } from 'firebase/storage'

const useAddMaintenance = ({ drivers, vehicleId, units, fullButton, isTrailer}: useAddMaintenanceProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [newMaintenanceOpen, setNewMaintenanceOpen] = useState<string | false>(false)
    const { settings } = useSelector((state: RootState) => state.settings)
    const [files, setFiles] = useState<UploadedFile[]>([])
    const allVehicles = useSelector((state: RootState) => state.vehicles)
    const { downloadFile, deleteFile } = useFiles()
    const [maintenance, setMaintenance] = useState<Maintenance>({
        cost: null,
        date: new Date().getTime(),
        drivers: drivers || null,
        mileage: null,
        place: '',
        reminderDate: null,
        reminderMileage: null,
        type: '',
        part: '',
        description: '',
        vehicleId: '',
        units: allVehicles.find((v) => v.key === vehicleId)?.units || units,
        startMileage: allVehicles.find((v) => v.key === vehicleId)?.mileage || 0,
        notes: '',
        isTrailer: isTrailer || false,
        currency: settings?.currency || 'EUR',
    })

    const reset = () => {
        setMaintenance({
            cost: null,
            date: new Date().getTime(),
            drivers: drivers || null,
            mileage: null,
            place: '',
            reminderDate: null,
            reminderMileage: null,
            type: '',
            part: '',
            description: '',
            vehicleId: vehicleId || '',
            units: allVehicles.find((v) => v.key === vehicleId)?.units || units,
            startMileage: allVehicles.find((v) => v.key === vehicleId)?.mileage || 0,
            notes: '',
            isTrailer: false,
            currency: settings?.currency || 'EUR',
        })
    }

    useEffect(() => {
        if (!newMaintenanceOpen) return
        const unsub = onSnapshot(doc(firestore, "maintenances", newMaintenanceOpen), (doc) => {
            setFiles(JSON.parse(doc.data()?.files || '[]'))
        })
        return () => unsub()
    }, [newMaintenanceOpen])

    useEffect(() => {
        setMaintenance((oldMaintenance) => {
            return {...oldMaintenance, vehicleId: vehicleId}
        })
    }, [vehicleId])

    useEffect(() => {
        setMaintenance((oldMaintenance) => {
            const vehicle = allVehicles.find((v) => v.key === maintenance.vehicleId)
            return {...oldMaintenance, units: vehicle?.units || units, startMileage: vehicle?.mileage || 0}
        })
    }, [maintenance.vehicleId])

    const setField = useCallback((field: string, value: string | number | null | string[]) => {
        setMaintenance((oldMaintenance) => {
            return {...oldMaintenance, [field]: value}
        })
    }, [])

    const addMaintenance = useCallback(
        async (m: Maintenance) => {
            if (!auth?.currentUser?.uid || !maintenance.vehicleId || !newMaintenanceOpen) return
            try {
                await updateDoc(doc(firestore, 'maintenances', newMaintenanceOpen), { ...m, userId: auth.currentUser.uid})
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Saved.maintenance',
                    }),
                    { variant: 'success' }
                )
            } catch (error) {
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Error.saving',
                    }),
                    { variant: 'error', persist: true }
                )
            }
        },
        [maintenance]
    )

    const handleOpen = useCallback(async () => {
        if (!auth?.currentUser?.uid) return
        const refDoc = await addDoc(collection(firestore, 'maintenances'), { userId: auth.currentUser.uid })
        setNewMaintenanceOpen(refDoc.id)
    }, [])

    const handleNewMaintenanceClose = useCallback(() => {
        setNewMaintenanceOpen(false)
    }, [])

    const handleSubmit = useCallback((event: SyntheticEvent) => {
        event.preventDefault()
        if (!maintenance.type || !maintenance.vehicleId) return
        addMaintenance && addMaintenance(maintenance)
        handleClose(false)
    },[maintenance])

    const handleClose = useCallback(async (deleteMaintenance: boolean = true) => {
        if (deleteMaintenance && newMaintenanceOpen) {
            files.forEach(async (f) => {
                await deleteObject(storageRef(storage, f.path))
            })
            await deleteDoc(doc(firestore, 'maintenances', newMaintenanceOpen))
        }
        reset()
        handleNewMaintenanceClose && handleNewMaintenanceClose()
    }, [newMaintenanceOpen, files])

    return {
        setField,
        maintenance,
        units: maintenance.units,
        vehicleId,
        fullButton,
        handleOpen,
        handleClose,
        handleSubmit,
        newMaintenanceOpen,
        files,
        downloadFile,
        deleteFile,
    }
}

export default useAddMaintenance