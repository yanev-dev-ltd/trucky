import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useEditDocument from './hooks/useEditDocument'
import { EditDocumentView } from './views/EditDocumentView'
import { useEditDocumentsProps } from './types'

export const EditDocument: FC<useEditDocumentsProps> = wrap(
    EditDocumentView,
    useEditDocument
)
