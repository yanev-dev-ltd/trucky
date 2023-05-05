import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useDrivers from './hooks/useDrivers'
import DriversView from './views/DriversView'
import { useDriversProps } from './types'

export const Drivers: FC<useDriversProps> = wrap(DriversView, useDrivers)
