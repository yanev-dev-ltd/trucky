import { useState } from 'react'
import { db, auth } from '../../../../../services/firebase'
import { ref, update, push } from 'firebase/database'
import { useRouter } from 'next/router'
import { useAddVehicleProps } from '../types'

const useAddVehicle = (): useAddVehicleProps => {
    const [newVehicleId, setNewVehicleId] = useState<string | null>(null)
    const [newVehicleLoading, setNewVehicleLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [newVehicleName, setNewVehicleName] = useState<string | undefined>()
    const router = useRouter()
    const handleAddVehicle = () => {
        if (!auth.currentUser?.uid) return
        const postVehicleRef = ref(db, 'vehicles/' + auth.currentUser.uid)
        const newVehicleRef = push(postVehicleRef)
        setNewVehicleId(newVehicleRef?.key)
        setOpen(true)
    }

    const handleClose = () => {
        setNewVehicleId(null)
        setOpen(false)
        setNewVehicleLoading(false)
        setNewVehicleName(undefined)
    }

    const addVehicle = () => {
        if (!auth.currentUser?.uid || !newVehicleId) return
        setNewVehicleLoading(true);
        try {
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + newVehicleId), { name: newVehicleName })
            handleClose()
            router.push('/vehicles/' + newVehicleId)
        } catch (error) {
            handleClose()
            console.log(error)
        }
    }

    return {
        open,
        handleClose,
        handleAddVehicle,
        setNewVehicleName,
        addVehicle,
        newVehicleName,
        newVehicleLoading,
    }
}

export default useAddVehicle