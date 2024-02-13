import { Client } from '@/components/clients/types'
export type useEditClientProps = {
    client: Client
    edit: string | undefined
}
export type EditClientProps = {
    client: Client
    edit: string | undefined
    reset: () => void
    saveClientField: (field: keyof Client) => void
    setEditedClient: (client: Client | undefined) => void
    editedClient: Client | undefined
    deleteClient: () => void
}