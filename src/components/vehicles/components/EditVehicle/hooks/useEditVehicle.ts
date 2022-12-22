import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '../../../types'
import { db, auth } from '../../../../../services/firebase'
import { ref, update } from 'firebase/database'
import { useRouter } from 'next/router'

const useEditVehicle = (vehicle: Vehicle | undefined) => {
    const [editedVehicle, setEditedVehicle] = useState<Vehicle | undefined>(vehicle)
    const router = useRouter()
    useEffect(() => setEditedVehicle(vehicle), [vehicle])
    const saveVehicleField = useCallback((field: keyof Vehicle) => {
        if (!vehicle?.key || !auth?.currentUser?.uid) return
        update(ref(db, 'vehicles/' + auth?.currentUser?.uid + '/' + vehicle.key), {
            [field]: editedVehicle?.[field],
        })
        router.push('/vehicles/' + vehicle.key)
    }, [editedVehicle])
    const reset = useCallback(() => {
        setEditedVehicle(vehicle)
    }, [setEditedVehicle, vehicle])

    return { saveVehicleField, editedVehicle, setEditedVehicle, reset }
}

export default useEditVehicle