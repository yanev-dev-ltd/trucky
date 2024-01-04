import { useCallback, useState, useEffect } from 'react'
import { useAddGroupProps } from '../types'
import { firestore, auth } from '@/services/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

const useAddGroup = ({ onSave, setOpen, open, type }: useAddGroupProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [newGroup, setNewGroup] = useState({})
    const [newGroupLoading, setNewGroupLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!auth.currentUser?.uid) return
        if (!open) {
            setNewGroupLoading(false)
            setNewGroup({})
        }
        if (typeof open === 'string') changeField('name', open)
    }, [open])

    const save = useCallback(async () => {
        if (!auth.currentUser?.uid || !type) return
        setNewGroupLoading(true)
        try {
            const docRef = await addDoc(collection(firestore, 'groups'), { ...newGroup, userId: auth.currentUser?.uid, type })
            onSave && docRef.id && onSave(docRef.id)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.GroupAdded',
            }), { variant: 'success' })
        } catch (error) {
            console.log(error)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.AddingGroup',
            }), { variant: 'error', persist: true })
        } finally {
            setNewGroupLoading(false)
            setOpen(false)
        }
    }, [onSave, newGroup, auth.currentUser?.uid, type])

    const changeField = useCallback((field: string, value: string) => {
        setNewGroup(oldGroup => {
            return { ...oldGroup, [field]: value  }
        })
    }, [])
    return { save, setOpen, open, changeField, newGroup, newGroupLoading, type }
}

export default useAddGroup