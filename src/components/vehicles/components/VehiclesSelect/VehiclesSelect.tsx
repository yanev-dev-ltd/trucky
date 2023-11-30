import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useVehiclesSelect from './hooks/useVehiclesSelect'
import VehiclesSelectView from './views/VehiclesSelectView'
import { useVehiclesSelectProps } from './types'

export const VehiclesSelect: FC<useVehiclesSelectProps> = wrap(
    VehiclesSelectView,
    useVehiclesSelect
)
