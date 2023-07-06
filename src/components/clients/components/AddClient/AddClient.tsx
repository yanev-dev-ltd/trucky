import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddClient from './hooks/useAddClient'
import AddClientView from './views/AddClientView'
import { useAddClientProps } from './types'

export const AddClient: FC<useAddClientProps> = wrap(
    AddClientView,
    useAddClient
)
