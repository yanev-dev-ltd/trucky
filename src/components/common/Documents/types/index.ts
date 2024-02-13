import { ChangeEvent } from 'react'

export type DocumentType = 'vehicle' | 'trailer' | 'driver' | 'maintenance' | 'client'
export type useDocumentsProps = {
    type: DocumentType
    typeId: string
    light?: boolean
}

export type Document = {
    key: string
    path?: string
    name?: string
    url?: string
    date?: number
    title?: string
    userId?: string
    type?: DocumentType
    typeId?: string
    reminderDate?: number | null
    status?: string
}

export type DocumentsProps = {
    documents: Document[]
    locale: Locale
    downloadFile: (f: Document) => void
    setEditFile: (f: Document | undefined) => void
    editFile?: Document
    type: DocumentType
    handleAddFiles: (event: ChangeEvent<HTMLInputElement>) => void
    clearFiles: () => void
    filesToUpload: File[]
    handleUpload: () => void
    uploadProgress: number[]
    uploadError: string[]
    titles: string[]
    setTitles: (titles: string[]) => void
    reminderDates: (number | null)[]
    setReminderDates: (reminderDates: (number | null)[]) => void
    isLoading: boolean
    light?: boolean
}