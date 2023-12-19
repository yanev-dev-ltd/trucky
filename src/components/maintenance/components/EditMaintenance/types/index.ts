import { Maintenance } from '@/components/maintenance/types'

export type EditMaintenanceProps = {
    maintenance: Maintenance | undefined
    units?: string
    edit: string | undefined
    reset: () => void
    saveMaintenanceField: (field: keyof Maintenance) => void
    setEditedMaintenance: (maintenance: Maintenance | undefined) => void
    editedMaintenance: Maintenance | undefined
    deleteMaintenance: () => void
}

export type useEditMaintenanceProps = {
    maintenance: Maintenance | undefined
    edit: string | undefined
}