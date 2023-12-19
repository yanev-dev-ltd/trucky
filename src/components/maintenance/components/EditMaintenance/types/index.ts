import { Maintenance } from '@/components/maintenance/types'
import { Dispatch, SetStateAction } from 'react'

export type EditMaintenanceProps = {
    maintenance: Maintenance
    edit: string | undefined
    reset: () => void
    saveMaintenanceField: (field: keyof Maintenance) => void
    setEditedMaintenance: Dispatch<SetStateAction<Maintenance>>
    editedMaintenance: Maintenance | undefined
    deleteMaintenance: () => void
}

export type useEditMaintenanceProps = {
    maintenance: Maintenance
    edit: string | undefined
}