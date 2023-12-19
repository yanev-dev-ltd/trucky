import { FC } from 'react'
import { wrap } from '@/utils/globalUtils'
import useEditMaintenance from './hooks/useEditMaintenance'
import EditMaintenanceView from './views/EditMaintenanceView'
import { useEditMaintenanceProps } from './types'

export const EditMaintenance: FC<useEditMaintenanceProps> = wrap(
    EditMaintenanceView,
    useEditMaintenance
)
