import { Document } from '@/components/common/Documents/types';
import { MutableRefObject } from 'react'
import Fuse from 'fuse.js'
import { Column } from 'react-table'

export type DocumentsProps = {
    documents: Document[]
    documentId: string | undefined
    searchRef: MutableRefObject<HTMLInputElement | null>
    fuse: Fuse<Document>
    columns: Column<Document>[]
    edit: string | undefined
}

export type useDocumentsProps = {
    documentId: string | undefined
    edit?: string | undefined
}
