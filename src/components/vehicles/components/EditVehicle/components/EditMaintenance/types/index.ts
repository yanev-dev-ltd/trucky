import { Maintenance } from '@/components/maintenance/types'

export type EditMaintenanceProps = {
    handleEditMaintenanceClose: () => void
    maintenance: Maintenance | undefined
    units?: string
}