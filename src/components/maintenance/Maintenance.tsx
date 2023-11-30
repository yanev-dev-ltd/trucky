import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useMaintenance from './hooks/useMaintenance'
import MaintenanceView from './views/MaintenanceView'
import { useMaintenanceProps } from './types'

export const Maintenance: FC<useMaintenanceProps> = wrap(
    MaintenanceView,
    useMaintenance
)
