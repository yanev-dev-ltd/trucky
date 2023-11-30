import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useAddMaintenance from './hooks/useAddMaintenance'
import AddMaintenanceView from './views/AddMaintenanceView'
import { useAddMaintenanceProps } from './types'

export const AddMaintenance: FC<useAddMaintenanceProps> = wrap(
    AddMaintenanceView,
    useAddMaintenance
)
