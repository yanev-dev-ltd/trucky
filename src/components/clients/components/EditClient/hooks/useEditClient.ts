import { useState, useEffect, useCallback } from 'react'
import { useEditClientProps, EditClientProps } from '../types'
import { Client } from '@/components/clients/types'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { firestore, auth } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import useFiles from '@/hooks/useFiles'

const useEditClient = ({ client, edit }: useEditClientProps) : EditClientProps => {
    const [editedClient, setEditedClient] = useState<Client | undefined>(client)
    const router = useRouter()
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const { downloadFile, deleteFile } = useFiles()
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

    const deleteClient = useCallback(() => {
        console.log('delete client: ',client.key)
        // TODO: set client as deleted with db flag
    }, [client?.key])
    return {
        client,
        edit,
        reset,
        saveClientField,
        setEditedClient,
        editedClient,
        downloadFile,
        deleteFile,
        deleteClient
    }
}

export default useEditClient