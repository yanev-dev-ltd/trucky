import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddTrailer from './hooks/useAddTrailer'
import AddTrailerView from './views/AddTrailerView'
import { useAddTrailerProps } from './types'

export const AddTrailer: FC<useAddTrailerProps> = wrap(
    AddTrailerView,
    useAddTrailer
)
