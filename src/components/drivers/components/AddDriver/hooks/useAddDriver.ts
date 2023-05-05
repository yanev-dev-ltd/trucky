import { useCallback, useState, useEffect } from 'react'
import { useAddDriverProps } from '../types'
import { Driver } from '../../../types'
import { db, auth } from '@/services/firebase'
import { ref, update, push } from 'firebase/database'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

const useAddDriver = ({ onSave, setOpen, open }: useAddDriverProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [newDriver, setNewDriver] = useState({})
    const [newDriverLoading, setNewDriverLoading] = useState<boolean>(false)
    useEffect(() => {
        if (!auth.currentUser?.uid) return
        if (!open) {
            setNewDriverLoading(false)
            setNewDriver({})
        }
    }, [open])

    const save = useCallback(() => {
        if (!auth.currentUser?.uid) return
        setNewDriverLoading(true)
        try {
            const postDriverRef = ref(db, 'drivers/' + auth.currentUser.uid)
            const newDriverRef = push(postDriverRef)
            update(ref(db, 'drivers/' + auth.currentUser.uid + '/' + newDriverRef.key), newDriver)
            onSave && onSave(newDriverRef.key || '')
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DriverSaved',
            }), { variant: 'success' })
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