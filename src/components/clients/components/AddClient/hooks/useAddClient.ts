import { useCallback, useState, useEffect } from 'react'
import { useAddClientProps } from '../types'
import { db, auth } from '@/services/firebase'
import { ref, update, push } from 'firebase/database'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

const useAddClient = ({ onSave, setOpen, open, redirectToEdit }: useAddClientProps) => {
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const [newClient, setNewClient] = useState({})
    const [newClientLoading, setNewClientLoading] = useState<boolean>(false)
    const router = useRouter()
    useEffect(() => {
        if (!auth.currentUser?.uid) return
        if (!open) {
            setNewClientLoading(false)
            setNewClient({})
        }
        if (typeof open === 'string') changeField('name', open)
    }, [open])

    const save = useCallback(() => {
        if (!auth.currentUser?.uid) return
        setNewClientLoading(true)
        try {
            const postClientRef = ref(db, 'clients/' + auth.currentUser.uid)
            const newClientRef = push(postClientRef)
            update(ref(db, 'clients/' + auth.currentUser.uid + '/' + newClientRef.key), newClient)
            onSave && newClientRef.key && onSave(newClientRef.key)
            enqueueSnackbar(intl.formatMessage({
                id: 'app.ClientAdded',
            }), { variant: 'success' })
            redirectToEdit && router.push(`/clients/${newClientRef.key}`)
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.AddingClient',
            }), { variant: 'error', persist: true })
        } finally {
            setNewClientLoading(false)
            setOpen(false)
        }
    }, [onSave, newClient])

    const changeField = useCallback((field: string, value: string) => {
        setNewClient(oldClient => {
            return { ...oldClient, [field]: value  }
        })
    }, [])
    return { save, setOpen, open, changeField, newClient, newClientLoading }
}

export default useAddClient