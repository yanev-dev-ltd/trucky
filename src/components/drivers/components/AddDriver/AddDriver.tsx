import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddDriver from './hooks/useAddDriver'
import AddDriverView from './views/AddDriverView'
import { useAddDriverProps } from './types'

export const AddDriver: FC<useAddDriverProps> = wrap(
    AddDriverView,
    useAddDriver
)
