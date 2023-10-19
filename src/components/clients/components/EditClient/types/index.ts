import { Client } from '@/components/clients/types'
import { UploadedFile } from '@/components/common/Upload/types'
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
    downloadFile: (f: UploadedFile) => void
    deleteFile: (f: UploadedFile, dbpath: string, dbkey: string, files: UploadedFile[]) => void
    deleteClient: () => void
}