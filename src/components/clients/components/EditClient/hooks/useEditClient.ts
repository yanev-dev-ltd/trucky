import { useState, useEffect, useCallback } from 'react'
import { useEditClientProps, EditClientProps } from '../types'
import { Client } from '@/components/clients/types'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'

const useEditClient = ({ client, edit }: useEditClientProps) : EditClientProps => {
    const [editedClient, setEditedClient] = useState<Client | undefined>(client)
    const router = useRouter()
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => setEditedClient(client), [client])

    const saveClientField = useCallback(async (field: keyof Client) => {
        if (!client?.key || !auth?.currentUser?.uid) return
        try {
            await updateDoc(doc(firestore, 'clients', client.key), { [field]: editedClient?.[field]})
            enqueueSnackbar(intl.formatMessage({
                id: `app.Saved.${field}`,
            }), { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.Error.saving',
            }), { variant: 'error', persist: true })
        }
        router.push('/clients/' + client.key)
    }, [editedClient])

    const reset = useCallback(() => {
        setEditedClient(client)
    }, [setEditedClient, client])

    const deleteClient = useCallback(async () => {
        if (!client.key) return
        try {
            await deleteDoc(doc(firestore, 'clients', client.key))
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedClientSuccess',
            }), { variant: 'success' })
            router.push('/clients')
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: 'app.DeletedClientError',
            }), { variant: 'error', persist: true })
        }
    }, [client?.key])
    return {
        client,
        edit,
        reset,
        saveClientField,
        setEditedClient,
        editedClient,
        deleteClient
    }
}

export default useEditClient