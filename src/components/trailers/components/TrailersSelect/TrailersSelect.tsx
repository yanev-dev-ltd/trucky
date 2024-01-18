import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useTrailersSelect from './hooks/useTrailersSelect'
import TrailersSelectView from './views/TrailersSelectView'
import { useTrailersSelectProps } from './types'

export const TrailersSelect: FC<useTrailersSelectProps> = wrap(
    TrailersSelectView,
    useTrailersSelect
)
