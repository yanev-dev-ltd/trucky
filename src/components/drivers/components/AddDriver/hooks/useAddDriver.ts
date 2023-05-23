import { useCallback, useState, useEffect } from 'react'
import { useAddDriverProps } from '../types'
import { db, auth } from '@/services/firebase'
import { ref, update, push } from 'firebase/database'
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

    const save = useCallback(() => {
        if (!auth.currentUser?.uid) return
        setNewDriverLoading(true)
        try {
            const postDriverRef = ref(db, 'drivers/' + auth.currentUser.uid)
            const newDriverRef = push(postDriverRef)
            update(ref(db, 'drivers/' + auth.currentUser.uid + '/' + newDriverRef.key), newDriver)
            onSave && newDriverRef.key && onSave(newDriverRef.key)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DriverAdded',
            }), { variant: 'success' })
            redirectToEdit && router.push(`/drivers/${newDriverRef.key}`)
        } catch (error) {
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