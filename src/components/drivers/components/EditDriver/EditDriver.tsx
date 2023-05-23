import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useEditDriver from './hooks/useEditDriver'
import EditDriverView from './views/EditDriverView'
import { useEditDriverProps } from './types'

export const EditDriver: FC<useEditDriverProps> = wrap(
    EditDriverView,
    useEditDriver
)
