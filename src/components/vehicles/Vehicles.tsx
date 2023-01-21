import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useVehicles from './hooks/useVehicles'
import { VehiclesView } from './views/VehiclesView'
import { useVehicleProps } from './types'

export const Vehicles: FC<useVehicleProps> = wrap(VehiclesView, useVehicles)
