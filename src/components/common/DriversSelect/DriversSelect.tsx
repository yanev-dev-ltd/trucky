import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useDriversSelect from './hooks/useDriversSelect'
import DriversSelectView from './views/DriversSelectView'
import { useDriversSelectProps } from './types'

export const DriversSelect: FC<useDriversSelectProps> = wrap(
    DriversSelectView,
    useDriversSelect
)
