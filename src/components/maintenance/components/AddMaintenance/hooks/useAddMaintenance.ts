import { useState, useCallback, useEffect } from 'react'
import { Maintenance } from '@/components/maintenance/types'
import { useAddMaintenanceProps } from '../types'
import { collection, addDoc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { auth, firestore } from '@/services/firebase'

const useAddMaintenance = ({ drivers, vehicleId, units, fullButton}: useAddMaintenanceProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
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
            vehicleId: vehicleId,
        })
    }

    useEffect(() => {
        setMaintenance((oldMaintenance) => {
            return {...oldMaintenance, vehicleId: vehicleId}
        })
    }, [vehicleId])

    const setField = useCallback((field: string, value: string | number | null | string[]) => {
        setMaintenance((oldMaintenance) => {
            return {...oldMaintenance, [field]: value}
        })
    }, [])

    const addMaintenance = useCallback(
        async (m: Maintenance) => {
            if (!auth?.currentUser?.uid || !maintenance.vehicleId) return
            try {
                await addDoc(collection(firestore, 'maintenances'), { ...m, userId: auth.currentUser.uid})
                enqueueSnackbar(
                    intl.formatMessage({
                        id: 'app.Saved.maintenance',
                    }),
                    { variant: 'success' }
                )
            } catch (error) {
                console.log(error)
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

    return { addMaintenance, setField, maintenance, reset, units, vehicleId, fullButton }
}

export default useAddMaintenance