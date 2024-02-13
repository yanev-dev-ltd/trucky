import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useDocuments from './hooks/useDocuments'
import { DocumentsView } from './views/DocumentsView'
import { useDocumentsProps } from './types'

export const Documents: FC<useDocumentsProps> = wrap(DocumentsView, useDocuments)
