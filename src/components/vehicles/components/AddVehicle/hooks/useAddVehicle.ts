import { useState, useCallback, useEffect } from 'react'
import { auth, firestore } from '@/services/firebase'
import { useRouter } from 'next/router'
import { useAddVehicleProps, NewVehicle } from '../types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { collection, addDoc } from 'firebase/firestore'

const useAddVehicle = (): useAddVehicleProps => {
    const intl = useIntl()
    const { settings } = useSelector((state: RootState) => state.settings)
    const { enqueueSnackbar } = useSnackbar()
    const [newVehicleId, setNewVehicleId] = useState<string | null>(null)
    const [newVehicleLoading, setNewVehicleLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [newVehicle, setNewVehicle] = useState<NewVehicle>({ units: settings.units || 'km' })
    const router = useRouter()
    const handleAddVehicle = useCallback(() => {
        if (!auth.currentUser?.uid) return
        setOpen(true)
    },[auth.currentUser?.uid])

    const handleClose = useCallback(() => {
        setOpen(false)
        setNewVehicleLoading(false)
        setNewVehicle({ units: settings.units || 'km' })
    },[])

    const changeField = useCallback((field: string, value: string) => {
        setNewVehicle(oldVehicle => {
            return oldVehicle ? { ...oldVehicle, [field]: value  } : { [field]: value }
        })
    }, [])

    const addVehicle = async () => {
        if (!auth.currentUser?.uid || !newVehicle?.name || !newVehicle?.type || !newVehicle?.fuel || !newVehicle?.units) return
        setNewVehicleLoading(true)
        try {
            const refDoc = await addDoc(collection(firestore, 'vehicles'), { ...newVehicle, userId: auth.currentUser.uid })
            handleClose()
            router.push('/vehicles/' + refDoc.id)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.VehicleAdded',
            }), { variant: 'success' })
        } catch (error) {
            handleClose()
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.AddingVehicle',
            }), { variant: 'error', persist: true })
        } finally {
            setNewVehicleLoading(false)
        }
    }

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'n' && event.ctrlKey) {
                event.preventDefault()
                handleAddVehicle()
            }
        }
        document.addEventListener('keydown',handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress)
    }, [])

    return {
        open,
        handleClose,
        handleAddVehicle,
        changeField,
        addVehicle,
        newVehicle,
        newVehicleLoading,
    }
}

export default useAddVehicle