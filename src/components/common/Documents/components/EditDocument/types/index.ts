import { Edit } from '@mui/icons-material';
import { Document } from '../../../types'

export type useEditDocumentsProps = {
    editDocument: Document | undefined
    setEditDocument: (document: Document | undefined) => void
}

export type EditDocumentProps = {
    document: Document | undefined
    setDocument: (document: Document | undefined) => void
    isLoading: boolean
    saveDocument: () => void
    cancel: () => void
    deleteDocument: () => void
    setConfirmDeleteDocument: (confirmDeleteDocument: boolean) => void
    confirmDeleteDocument: boolean
}