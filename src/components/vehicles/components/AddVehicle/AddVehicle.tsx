import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddVehicle from './hooks/useAddVehicle'
import AddVehicleView from './views/AddVehicleView'
import { useAddVehicleProps } from './types'

export const AddVehicle: FC<useAddVehicleProps> = wrap(
    AddVehicleView,
    useAddVehicle
)
