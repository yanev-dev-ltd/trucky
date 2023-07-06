import { ReactNode, MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'
import { UploadedFile } from '@/components/common/Upload/types'
export type Client = {
    key: string
    new?: ReactNode
    name?: string
    contactPerson?: string
    address?: string
    phone?: string
    email?: string
    files?: UploadedFile[]
    notes?: string
}

export type ClientsProps = {
    clientId: string | undefined
    edit?: string | undefined
    clients: Client[],
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Client>
    columns: Column<Client>[]
}

export type useClientsProps = {
    clientId: string | undefined
    edit?: string | undefined
}