import { useState, useCallback, useEffect } from 'react'
import { db, auth } from '@/services/firebase'
import { ref, update, push } from 'firebase/database'
import { useRouter } from 'next/router'
import { useAddVehicleProps, NewVehicle } from '../types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

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
        const postVehicleRef = ref(db, 'vehicles/' + auth.currentUser.uid)
        const newVehicleRef = push(postVehicleRef)
        setNewVehicleId(newVehicleRef?.key)
        setOpen(true)
    },[auth.currentUser?.uid])

    const handleClose = useCallback(() => {
        setNewVehicleId(null)
        setOpen(false)
        setNewVehicleLoading(false)
        setNewVehicle({ units: settings.units || 'km' })
    },[])

    const changeField = useCallback((field: string, value: string) => {
        setNewVehicle(oldVehicle => {
            return oldVehicle ? { ...oldVehicle, [field]: value  } : { [field]: value }
        })
    }, [])

    const addVehicle = () => {
        if (!auth.currentUser?.uid || !newVehicleId || !newVehicle?.name || !newVehicle?.type || !newVehicle?.fuel || !newVehicle?.units) return
        setNewVehicleLoading(true)
        try {
            update(ref(db, 'vehicles/' + auth.currentUser.uid + '/' + newVehicleId), newVehicle)
            handleClose()
            router.push('/vehicles/' + newVehicleId)
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