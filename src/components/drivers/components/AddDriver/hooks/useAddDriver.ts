import { useCallback, useState, useEffect } from 'react'
import { useAddDriverProps } from '../types'
import { firestore, auth } from '@/services/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

const useAddDriver = ({ onSave, setOpen, open, redirectToEdit }: useAddDriverProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [newDriver, setNewDriver] = useState({})
    const [newDriverLoading, setNewDriverLoading] = useState<boolean>(false)
    const router = useRouter()
    useEffect(() => {
        if (!auth.currentUser?.uid) return
        if (!open) {
            setNewDriverLoading(false)
            setNewDriver({})
        }
        if (typeof open === 'string') changeField('name', open)
    }, [open])

    const save = useCallback(async () => {
        if (!auth.currentUser?.uid) return
        setNewDriverLoading(true)
        try {
            const docRef = await addDoc(collection(firestore, 'drivers'), { ...newDriver, userId: auth.currentUser?.uid })
            onSave && docRef.id && onSave(docRef.id)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DriverAdded',
            }), { variant: 'success' })
            redirectToEdit && router.push(`/drivers/${docRef.id}`)
        } catch (error) {
            console.log(error)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.AddingDriver',
            }), { variant: 'error', persist: true })
        } finally {
            setNewDriverLoading(false)
            setOpen(false)
        }
    }, [onSave, newDriver])

    const changeField = useCallback((field: string, value: string) => {
        setNewDriver(oldDriver => {
            return { ...oldDriver, [field]: value  }
        })
    }, [])
    return { save, setOpen, open, changeField, newDriver, newDriverLoading }
}

export default useAddDriver