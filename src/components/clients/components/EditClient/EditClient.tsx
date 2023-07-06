import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useEditClient from './hooks/useEditClient'
import EditClientView from './views/EditClientView'
import { useEditClientProps } from './types'

export const EditClient: FC<useEditClientProps> = wrap(
    EditClientView,
    useEditClient
)
