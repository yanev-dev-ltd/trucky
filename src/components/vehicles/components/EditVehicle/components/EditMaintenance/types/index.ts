import { Maintenance } from '../../../../../types'

export type EditMaintenanceProps = {
    handleEditMaintenanceClose: () => void
    maintenance: Maintenance | undefined
    units?: string
}